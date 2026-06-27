import type { QRData, VitalsData, StickersData } from '@/types/procedure';

export function generateProcedureHTML(
  qrData: QRData,
  vitals: VitalsData,
  stickers: StickersData,
): string {
  const vitalsRows = vitals.vitals
    .map(
      (v) =>
        `<tr><td>${escapeHtml(v.label)}</td><td>${escapeHtml(v.value)}</td></tr>`,
    )
    .join('');

  const stickerRows = stickers.items
    .map(
      (s) =>
        `<tr><td>${escapeHtml(s.serialNumber ?? '—')}</td><td>${escapeHtml(s.description)}</td></tr>`,
    )
    .join('');

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: -apple-system, system-ui, sans-serif; color: #09090b; padding: 40px; }
  h1 { font-size: 22px; margin-bottom: 4px; }
  .subtitle { color: #71717a; font-size: 13px; margin-bottom: 24px; }
  .section { margin-bottom: 24px; }
  .section-title { font-size: 15px; font-weight: 600; margin-bottom: 8px; padding-bottom: 4px; border-bottom: 1px solid #e4e4e7; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .info-item label { font-size: 11px; color: #71717a; text-transform: uppercase; letter-spacing: 0.5px; }
  .info-item p { font-size: 14px; margin-top: 2px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { padding: 8px 12px; text-align: left; border-bottom: 1px solid #e4e4e7; }
  th { background: #f4f4f5; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
  .footer { margin-top: 40px; padding-top: 12px; border-top: 1px solid #e4e4e7; font-size: 11px; color: #a1a1aa; text-align: center; }
</style>
</head>
<body>
  <h1>Dental Procedure Report</h1>
  <p class="subtitle">Generated ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

  <div class="section">
    <div class="section-title">Patient Information</div>
    <div class="info-grid">
      <div class="info-item">
        <label>Patient Name</label>
        <p>${escapeHtml(qrData.PatName)}</p>
      </div>
      <div class="info-item">
        <label>Appointment Date</label>
        <p>${escapeHtml(qrData.AptDate)}</p>
      </div>
      <div class="info-item">
        <label>First Name</label>
        <p>${escapeHtml(qrData.FName)}</p>
      </div>
      <div class="info-item">
        <label>Last Name</label>
        <p>${escapeHtml(qrData.LName)}</p>
      </div>
    </div>
  </div>

  <div class="section">
    <div class="section-title">Vital Signs</div>
    <table>
      <thead><tr><th>Measurement</th><th>Value</th></tr></thead>
      <tbody>${vitalsRows || '<tr><td colspan="2">No vitals recorded</td></tr>'}</tbody>
    </table>
  </div>

  <div class="section">
    <div class="section-title">Materials &amp; Implants</div>
    <table>
      <thead><tr><th>Serial / Reference</th><th>Description</th></tr></thead>
      <tbody>${stickerRows || '<tr><td colspan="2">No materials recorded</td></tr>'}</tbody>
    </table>
  </div>

  <div class="footer">
    QRScanner Dental Procedure Documentation
  </div>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
