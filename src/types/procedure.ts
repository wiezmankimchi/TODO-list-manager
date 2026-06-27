export interface QRData {
  AptDate: string;
  PatName: string;
  FName: string;
  LName: string;
}

export interface VitalSign {
  label: string;
  value: string;
}

export interface VitalsData {
  imageUri: string;
  rawOcrText: string;
  vitals: VitalSign[];
  capturedAt: number;
}

export interface StickerItem {
  serialNumber?: string;
  description: string;
  rawText: string;
}

export interface StickersData {
  imageUri: string;
  rawOcrText: string;
  items: StickerItem[];
  capturedAt: number;
}

export type ProcedurePhase =
  | 'idle'
  | 'scanned'
  | 'captured'
  | 'processed'
  | 'uploaded';

export interface ProcedureState {
  phase: ProcedurePhase;
  qrData: QRData | null;
  vitalsImageUri: string | null;
  stickersImageUri: string | null;
  vitals: VitalsData | null;
  stickers: StickersData | null;
  pdfUri: string | null;
  uploadResult: { success: boolean; documentIds: string[] } | null;
  startedAt: number | null;
}
