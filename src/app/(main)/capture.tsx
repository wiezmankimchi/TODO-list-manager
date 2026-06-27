import React, { useState, useRef } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { CameraView, type CameraType } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useProcedure } from '@/context/procedure';
import { useTheme } from '@/hooks/use-theme';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { CameraOverlay } from '@/components/ui/CameraOverlay';
import { Button } from '@/components/ui/Button';
import { ThemedText } from '@/components/themed-text';
import { ArrowRight, RotateCcw } from 'lucide-react-native';

const STEPS = ['Scan', 'Capture', 'Process', 'Upload'];

type CaptureStep = 'vitals' | 'stickers';

export default function CaptureScreen() {
  const [step, setStep] = useState<CaptureStep>('vitals');
  const [vitalsUri, setVitalsUri] = useState<string | null>(null);
  const [stickersUri, setStickersUri] = useState<string | null>(null);
  const [capturing, setCapturing] = useState(false);
  const [previewUri, setPreviewUri] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);
  const { setVitalsImage, setStickersImage } = useProcedure();
  const router = useRouter();
  const theme = useTheme();

  const handleCapture = async () => {
    if (!cameraRef.current || capturing) return;
    setCapturing(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ quality: 0.8 });
      if (photo) {
        setPreviewUri(photo.uri);
      }
    } finally {
      setCapturing(false);
    }
  };

  const handleRetake = () => {
    setPreviewUri(null);
  };

  const handleAcceptVitals = () => {
    if (!previewUri) return;
    setVitalsUri(previewUri);
    setVitalsImage(previewUri);
    setPreviewUri(null);
    setStep('stickers');
  };

  const handleAcceptStickers = () => {
    if (!previewUri) return;
    setStickersUri(previewUri);
    setStickersImage(previewUri);
    router.push('/process');
  };

  const isVitalsStep = step === 'vitals';
  const label = isVitalsStep ? 'Capture Vitals' : 'Capture Stickers';

  if (previewUri) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StepIndicator steps={STEPS} currentStep={1} />
        <View style={styles.previewHeader}>
          <ThemedText type="subtitle" style={{ color: theme.text }}>
            {label}
          </ThemedText>
          <ThemedText type="small" style={{ color: theme.textSecondary }}>
            Review the captured image before continuing.
          </ThemedText>
        </View>
        <View style={styles.previewContainer}>
          <Image source={{ uri: previewUri }} style={styles.previewImage} resizeMode="contain" />
        </View>
        <View style={styles.previewActions}>
          <Button
            variant="outline"
            label="Retake"
            onPress={handleRetake}
            leftIcon={<RotateCcw size={16} color={theme.text} />}
            style={styles.actionButton}
          />
          <Button
            label={isVitalsStep ? 'Next: Stickers' : 'Done'}
            onPress={isVitalsStep ? handleAcceptVitals : handleAcceptStickers}
            rightIcon={<ArrowRight size={16} color={theme.primaryForeground} />}
            style={styles.actionButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StepIndicator steps={STEPS} currentStep={1} />
      <View style={styles.cameraContainer}>
        <CameraView ref={cameraRef} style={styles.camera}>
          <CameraOverlay
            onCapture={handleCapture}
            label={label}
            capturing={capturing}
          />
        </CameraView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cameraContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  previewHeader: {
    padding: 20,
    paddingBottom: 8,
    gap: 4,
  },
  previewContainer: {
    flex: 1,
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
  },
  previewImage: {
    flex: 1,
  },
  previewActions: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 48,
  },
});
