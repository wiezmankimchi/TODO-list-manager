# Plan: Transform QRScanner into Dental Procedure Documentation App

## Context

The app is named **QRScanner** but currently contains a generic task-management demo (dashboard, lists, profile) built on Expo SDK 56 with expo-router. The actual purpose is a **dental procedure documentation workflow**: scan a QR code for patient/appointment info, capture images of vitals and stickers, OCR the text, generate a PDF report, and upload everything to OpenDental Cloud.

This plan replaces the task management features with the real QR-based workflow while keeping auth, profile, the UI component library (Button, Card, Input), and the grayscale zinc theme.

---

## What stays, what goes

| Keep unchanged | Remove | Replace / Modify |
|---|---|---|
| `src/app/login.tsx` | `src/context/tasks.tsx` | `src/app/_layout.tsx` (swap TaskProvider → ProcedureProvider) |
| `src/context/auth.tsx` | `src/types/task.ts` | `src/app/(main)/_layout.tsx` (new screens in Stack) |
| `src/components/ui/*` (Button, Card, Input) | `src/utils/task-stats.ts` | `src/app/(main)/index.tsx` (rewrite as workflow home) |
| `src/constants/theme.ts` | `src/app/(main)/lists.tsx` | `src/app/(main)/profile.tsx` (add OpenDental config section) |
| `src/hooks/use-profile-storage.ts` | Task-related test files | `app.json` (add expo-camera plugin, rename app) |
| `src/hooks/use-theme.ts`, `use-color-scheme.ts` | | |

---

## New dependencies

```
npx expo install expo-camera expo-file-system expo-print expo-sharing
npm install @react-native-ml-kit/text-recognition
```

- **expo-camera** — CameraView with `onBarcodeScanned` for QR codes + `takePictureAsync` for image capture
- **@react-native-ml-kit/text-recognition** — on-device OCR via Google ML Kit (works offline, no cloud calls)
- **expo-print** — `printToFileAsync({ html })` to generate PDF from HTML template
- **expo-file-system** — read files as base64 for upload
- **expo-sharing** — optional PDF preview/share

All require dev builds (already set up). Add `expo-camera` to `app.json` plugins with camera permission string.

---

## Workflow: capture first, process later

The field capture phase is fast — no OCR processing between shots. All heavy processing (OCR, PDF) happens in a single batch step after all images are captured.

1. **Scan QR** → extract JSON, confirm patient/appointment data
2. **Capture vitals photo** → just take the picture, store URI
3. **Capture stickers photo** → just take the picture, store URI
4. **Process & Review** → run OCR on both images in batch, parse results, let user edit, generate PDF with all data (QR + vitals + stickers)
5. **Upload** → push PDF + images to OpenDental

## Route structure (after)

```
src/app/
  _layout.tsx         ← AuthProvider + ProcedureProvider (was TaskProvider)
  login.tsx           ← unchanged
  (main)/
    _layout.tsx       ← Stack with auth guard + new screens
    index.tsx         ← Workflow home: "Start Procedure" / "Resume"
    scan.tsx          ← Phase 1: QR scan + confirm
    capture.tsx       ← Phase 2-3: Capture vitals + stickers images (no OCR yet)
    process.tsx       ← Phase 4: Batch OCR + review + PDF generation
    upload.tsx        ← Phase 5: Upload to OpenDental
    profile.tsx       ← Settings + OpenDental API config
```

---

## New files

### Types

**`src/types/procedure.ts`** — Core data structures:
- `QRData` — `{ AptDate, PatName, FName, LName }`
- `VitalSign` — `{ label, value }` (e.g., "Blood Pressure", "120/80")
- `VitalsData` — `{ imageUri, rawOcrText, vitals: VitalSign[], capturedAt }`
- `StickerItem` — `{ serialNumber?, description, rawText }`
- `StickersData` — `{ imageUri, rawOcrText, items: StickerItem[], capturedAt }`
- `ProcedurePhase` — `'idle' | 'scanned' | 'captured' | 'processed' | 'uploaded'`
- `ProcedureState` — full workflow state object

**`src/types/opendental.ts`** — `OpenDentalConfig`, `OpenDentalPatient`, `OpenDentalDocumentPayload`

### State management

**`src/context/procedure.tsx`** — `ProcedureProvider` + `useProcedure()` hook
- `useReducer` for state transitions (SET_QR_DATA, SET_VITALS_IMAGE, SET_STICKERS_IMAGE, SET_OCR_RESULTS, SET_PDF_URI, SET_UPLOAD_RESULT, RESET)
- Persists to AsyncStorage (`@procedure_state`) so in-progress procedures survive crashes
- Exposes `hasIncompleteProcedure` for the resume flow on home screen

### Services

**`src/services/opendental.ts`** — OpenDental Cloud REST API client
- `searchPatient(config, firstName, lastName)` — `GET /patients?LName=&FName=`
- `uploadDocument(config, payload)` — `POST /documents` with base64 DocBytes
- Auth via `Authorization: ODFHIR <DeveloperKey>/<CustomerKey>` headers
- Configuration stored via new `useOpenDentalConfig` hook

### Utilities

**`src/utils/ocr-parser.ts`** — Pure parsing functions:
- `parseVitalsText(rawText): VitalSign[]` — regex for BP, Pulse, O2, Temp, Respiration patterns
- `parseStickerText(rawText): StickerItem[]` — regex for REF/SN/LOT prefixes + descriptions

**`src/utils/pdf-template.ts`** — `generateProcedureHTML(qrData, vitals, stickers): string`
- Professional dental report HTML with inline CSS
- Sections: patient info, vitals table, materials/implants table
- Uses zinc palette for consistent branding

### Hooks

**`src/hooks/use-opendental-config.ts`** — AsyncStorage-backed config hook
- Follows the exact pattern of existing `use-profile-storage.ts`
- Stores `{ baseUrl, developerKey, customerKey }`

### UI Components

**`src/components/ui/StepIndicator.tsx`** — Horizontal step progress bar for workflow screens (Scan → Capture → Process → Upload)
**`src/components/ui/CameraOverlay.tsx`** — Camera capture button + frame guide overlay (reused for QR scan and both image captures)

---

## Screen-by-screen behavior

### Home (`index.tsx` rewrite)
- "Start New Procedure" button (prominent, uses existing Button component)
- If `hasIncompleteProcedure`: show "Resume Procedure" card with patient name + current phase
- Link to profile/settings

### Scan (`scan.tsx`) — Phase 1
- `useCameraPermissions()` → request on mount, show "Open Settings" if denied
- `CameraView` with `barcodeScannerSettings={{ barcodeTypes: ['qr'] }}`
- Parse scanned data as JSON, validate required fields (AptDate, PatName, FName, LName)
- Show parsed data in Card overlay for confirmation
- `scanLock` ref to prevent duplicate scans
- On confirm → save QR data to context, navigate to `/capture`

### Capture (`capture.tsx`) — Phases 2-3 (image capture only, no OCR)
- Two-step capture screen with a step indicator ("Vitals" / "Stickers")
- **Step 1 — Vitals**: Camera preview → capture button → `takePictureAsync()` → show thumbnail preview with "Retake" / "Next" buttons → stores image URI in context
- **Step 2 — Stickers**: Same camera flow → capture → preview → "Retake" / "Done"
- On "Done" → save both image URIs to context, navigate to `/process`
- No OCR runs on this screen — capture is fast and uninterrupted

### Process (`process.tsx`) — Phase 4 (batch OCR + review + PDF)
- On mount, runs OCR on both images in sequence:
  1. `TextRecognition.recognize(vitalsImageUri)` → `parseVitalsText()`
  2. `TextRecognition.recognize(stickersImageUri)` → `parseStickerText()`
- Shows a loading/progress indicator during OCR processing
- After OCR completes, displays all extracted data for review:
  - **Patient info** card (from QR data)
  - **Vitals** section — editable list of vital signs (label + value in Input components)
  - **Stickers/Materials** section — editable list of items (serial number + description)
  - "Add Item" buttons for manual entries if OCR missed something
- **"Generate PDF"** button:
  1. Calls `generateProcedureHTML(qrData, vitals, stickers)` to build HTML
  2. Calls `Print.printToFileAsync({ html })` to create PDF
  3. Stores PDF URI in context
- "Preview PDF" via `Sharing.shareAsync()`
- "Upload to OpenDental" → navigate to `/upload`

### Upload (`upload.tsx`) — Phase 5
- Sequential progress: patient lookup → PDF upload → vitals image upload → stickers image upload
- Patient search by FName/LName; picker if multiple matches; manual PatNum entry if none
- Per-step success/failure indicators
- "Done — Start New" calls `resetProcedure()` and navigates home
- Retry button on failure (state persisted, nothing lost)

### Profile (`profile.tsx` modification)
- Add "OpenDental API Configuration" section below existing profile fields
- Three Input fields: Base URL, Developer Key, Customer Key
- "Save API Settings" button using `useOpenDentalConfig` hook

---

## Implementation order

1. **Install deps + update app.json** — expo-camera plugin, new packages
2. **Define types** — `procedure.ts`, `opendental.ts`
3. **Create ProcedureContext** — replace TaskProvider in root layout, delete task files
4. **Create utilities** — `ocr-parser.ts`, `pdf-template.ts` (pure functions, testable immediately)
5. **Create OpenDental service + config hook** — `opendental.ts`, `use-opendental-config.ts`
6. **Create UI components** — `StepIndicator.tsx`, `CameraOverlay.tsx`
7. **Build screens** — home → scan → capture → process → upload (in order)
8. **Update layout + profile** — new Stack.Screen entries, OpenDental config section
9. **Write tests** — `ocr-parser.test.ts`, `procedure.test.tsx`, `opendental.test.ts`

---

## Verification

### Automated
- `npx tsc --noEmit` — type checking
- `npx expo export --platform web` — build check (camera/OCR will be stubbed on web)
- `npm test` — run updated test suites

### Manual (on device via dev build)
- Login → home screen shows "Start New Procedure"
- Scan a test QR code with `{"AptDate":"2026-06-25","PatName":"Doe, John","FName":"John","LName":"Doe"}`
- Verify parsed data displays correctly, confirm → navigates to capture
- Capture vitals image → preview thumbnail → "Next"
- Capture stickers image → preview thumbnail → "Done" → navigates to process
- Process screen: OCR runs on both images, shows loading, then displays extracted data
- Edit OCR results if needed → "Generate PDF" → preview looks correct
- Upload to OpenDental with real credentials → verify documents appear in patient record
- Kill app mid-workflow → reopen → verify "Resume Procedure" appears with correct state
- Profile screen → save/load OpenDental API config
