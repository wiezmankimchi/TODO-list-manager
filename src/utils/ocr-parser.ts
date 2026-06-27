import type { VitalSign, StickerItem } from '@/types/procedure';

const VITAL_PATTERNS: { label: string; pattern: RegExp }[] = [
  { label: 'Blood Pressure', pattern: /(?:BP|Blood\s*Pressure)[:\s]*(\d{2,3}\s*\/\s*\d{2,3})/i },
  { label: 'Pulse', pattern: /(?:Pulse|Heart\s*Rate|HR|PR)[:\s]*(\d{2,3})\s*(?:bpm)?/i },
  { label: 'SpO2', pattern: /(?:SpO2|O2\s*Sat|Oxygen)[:\s]*(\d{2,3})\s*%?/i },
  { label: 'Temperature', pattern: /(?:Temp|Temperature)[:\s]*([\d.]+)\s*°?[FC]?/i },
  { label: 'Respiration', pattern: /(?:Resp|Respiration|RR)[:\s]*(\d{1,3})\s*(?:\/min)?/i },
  { label: 'Weight', pattern: /(?:Weight|Wt)[:\s]*([\d.]+)\s*(?:kg|lbs?)?/i },
];

export function parseVitalsText(rawText: string): VitalSign[] {
  const results: VitalSign[] = [];
  for (const { label, pattern } of VITAL_PATTERNS) {
    const match = rawText.match(pattern);
    if (match?.[1]) {
      results.push({ label, value: match[1].trim() });
    }
  }
  return results;
}

const SERIAL_PATTERN = /(?:REF|SN|S\/N|Serial|LOT|Lot)[:\s#]*([A-Z0-9][\w\-/.]{2,})/gi;

export function parseStickerText(rawText: string): StickerItem[] {
  const items: StickerItem[] = [];
  const lines = rawText.split('\n').filter((l) => l.trim().length > 0);

  let currentSerial: string | undefined;
  let descriptionParts: string[] = [];

  for (const line of lines) {
    const serialMatch = SERIAL_PATTERN.exec(line);
    SERIAL_PATTERN.lastIndex = 0;

    if (serialMatch) {
      if (currentSerial || descriptionParts.length > 0) {
        items.push({
          serialNumber: currentSerial,
          description: descriptionParts.join(' ').trim() || line.trim(),
          rawText: line.trim(),
        });
        descriptionParts = [];
      }
      currentSerial = serialMatch[1].trim();
      const remainder = line.replace(serialMatch[0], '').trim();
      if (remainder) {
        descriptionParts.push(remainder);
      }
    } else if (currentSerial) {
      descriptionParts.push(line.trim());
    } else if (line.trim().length > 3) {
      descriptionParts.push(line.trim());
    }
  }

  if (currentSerial || descriptionParts.length > 0) {
    items.push({
      serialNumber: currentSerial,
      description: descriptionParts.join(' ').trim(),
      rawText: lines[lines.length - 1]?.trim() ?? '',
    });
  }

  return items;
}
