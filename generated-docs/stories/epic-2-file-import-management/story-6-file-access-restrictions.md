# Story: File Access Restrictions

**Epic:** File Import Management
**Story:** 6 of 6
**Wireframe:** `../../wireframes/screen-2-portfolio-imports.md`, `../../wireframes/screen-3-other-imports.md`

## User Story

**As a** System Administrator
**I want** file upload screens to be locked after the first approval
**So that** data integrity is maintained during the approval process

## Acceptance Criteria

### Access Control - Data Preparation Phase
- [ ] Given the workflow is in "Data Preparation" phase, when I navigate to Portfolio Imports, then I can upload, cancel, and manage files
- [ ] Given the workflow is in "Data Preparation" phase, when I navigate to Other Imports, then I can upload, cancel, and manage files

### Access Control - After First Approval
- [ ] Given the workflow has moved to "First Approval" phase, when I navigate to Portfolio Imports, then I see a message "File uploads are locked during approval. Files will become editable if the batch is rejected."
- [ ] Given the workflow is in "First Approval" or later, when I view the file upload modal, then all upload and cancel buttons are disabled
- [ ] Given the workflow is in "First Approval" or later, when I view the page, then the "SFTP Import" button is disabled

### Access Control - After Rejection
- [ ] Given a batch is rejected at any approval level, when the workflow returns to "Data Preparation", then file upload screens are unlocked again
- [ ] Given the workflow returns to "Data Preparation" after rejection, when I navigate to Portfolio Imports, then I see a message "Batch rejected - file uploads are now available"

### Read-Only Access
- [ ] Given file uploads are locked, when I click a status icon, then I can still view file details and errors (read-only mode)
- [ ] Given file uploads are locked, when I view the file modal, then I can export files but NOT upload or cancel

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/report-batches` | Get current batch workflow status to determine access level |
| GET | `/approve-logs/{ReportBatchId}` | Get approval logs to check if batch is in approval phase |

## Implementation Notes
- Check the current report batch's WorkflowStatusName to determine access level
- Disable buttons and show informational messages when access is restricted
- Use Shadcn `<Alert>` with info variant to display lock messages
- Implement a reusable access control hook (e.g., `useFileAccessControl()`) that checks workflow state
- Grey out disabled sections visually to indicate locked state
