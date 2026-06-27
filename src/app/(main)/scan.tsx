import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { useProcedure } from '@/context/procedure';
import { useTheme } from '@/hooks/use-theme';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { ThemedText } from '@/components/themed-text';
import type { QRData } from '@/types/procedure';
import { Camera, RotateCcw } from 'lucide-react-native';

const STEPS = ['Scan', 'Capture', 'Process', 'Upload'];

const REQUIRED_FIELDS: (keyof QRData)[] = ['AptDate', 'PatName', 'FName', 'LName'];

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scannedData, setScannedData] = useState<QRData | null>(null);
  const scanLock = useRef(false);
  const { setQRData } = useProcedure();
  const router = useRouter();
  const theme = useTheme();

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanLock.current) return;
    scanLock.current = true;

    try {
      const parsed = JSON.parse(data);
      const missing = REQUIRED_FIELDS.filter((f) => !parsed[f]);
      if (missing.length > 0) {
        Alert.alert('Invalid QR Code', `Missing fields: ${missing.join(', ')}`, [
          { text: 'Scan Again', onPress: () => { scanLock.current = false; } },
        ]);
        return;
      }
      setScannedData(parsed as QRData);
    } catch {
      Alert.alert('Invalid QR Code', 'The scanned code does not contain valid JSON data.', [
        { text: 'Scan Again', onPress: () => { scanLock.current = false; } },
      ]);
    }
  };

  const handleConfirm = () => {
    if (!scannedData) return;
    setQRData(scannedData);
    router.push('/capture');
  };

  const handleScanAgain = () => {
    setScannedData(null);
    scanLock.current = false;
  };

  if (!permission) {
    return <View style={[styles.container, { backgroundColor: theme.background }]} />;
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, styles.centered, { backgroundColor: theme.background }]}>
        <StepIndicator steps={STEPS} currentStep={0} />
        <View style={styles.permissionContent}>
          <Camera size={48} color={theme.textSecondary} />
          <ThemedText type="subtitle" style={[styles.permissionTitle, { color: theme.text }]}>
            Camera Access Required
          </ThemedText>
          <ThemedText type="small" style={[styles.permissionDesc, { color: theme.textSecondary }]}>
            QRScanner needs camera access to scan QR codes and capture procedure images.
          </ThemedText>
          <Button label="Grant Camera Access" onPress={requestPermission} />
        </View>
      </View>
    );
  }

  if (scannedData) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <StepIndicator steps={STEPS} currentStep={0} />
        <View style={styles.confirmContainer}>
          <Card style={styles.dataCard}>
            <CardContent>
              <ThemedText type="subtitle" style={[styles.cardTitle, { color: theme.text }]}>
                Patient Information
              </ThemedText>
              {REQUIRED_FIELDS.map((field) => (
                <View key={field} style={[styles.dataRow, { borderBottomColor: theme.border }]}>
                  <ThemedText type="small" style={{ color: theme.textSecondary }}>
                    {field}
                  </ThemedText>
                  <ThemedText type="smallBold" style={{ color: theme.text }}>
                    {scannedData[field]}
                  </ThemedText>
                </View>
              ))}
            </CardContent>
          </Card>
          <View style={styles.confirmActions}>
            <Button
              label="Confirm & Continue"
              size="lg"
              onPress={handleConfirm}
              style={styles.confirmButton}
            />
            <Button
              variant="outline"
              label="Scan Again"
              onPress={handleScanAgain}
              leftIcon={<RotateCcw size={16} color={theme.text} />}
            />
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StepIndicator steps={STEPS} currentStep={0} />
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarCodeScanned}
        >
          <View style={styles.scanOverlay}>
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>
            <View style={styles.scanLabelContainer}>
              <ThemedText style={styles.scanLabel}>
                Point camera at QR code
              </ThemedText>
            </View>
          </View>
        </CameraView>
      </View>
    </View>
  );
}

const CORNER_SIZE = 28;
const CORNER_BORDER = 3;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  permissionContent: {
    alignItems: 'center',
    padding: 32,
    gap: 16,
  },
  permissionTitle: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
  },
  permissionDesc: {
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 8,
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
  scanOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 240,
    height: 240,
  },
  corner: {
    position: 'absolute',
    width: CORNER_SIZE,
    height: CORNER_SIZE,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: CORNER_BORDER,
    borderLeftWidth: CORNER_BORDER,
    borderColor: '#fff',
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: CORNER_BORDER,
    borderRightWidth: CORNER_BORDER,
    borderColor: '#fff',
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: CORNER_BORDER,
    borderLeftWidth: CORNER_BORDER,
    borderColor: '#fff',
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: CORNER_BORDER,
    borderRightWidth: CORNER_BORDER,
    borderColor: '#fff',
  },
  scanLabelContainer: {
    marginTop: 24,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scanLabel: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  confirmContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  dataCard: {
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  confirmActions: {
    gap: 12,
  },
  confirmButton: {
    height: 52,
  },
});
