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
- [ ] Given I click a status icon on Portfolio Imports or Other Imports, when the modal opens, then I see the file type, portfolio (if applicable), current status, and available actions
- [ ] Given the file is missing, when I view the modal, then I see an "Upload File" button
- [ ] Given the file is complete or failed, when I view the modal, then I see "Cancel File", "Re-upload", and "View Errors" (if failed) buttons
- [ ] Given the file is busy, when I view the modal, then I see "Cancel File" button and a progress indicator

### Upload File
- [ ] Given I click "Upload File", when the file input appears, then I can browse and select a file from my computer
- [ ] Given I select a file, when I click "Upload", then the file is uploaded to the system and validation begins
- [ ] Given the upload starts, when I view the modal, then I see a progress bar showing upload percentage
- [ ] Given the upload completes, when validation starts, then I see a message "File uploaded successfully, validation in progress"

### Cancel File
- [ ] Given I click "Cancel File", when I confirm the action, then the file is canceled and removed from the staging area
- [ ] Given the file is canceled, when the modal closes, then the status icon updates to "Missing"

### View File Details
- [ ] Given a file is complete, when I view the modal, then I see FileName, FileNamePattern, upload date/time, and record count
- [ ] Given I click "Export File", when the action completes, then the original uploaded file is downloaded to my computer

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/portfolio-file?ReportMonth={month}&ReportYear={year}&PortfolioId={id}&FileTypeId={id}` | Get portfolio file details |
| GET | `/other-file?ReportMonth={month}&ReportYear={year}&FileType={type}&FileSource={source}&FileFormat={format}` | Get other file details |
| POST | `/file/upload?FileSettingId={id}&FilelogId={id}&FileName={name}&User={user}&ReportBatchId={id}` | Upload a file |
| DELETE | `/file?FileLogId={id}&FileSettingId={id}&ReportBatchId={id}` | Cancel a file |
| GET | `/file?FilePath={path}` | Export/download uploaded file |

## Implementation Notes
- Use Shadcn `<Dialog>` component for the modal
- Use Shadcn `<Button>` with variants (default, destructive, outline)
- Implement file upload with progress tracking (use browser File API)
- Use Shadcn `<Progress>` component for upload progress bar
- Show confirmation dialog before canceling a file
