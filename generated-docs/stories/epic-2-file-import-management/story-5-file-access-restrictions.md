# Story: File Access Restrictions

**Epic:** File Import Management
**Story:** 5 of 5
**Wireframe:** `../../wireframes/screen-2-portfolio-imports.md`, `../../wireframes/screen-3-other-imports.md`

## User Story

**As a** System Administrator
**I want** file upload screens to be locked after data preparation is complete
**So that** data integrity is maintained during the approval process

## Acceptance Criteria

### Access Control - Data Preparation Phase
- [ ] Given the batch has `LastExecutedActivityName = "PrepareData"`, when I navigate to Portfolio Imports, then I can upload, cancel, and manage files
- [ ] Given the batch has `LastExecutedActivityName = "PrepareData"`, when I navigate to Other Imports, then I can upload, cancel, and manage files
- [ ] Given the batch has `LastExecutedActivityName = "PrepareData"`, when I navigate to Data Maintenance screens, then I can edit data
- [ ] Given the batch has `LastExecutedActivityName = "PrepareData"`, when I navigate to Data Confirmation screens, then I can confirm data

### Access Control - Approval Phases (Locked)
- [ ] Given the batch has `LastExecutedActivityName` IN ("ApproveFirstLevel", "ApproveSecondLevel", "ApproveThirdLevel", "PendingComplete"), when I navigate to Portfolio Imports, then I see a message "File uploads are locked during approval"
- [ ] Given the batch has `LastExecutedActivityName` IN ("ApproveFirstLevel", "ApproveSecondLevel", "ApproveThirdLevel", "PendingComplete"), when I navigate to Other Imports, then all upload and cancel buttons are disabled
- [ ] Given the batch has `LastExecutedActivityName` IN ("ApproveFirstLevel", "ApproveSecondLevel", "ApproveThirdLevel", "PendingComplete"), when I navigate to Data Maintenance screens, then editing is disabled
- [ ] Given the batch has `LastExecutedActivityName` IN ("ApproveFirstLevel", "ApproveSecondLevel", "ApproveThirdLevel", "PendingComplete"), when I navigate to Data Confirmation screens, then confirmation is disabled

### Access Control - After Rejection
- [ ] Given a batch is rejected at any approval level, when `LastExecutedActivityName` returns to "PrepareData", then file upload screens are unlocked again
- [ ] Given the workflow returns to "PrepareData" after rejection, when I navigate to Portfolio Imports, then I see a message "Batch rejected - file uploads are now available"

### Read-Only Access During Approval
- [ ] Given file uploads are locked, when I click a status icon, then I can still view file details and errors (read-only mode)
- [ ] Given file uploads are locked, when I view the file modal, then I can view and export files but NOT upload or cancel

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/monthly-report-batch` | Get current batch with `LastExecutedActivityName` to determine access level |

## Implementation Notes
- Check the current report batch's `LastExecutedActivityName` to determine access level:
  - `"PrepareData"` → Full access (upload, edit, confirm)
  - `"ApproveFirstLevel"`, `"ApproveSecondLevel"`, `"ApproveThirdLevel"`, `"PendingComplete"` → Read-only
- Disable buttons and show informational messages when access is restricted
- Use Shadcn `<Alert>` with info variant to display lock messages
- Implement a reusable access control hook (e.g., `useWorkflowAccessControl()`) that checks `LastExecutedActivityName`
- Grey out disabled sections visually to indicate locked state
