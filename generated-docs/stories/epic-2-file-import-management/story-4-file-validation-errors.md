# Story: File Validation and Error Viewing

**Epic:** File Import Management
**Story:** 4 of 6
**Wireframe:** `../../wireframes/screen-4-file-upload-modal.md`

## User Story

**As an** Operations Lead or Analyst
**I want** to view validation errors for failed files
**So that** I can understand what went wrong and fix the issues

## Acceptance Criteria

### Error Display
- [x] Given a file has failed validation, when I open the file upload modal, then I see a "View Errors" button
- [x] Given I click "View Errors", when the errors section expands, then I see a list of validation faults with error codes and descriptions
- [x] Given validation errors are displayed, when I view each error, then I see the FaultedActivityName, Message, and Exception details
- [x] Given there are many errors, when I view the error list, then errors are paginated (10 per page)

### Error Export
- [x] Given validation errors are displayed, when I click "Export Errors to Excel", then an Excel file is downloaded containing all error details

### Retry Validation
- [x] Given a file has failed validation, when I click "Retry Validation", then the system re-runs validation on the existing file
- [x] Given I retry validation, when the process completes successfully, then the status updates to "Complete" and errors are cleared
- [x] Given I retry validation, when the process fails again, then I see updated error messages

### Clear Messaging
- [x] Given a file has validation errors, when I view the error summary, then I see a count of total errors (e.g., "15 validation errors found")
- [x] Given validation fails due to format issues, when I view the errors, then I see clear guidance on the expected format

### Invalid Reasons Display
- [x] Given a file has InvalidReasons from the API response, when I view the modal, then I see an "Invalid Reasons" section below the action buttons
- [x] Given InvalidReasons contains comma-separated values (e.g., "Reason 1,Reason 2"), when displayed, then each reason appears as a separate row in a table
- [x] Given InvalidReasons is empty or null, when I view the modal, then the Invalid Reasons section is hidden

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/file/faults?FileLogId={id}` | Get all faults for uploaded file |
| POST | `/file?FileLogId={id}&FileSettingId={id}&FileFormatId={id}` | Retry validation for a file |

## Implementation Notes
- Use Shadcn `<Accordion>` to show/hide error details in the modal
- Use Shadcn `<Table>` to display validation errors
- Use Shadcn `<Alert>` with destructive variant for error summary
- Implement Excel export using a library like `xlsx` or `exceljs`
- Show loading spinner during retry validation
- Display user-friendly error messages (translate technical errors if needed)
- Parse `InvalidReasons` string by splitting on commas to display each reason in a separate table row
- The Invalid Reasons table should have no column header, just rows of reasons
