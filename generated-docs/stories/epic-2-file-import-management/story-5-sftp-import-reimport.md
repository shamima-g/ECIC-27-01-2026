# Story: SFTP Import and Re-import

**Epic:** File Import Management
**Story:** 5 of 6
**Wireframe:** `../../wireframes/screen-2-portfolio-imports.md`, `../../wireframes/screen-3-other-imports.md`

## User Story

**As an** Operations Lead
**I want** to trigger SFTP import and re-import files for a portfolio
**So that** I can automate file ingestion and recover from errors quickly

## Acceptance Criteria

### SFTP Import
- [ ] Given I am on Portfolio Imports or Other Imports, when I click the "SFTP Import" button in the toolbar, then the system imports all files from the configured SFTP folder
- [ ] Given SFTP import is triggered, when I view the page, then I see a message "SFTP import started - files are being processed"
- [ ] Given SFTP import is running, when files are imported, then status icons update in real-time as files are validated
- [ ] Given SFTP import completes, when I view the page, then I see a summary message (e.g., "SFTP import complete: 12 files imported, 2 failed")

### Re-import Portfolio Files
- [ ] Given I am viewing a portfolio row on Portfolio Imports, when I click the "Re-import" button for that portfolio, then all files for that portfolio are re-imported
- [ ] Given I trigger re-import, when I confirm the action, then existing files for that portfolio are canceled and new files are imported from SFTP
- [ ] Given re-import is running, when I view the portfolio row, then all file status icons show "Busy"
- [ ] Given re-import completes, when I view the page, then I see updated status icons for all files in that portfolio

### Confirmation Dialogs
- [ ] Given I click "SFTP Import", when the dialog appears, then I see a warning "This will import all files from SFTP. Continue?"
- [ ] Given I click "Re-import" for a portfolio, when the dialog appears, then I see a warning "This will cancel and re-import all files for [Portfolio Name]. Continue?"

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/sftp-import` | Import all files from SFTP folder |
| POST | `/file-reimport/{PortfolioId}?ReportBatchId={id}` | Re-import all files for a portfolio |

## Implementation Notes
- Use Shadcn `<Button>` for "SFTP Import" and "Re-import" actions
- Use Shadcn `<AlertDialog>` for confirmation dialogs
- Show loading state on buttons during import operations
- Implement real-time status updates using polling or WebSockets
- Display toast notifications for import completion
