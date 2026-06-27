import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import TextRecognition from '@react-native-ml-kit/text-recognition';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { useRouter } from 'expo-router';
import { useProcedure } from '@/context/procedure';
import { useTheme } from '@/hooks/use-theme';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { ThemedText } from '@/components/themed-text';
import { parseVitalsText, parseStickerText } from '@/utils/ocr-parser';
import { generateProcedureHTML } from '@/utils/pdf-template';
import type { VitalSign, StickerItem, VitalsData, StickersData } from '@/types/procedure';
import { FileText, Plus, Share2, Trash2, Upload } from 'lucide-react-native';

const STEPS = ['Scan', 'Capture', 'Process', 'Upload'];

export default function ProcessScreen() {
  const { state, setOCRResults, setPdfUri } = useProcedure();
  const theme = useTheme();
  const router = useRouter();

  const [processing, setProcessing] = useState(true);
  const [vitals, setVitals] = useState<VitalSign[]>([]);
  const [vitalsRawText, setVitalsRawText] = useState('');
  const [stickerItems, setStickerItems] = useState<StickerItem[]>([]);
  const [stickersRawText, setStickersRawText] = useState('');
  const [generatingPdf, setGeneratingPdf] = useState(false);
  const [pdfReady, setPdfReady] = useState(false);

  useEffect(() => {
    runOCR();
  }, []);

  const runOCR = async () => {
    setProcessing(true);
    try {
      let vitalsText = '';
      if (state.vitalsImageUri) {
        const vitalsResult = await TextRecognition.recognize(state.vitalsImageUri);
        vitalsText = vitalsResult.text;
      }
      setVitalsRawText(vitalsText);
      setVitals(parseVitalsText(vitalsText));

      let stickersText = '';
      if (state.stickersImageUri) {
        const stickersResult = await TextRecognition.recognize(state.stickersImageUri);
        stickersText = stickersResult.text;
      }
      setStickersRawText(stickersText);
      setStickerItems(parseStickerText(stickersText));
    } catch (err) {
      Alert.alert('OCR Error', 'Failed to extract text from images. You can manually enter the data below.');
    } finally {
      setProcessing(false);
    }
  };

  const updateVital = (index: number, field: 'label' | 'value', text: string) => {
    setVitals((prev) =>
      prev.map((v, i) => (i === index ? { ...v, [field]: text } : v)),
    );
  };

  const addVital = () => {
    setVitals((prev) => [...prev, { label: '', value: '' }]);
  };

  const removeVital = (index: number) => {
    setVitals((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSticker = (index: number, field: keyof StickerItem, text: string) => {
    setStickerItems((prev) =>
      prev.map((s, i) => (i === index ? { ...s, [field]: text } : s)),
    );
  };

  const addSticker = () => {
    setStickerItems((prev) => [...prev, { description: '', rawText: '' }]);
  };

  const removeSticker = (index: number) => {
    setStickerItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGeneratePdf = async () => {
    if (!state.qrData) return;

    const vitalsData: VitalsData = {
      imageUri: state.vitalsImageUri ?? '',
      rawOcrText: vitalsRawText,
      vitals,
      capturedAt: Date.now(),
    };
    const stickersData: StickersData = {
      imageUri: state.stickersImageUri ?? '',
      rawOcrText: stickersRawText,
      items: stickerItems,
      capturedAt: Date.now(),
    };

    setOCRResults(vitalsData, stickersData);
    setGeneratingPdf(true);

    try {
      const html = generateProcedureHTML(state.qrData, vitalsData, stickersData);
      const { uri } = await Print.printToFileAsync({ html, width: 612, height: 792 });
      setPdfUri(uri);
      setPdfReady(true);
    } catch (err) {
      Alert.alert('PDF Error', 'Failed to generate the PDF report.');
    } finally {
      setGeneratingPdf(false);
    }
  };

  const handleSharePdf = async () => {
    if (state.pdfUri) {
      await Sharing.shareAsync(state.pdfUri);
    }
  };

  if (processing) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <StepIndicator steps={STEPS} currentStep={2} />
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText type="subtitle" style={{ color: theme.text, marginTop: 16 }}>
            Processing Images...
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Extracting text from vitals and stickers photos
          </ThemedText>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <StepIndicator steps={STEPS} currentStep={2} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Patient Info */}
        {state.qrData && (
          <Card style={styles.card}>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Patient</ThemedText>
                <ThemedText type="smallBold" style={{ color: theme.text }}>{state.qrData.PatName}</ThemedText>
              </View>
              <View style={styles.infoRow}>
                <ThemedText type="small" style={{ color: theme.textSecondary }}>Date</ThemedText>
                <ThemedText type="smallBold" style={{ color: theme.text }}>{state.qrData.AptDate}</ThemedText>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Vitals Section */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Vital Signs</CardTitle>
          </CardHeader>
          <CardContent>
            {vitals.map((vital, index) => (
              <View key={index} style={styles.editRow}>
                <Input
                  placeholder="Label"
                  value={vital.label}
                  onChangeText={(t) => updateVital(index, 'label', t)}
                  style={styles.inputHalf}
                />
                <Input
                  placeholder="Value"
                  value={vital.value}
                  onChangeText={(t) => updateVital(index, 'value', t)}
                  style={styles.inputHalf}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onPress={() => removeVital(index)}
                >
                  <Trash2 size={16} color={theme.destructive} />
                </Button>
              </View>
            ))}
            <Button
              variant="outline"
              size="sm"
              label="Add Vital"
              onPress={addVital}
              leftIcon={<Plus size={14} color={theme.text} />}
              style={styles.addButton}
            />
          </CardContent>
        </Card>

        {/* Stickers Section */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Materials & Implants</CardTitle>
          </CardHeader>
          <CardContent>
            {stickerItems.map((item, index) => (
              <View key={index} style={styles.editRow}>
                <Input
                  placeholder="Serial/Ref #"
                  value={item.serialNumber ?? ''}
                  onChangeText={(t) => updateSticker(index, 'serialNumber', t)}
                  style={styles.inputHalf}
                />
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChangeText={(t) => updateSticker(index, 'description', t)}
                  style={styles.inputHalf}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onPress={() => removeSticker(index)}
                >
                  <Trash2 size={16} color={theme.destructive} />
                </Button>
              </View>
            ))}
            <Button
              variant="outline"
              size="sm"
              label="Add Item"
              onPress={addSticker}
              leftIcon={<Plus size={14} color={theme.text} />}
              style={styles.addButton}
            />
          </CardContent>
        </Card>

        {/* PDF Actions */}
        <View style={styles.pdfActions}>
          {!pdfReady ? (
            <Button
              label="Generate PDF"
              size="lg"
              onPress={handleGeneratePdf}
              loading={generatingPdf}
              leftIcon={<FileText size={20} color={theme.primaryForeground} />}
              style={styles.actionButton}
            />
          ) : (
            <>
              <Button
                variant="outline"
                label="Preview / Share PDF"
                onPress={handleSharePdf}
                leftIcon={<Share2 size={16} color={theme.text} />}
                style={styles.actionButton}
              />
              <Button
                label="Upload to OpenDental"
                size="lg"
                onPress={() => router.push('/upload')}
                leftIcon={<Upload size={20} color={theme.primaryForeground} />}
                style={styles.actionButton}
              />
            </>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingContent: {
    alignItems: 'center',
    padding: 32,
    gap: 4,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 16,
    marginVertical: 0,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'transparent',
  },
  editRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  inputHalf: {
    flex: 1,
  },
  addButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  pdfActions: {
    gap: 12,
    marginTop: 8,
  },
  actionButton: {
    height: 52,
  },
});
