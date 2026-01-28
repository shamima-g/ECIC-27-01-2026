# Story: File Re-import

**Epic:** File Import Management
**Story:** 5 of 6
**Wireframe:** `../../wireframes/screen-2-portfolio-imports.md`, `../../wireframes/screen-3-other-imports.md`

## User Story

**As an** Operations Lead
**I want** to re-import a file that was previously uploaded
**So that** I can correct errors or update data without manual intervention

## Acceptance Criteria

### Re-import File
- [ ] Given I am viewing a file row with status "Uploaded" or "Error", when I click the "Re-import" button, then I see a confirmation dialog
- [ ] Given I confirm the re-import action, when the system processes the request, then the existing file is canceled and I can upload a new file
- [ ] Given re-import is triggered, when the file is canceled, then the file status changes to "Canceled"
- [ ] Given a file has been canceled via re-import, when I view the cell, then I see the upload button to upload a replacement file

### Confirmation Dialog
- [ ] Given I click "Re-import" for a file, when the dialog appears, then I see a warning "This will cancel the current file. You will need to upload a new file. Continue?"
- [ ] Given I click "Cancel" on the confirmation dialog, when the dialog closes, then no action is taken and the file remains unchanged

### Re-import Restrictions
- [ ] Given a file has status "Pending" (not yet uploaded), when I view the row, then the "Re-import" option is not available
- [ ] Given a file has status "Canceled", when I view the row, then the "Re-import" option is not available (user should upload instead)

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| DELETE | `/files/{FileId}` | Cancel/delete an existing file |

## Implementation Notes
- Re-import is a two-step process: (1) Cancel existing file, (2) User uploads new file
- Use Shadcn `<AlertDialog>` for confirmation dialog
- After cancellation, the cell reverts to showing the upload button
- Show toast notification confirming file was canceled
- The upload flow after cancellation uses the same upload modal from Story 3
