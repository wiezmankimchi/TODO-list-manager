export interface OpenDentalConfig {
  baseUrl: string;
  developerKey: string;
  customerKey: string;
}

export interface OpenDentalPatient {
  PatNum: number;
  LName: string;
  FName: string;
}

export interface OpenDentalDocumentPayload {
  PatNum: number;
  DocCategory: number;
  FileName: string;
  DocBytes: string;
  DateCreated: string;
  Description: string;
}
