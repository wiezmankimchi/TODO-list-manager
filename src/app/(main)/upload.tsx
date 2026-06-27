import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useProcedure } from '@/context/procedure';
import { useTheme } from '@/hooks/use-theme';
import { useOpenDentalConfig } from '@/hooks/use-opendental-config';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { ThemedText } from '@/components/themed-text';
import { searchPatient, uploadProcedureDocuments } from '@/services/opendental';
import type { OpenDentalPatient } from '@/types/opendental';
import {
  AlertCircle,
  Check,
  CheckCircle,
  RefreshCw,
  Search,
  Upload as UploadIcon,
  User,
} from 'lucide-react-native';

const STEPS = ['Scan', 'Capture', 'Process', 'Upload'];

type UploadStep = 'find_patient' | 'uploading' | 'success' | 'error';

export default function UploadScreen() {
  const { state, setUploadResult, resetProcedure } = useProcedure();
  const { config, isConfigured } = useOpenDentalConfig();
  const theme = useTheme();
  const router = useRouter();

  const [uploadStep, setUploadStep] = useState<UploadStep>('find_patient');
  const [searching, setSearching] = useState(false);
  const [patients, setPatients] = useState<OpenDentalPatient[]>([]);
  const [selectedPatNum, setSelectedPatNum] = useState<number | null>(null);
  const [manualPatNum, setManualPatNum] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [uploadProgress, setUploadProgress] = useState('');

  const handleSearch = async () => {
    if (!state.qrData) return;
    setSearching(true);
    setErrorMessage('');
    try {
      const results = await searchPatient(config, state.qrData.FName, state.qrData.LName);
      setPatients(results);
      if (results.length === 1) {
        setSelectedPatNum(results[0].PatNum);
      } else if (results.length === 0) {
        setErrorMessage('No matching patients found. Enter PatNum manually below.');
      }
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Patient search failed');
    } finally {
      setSearching(false);
    }
  };

  const handleUpload = async () => {
    const patNum = selectedPatNum ?? (manualPatNum ? parseInt(manualPatNum, 10) : null);
    if (!patNum || !state.pdfUri || !state.vitalsImageUri || !state.stickersImageUri) return;

    setUploadStep('uploading');
    setUploadProgress('Uploading PDF report...');
    try {
      const docIds = await uploadProcedureDocuments(
        config,
        patNum,
        state.pdfUri,
        state.vitalsImageUri,
        state.stickersImageUri,
      );
      setUploadResult({ success: true, documentIds: docIds });
      setUploadStep('success');
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : 'Upload failed');
      setUploadStep('error');
    }
  };

  const handleDone = () => {
    resetProcedure();
    router.replace('/');
  };

  if (!isConfigured) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <StepIndicator steps={STEPS} currentStep={3} />
        <View style={styles.messageContent}>
          <AlertCircle size={48} color={theme.destructive} />
          <ThemedText type="subtitle" style={{ color: theme.text, textAlign: 'center' }}>
            OpenDental Not Configured
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: 'center' }}>
            Please configure your OpenDental API settings in Profile & Settings before uploading.
          </ThemedText>
          <Button label="Go to Settings" onPress={() => router.push('/profile')} />
        </View>
      </View>
    );
  }

  if (uploadStep === 'uploading') {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <StepIndicator steps={STEPS} currentStep={3} />
        <View style={styles.messageContent}>
          <ActivityIndicator size="large" color={theme.primary} />
          <ThemedText type="subtitle" style={{ color: theme.text, marginTop: 16 }}>
            Uploading to OpenDental
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            {uploadProgress}
          </ThemedText>
        </View>
      </View>
    );
  }

  if (uploadStep === 'success') {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <StepIndicator steps={STEPS} currentStep={3} />
        <View style={styles.messageContent}>
          <CheckCircle size={64} color="#22c55e" />
          <ThemedText type="subtitle" style={{ color: theme.text, textAlign: 'center' }}>
            Upload Complete
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: 'center' }}>
            PDF and images have been uploaded to the patient record.
          </ThemedText>
          <Button label="Start New Procedure" size="lg" onPress={handleDone} style={styles.doneButton} />
        </View>
      </View>
    );
  }

  if (uploadStep === 'error') {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <StepIndicator steps={STEPS} currentStep={3} />
        <View style={styles.messageContent}>
          <AlertCircle size={48} color={theme.destructive} />
          <ThemedText type="subtitle" style={{ color: theme.text, textAlign: 'center' }}>
            Upload Failed
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary, textAlign: 'center' }}>
            {errorMessage}
          </ThemedText>
          <Button
            label="Retry Upload"
            onPress={() => { setUploadStep('find_patient'); setErrorMessage(''); }}
            leftIcon={<RefreshCw size={16} color={theme.primaryForeground} />}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StepIndicator steps={STEPS} currentStep={3} />
      <ScrollView contentContainerStyle={styles.scrollContent}>

        {/* Patient Lookup */}
        <Card style={styles.card}>
          <CardHeader>
            <CardTitle>Find Patient</CardTitle>
            <CardDescription>
              Searching for {state.qrData?.FName} {state.qrData?.LName}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              label="Search OpenDental"
              variant="outline"
              onPress={handleSearch}
              loading={searching}
              leftIcon={<Search size={16} color={theme.text} />}
              style={styles.searchButton}
            />

            {errorMessage && !patients.length && (
              <ThemedText type="small" style={[styles.errorText, { color: theme.destructive }]}>
                {errorMessage}
              </ThemedText>
            )}

            {patients.length > 1 && (
              <View style={styles.patientList}>
                <ThemedText type="small" style={{ color: theme.textSecondary, marginBottom: 8 }}>
                  Multiple patients found. Select one:
                </ThemedText>
                {patients.map((p) => (
                  <Button
                    key={p.PatNum}
                    variant={selectedPatNum === p.PatNum ? 'default' : 'outline'}
                    label={`${p.FName} ${p.LName} (${p.PatNum})`}
                    leftIcon={<User size={14} color={selectedPatNum === p.PatNum ? theme.primaryForeground : theme.text} />}
                    onPress={() => setSelectedPatNum(p.PatNum)}
                    style={styles.patientButton}
                  />
                ))}
              </View>
            )}

            {patients.length === 1 && selectedPatNum && (
              <View style={[styles.selectedPatient, { backgroundColor: theme.secondary }]}>
                <Check size={16} color="#22c55e" />
                <ThemedText type="smallBold" style={{ color: theme.text }}>
                  {patients[0].FName} {patients[0].LName} — PatNum {patients[0].PatNum}
                </ThemedText>
              </View>
            )}

            <Input
              label="Or enter PatNum manually"
              placeholder="12345"
              value={manualPatNum}
              onChangeText={setManualPatNum}
              keyboardType="number-pad"
            />
          </CardContent>
        </Card>

        {/* Upload Button */}
        <Button
          label="Upload All Documents"
          size="lg"
          onPress={handleUpload}
          disabled={!selectedPatNum && !manualPatNum}
          leftIcon={<UploadIcon size={20} color={theme.primaryForeground} />}
          style={styles.uploadButton}
        />
      </ScrollView>
    </View>
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
  messageContent: {
    alignItems: 'center',
    padding: 32,
    gap: 12,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 20,
    marginVertical: 0,
  },
  searchButton: {
    marginBottom: 12,
  },
  errorText: {
    marginBottom: 12,
  },
  patientList: {
    marginBottom: 16,
  },
  patientButton: {
    marginBottom: 8,
  },
  selectedPatient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  uploadButton: {
    height: 52,
  },
  doneButton: {
    height: 52,
    marginTop: 8,
  },
});
