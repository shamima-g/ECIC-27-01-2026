# Story: File Upload Modal

**Epic:** File Import Management
**Story:** 3 of 6
**Wireframe:** `../../wireframes/screen-4-file-upload-modal.md`

## User Story

**As an** Operations Lead
**I want** to upload, cancel, and view details for individual files
**So that** I can manage the file import process effectively

## Acceptance Criteria

### Modal Display
- [x] Given I click a status icon on Portfolio Imports or Other Imports, when the modal opens, then I see the file type, portfolio (if applicable), current status, and available actions
- [x] Given the file is missing (StatusColor=⏱️), when I view the modal, then I see an "Upload File" button
- [x] Given the file is complete (StatusColor=✅) or has errors (StatusColor=⚠️/‼️), when I view the modal, then I see "Cancel File", "Re-upload", and "View Errors" (if failed) buttons
- [x] Given the file is busy (StatusColor=⏳), when I view the modal, then I see "Cancel File" button and a progress indicator

### Upload File
- [x] Given I click "Upload File", when the file input appears, then I can browse and select a file from my computer
- [x] Given I select a file, when I click "Upload", then the file is uploaded as binary (application/octet-stream) per OpenAPI spec
- [x] Given the upload starts, when I view the modal, then I see a progress bar showing upload percentage
- [x] Given the upload completes, when validation starts, then I see a message "File uploaded successfully, validation in progress"

### FileSettingId Lookup (for cells with no prior uploads)
- [x] Given a cell has never had a file uploaded (FileSettingId=0 from API), when the modal opens, then the correct FileSettingId is looked up from a local mapping based on portfolio name and file type
- [x] Given the FileSettingId is looked up successfully, when I upload a file, then the correct FileSettingId is sent to the API

### Client-Side Filename Validation
- [x] Given I select a file, when the filename does not match the expected pattern (e.g., `*Income*.csv`), then I see a warning message explaining the required filename format
- [x] Given the filename validation fails, when I view the warning, then I see the expected pattern (e.g., "Expected pattern: *Income*.csv")
- [x] Given the filename validation fails, when I try to upload, then the Upload button is disabled until I select a valid file

### Cancel File
- [x] Given I click "Cancel File", when I confirm the action, then the file is canceled and removed from the staging area
- [x] Given the file is canceled, when the modal closes, then the status icon updates to "Not Uploaded" (⏱️)

### View File Details
- [x] Given a file is complete, when I view the modal, then I see FileName, FileNamePattern, upload date/time, and record count

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/portfolio-file?ReportMonth={month}&ReportYear={year}&PortfolioId={id}&FileTypeId={id}` | Get portfolio file details |
| GET | `/other-file?ReportMonth={month}&ReportYear={year}&FileType={type}&FileSource={source}&FileFormat={format}` | Get other file details |
| POST | `/file/upload?FileSettingId={id}&FilelogId={id}&FileName={name}&User={user}&ReportBatchId={id}` | Upload a file (binary body) |
| DELETE | `/file?FileLogId={id}&FileSettingId={id}&ReportBatchId={id}` | Cancel a file |

## Upload API Details

The `/file/upload` endpoint requires:
- **Content-Type:** `application/octet-stream` (raw binary)
- **Body:** Raw file data (not FormData)
- **Query Parameters:**
  - `FileSettingId` (required): File setting identifier
  - `FilelogId` (optional): Only for re-uploads, omit for new uploads
  - `FileName` (required): Name of the file being uploaded
  - `User` (required): Username from session
  - `ReportBatchId` (required): Current batch ID

Uses `fileImporterUpload()` from `lib/api/client.ts` for binary uploads.

## Implementation Notes
- Use Shadcn `<Dialog>` component for the modal
- Use Shadcn `<Button>` with variants (default, destructive, outline)
- Use `fileImporterUpload()` for binary file uploads with `application/octet-stream`
- FilelogId is sent as `0` for new uploads, existing ID for re-uploads
- User name retrieved from session via `useSession()` hook
- Use Shadcn `<Progress>` component for upload progress bar
- Show confirmation dialog before canceling a file
- Status detection handles both emoji (✅, ⏱️, ⚠️, ⏳, ‼️) and legacy (Green, Gray, Red, Yellow) values
- `lib/constants/file-settings-map.ts` contains FileSettingId and filename pattern mappings for each portfolio/file type combination
- Client-side filename validation uses pattern matching (e.g., `*Income*.csv` checks for "income" keyword and ".csv" extension)
