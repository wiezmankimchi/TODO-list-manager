import React, { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  ProcedureState,
  QRData,
  VitalsData,
  StickersData,
} from '@/types/procedure';

const PROCEDURE_STORAGE_KEY = '@procedure_state';

const initialState: ProcedureState = {
  phase: 'idle',
  qrData: null,
  vitalsImageUri: null,
  stickersImageUri: null,
  vitals: null,
  stickers: null,
  pdfUri: null,
  uploadResult: null,
  startedAt: null,
};

type Action =
  | { type: 'SET_QR_DATA'; payload: QRData }
  | { type: 'SET_VITALS_IMAGE'; payload: string }
  | { type: 'SET_STICKERS_IMAGE'; payload: string }
  | { type: 'SET_OCR_RESULTS'; payload: { vitals: VitalsData; stickers: StickersData } }
  | { type: 'SET_PDF_URI'; payload: string }
  | { type: 'SET_UPLOAD_RESULT'; payload: { success: boolean; documentIds: string[] } }
  | { type: 'RESET' }
  | { type: 'RESTORE'; payload: ProcedureState };

function procedureReducer(state: ProcedureState, action: Action): ProcedureState {
  switch (action.type) {
    case 'SET_QR_DATA':
      return {
        ...state,
        phase: 'scanned',
        qrData: action.payload,
        startedAt: state.startedAt ?? Date.now(),
      };
    case 'SET_VITALS_IMAGE':
      return { ...state, vitalsImageUri: action.payload };
    case 'SET_STICKERS_IMAGE':
      return { ...state, phase: 'captured', stickersImageUri: action.payload };
    case 'SET_OCR_RESULTS':
      return {
        ...state,
        phase: 'processed',
        vitals: action.payload.vitals,
        stickers: action.payload.stickers,
      };
    case 'SET_PDF_URI':
      return { ...state, pdfUri: action.payload };
    case 'SET_UPLOAD_RESULT':
      return { ...state, phase: 'uploaded', uploadResult: action.payload };
    case 'RESET':
      return initialState;
    case 'RESTORE':
      return action.payload;
    default:
      return state;
  }
}

interface ProcedureContextType {
  state: ProcedureState;
  isLoaded: boolean;
  hasIncompleteProcedure: boolean;
  setQRData: (data: QRData) => void;
  setVitalsImage: (uri: string) => void;
  setStickersImage: (uri: string) => void;
  setOCRResults: (vitals: VitalsData, stickers: StickersData) => void;
  setPdfUri: (uri: string) => void;
  setUploadResult: (result: { success: boolean; documentIds: string[] }) => void;
  resetProcedure: () => void;
}

const ProcedureContext = createContext<ProcedureContextType | null>(null);

export function useProcedure() {
  const context = useContext(ProcedureContext);
  if (!context) {
    throw new Error('useProcedure must be wrapped in a ProcedureProvider');
  }
  return context;
}

export function ProcedureProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(procedureReducer, initialState);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    AsyncStorage.getItem(PROCEDURE_STORAGE_KEY).then((raw) => {
      if (raw) {
        dispatch({ type: 'RESTORE', payload: JSON.parse(raw) });
      }
      hasLoadedRef.current = true;
      setIsLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current) return;
    AsyncStorage.setItem(PROCEDURE_STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const hasIncompleteProcedure = state.phase !== 'idle' && state.phase !== 'uploaded';

  const setQRData = useCallback((data: QRData) => {
    dispatch({ type: 'SET_QR_DATA', payload: data });
  }, []);

  const setVitalsImage = useCallback((uri: string) => {
    dispatch({ type: 'SET_VITALS_IMAGE', payload: uri });
  }, []);

  const setStickersImage = useCallback((uri: string) => {
    dispatch({ type: 'SET_STICKERS_IMAGE', payload: uri });
  }, []);

  const setOCRResults = useCallback((vitals: VitalsData, stickers: StickersData) => {
    dispatch({ type: 'SET_OCR_RESULTS', payload: { vitals, stickers } });
  }, []);

  const setPdfUri = useCallback((uri: string) => {
    dispatch({ type: 'SET_PDF_URI', payload: uri });
  }, []);

  const setUploadResult = useCallback(
    (result: { success: boolean; documentIds: string[] }) => {
      dispatch({ type: 'SET_UPLOAD_RESULT', payload: result });
    },
    [],
  );

  const resetProcedure = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  return (
    <ProcedureContext.Provider
      value={{
        state,
        isLoaded,
        hasIncompleteProcedure,
        setQRData,
        setVitalsImage,
        setStickersImage,
        setOCRResults,
        setPdfUri,
        setUploadResult,
        resetProcedure,
      }}
    >
      {children}
    </ProcedureContext.Provider>
  );
}
