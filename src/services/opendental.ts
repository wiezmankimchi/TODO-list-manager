import * as FileSystem from 'expo-file-system';
import type {
  OpenDentalConfig,
  OpenDentalPatient,
  OpenDentalDocumentPayload,
} from '@/types/opendental';

function buildHeaders(config: OpenDentalConfig): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `ODFHIR ${config.developerKey}/${config.customerKey}`,
  };
}

export async function searchPatient(
  config: OpenDentalConfig,
  firstName: string,
  lastName: string,
): Promise<OpenDentalPatient[]> {
  const url = `${config.baseUrl}/patients?LName=${encodeURIComponent(lastName)}&FName=${encodeURIComponent(firstName)}`;
  const response = await fetch(url, {
    method: 'GET',
    headers: buildHeaders(config),
  });
  if (!response.ok) {
    throw new Error(`Patient search failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function uploadDocument(
  config: OpenDentalConfig,
  payload: OpenDentalDocumentPayload,
): Promise<{ DocNum: number }> {
  const response = await fetch(`${config.baseUrl}/documents`, {
    method: 'POST',
    headers: buildHeaders(config),
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error(`Document upload failed: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function uploadProcedureDocuments(
  config: OpenDentalConfig,
  patNum: number,
  pdfUri: string,
  vitalsImageUri: string,
  stickersImageUri: string,
): Promise<string[]> {
  const today = new Date().toISOString().split('T')[0];
  const docIds: string[] = [];

  const pdfBase64 = await FileSystem.readAsStringAsync(pdfUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const pdfResult = await uploadDocument(config, {
    PatNum: patNum,
    DocCategory: 227,
    FileName: `procedure-report-${today}.pdf`,
    DocBytes: pdfBase64,
    DateCreated: today,
    Description: 'Dental Procedure Report',
  });
  docIds.push(String(pdfResult.DocNum));

  const vitalsBase64 = await FileSystem.readAsStringAsync(vitalsImageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const vitalsResult = await uploadDocument(config, {
    PatNum: patNum,
    DocCategory: 227,
    FileName: `vitals-${today}.jpg`,
    DocBytes: vitalsBase64,
    DateCreated: today,
    Description: 'Patient Vitals Photo',
  });
  docIds.push(String(vitalsResult.DocNum));

  const stickersBase64 = await FileSystem.readAsStringAsync(stickersImageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const stickersResult = await uploadDocument(config, {
    PatNum: patNum,
    DocCategory: 227,
    FileName: `stickers-${today}.jpg`,
    DocBytes: stickersBase64,
    DateCreated: today,
    Description: 'Materials & Implants Stickers Photo',
  });
  docIds.push(String(stickersResult.DocNum));

  return docIds;
}
