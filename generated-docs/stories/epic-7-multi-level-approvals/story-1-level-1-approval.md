# Story: Level 1 Approval Screen

**Epic:** Multi-Level Approvals
**Story:** 1 of 4
**Wireframe:** `../../wireframes/screen-14-level-1-approval.md`

## User Story
**As an** L1 Approver, **I want** to review data completeness and approve or reject the batch **So that** I can ensure data quality before advancing to L2

## Acceptance Criteria
### Dashboard Display
- [ ] Given I navigate to L1 Approval, when the page loads, then I see the current batch status and data check summary
- [ ] Given the dashboard is displayed, when I view it, then I see links to view Data Confirmation, File Completeness, and Report Comments
- [ ] Given all checks are complete, when I view the dashboard, then I see a green "Ready for Approval" badge

### Approve Action
- [ ] Given all checks pass, when I click "Approve", then a confirmation dialog appears
- [ ] Given I confirm approval, when the action completes, then the workflow advances to "Level 2" and I see a success message
- [ ] Given the workflow advances, when I view the Start Page, then the batch status shows "Level 2 Approval"

### Reject Action
- [ ] Given I click "Reject", when the dialog opens, then I can optionally enter a rejection reason
- [ ] Given I confirm rejection, when the action completes, then the workflow returns to "Data Preparation" and file uploads are unlocked
- [ ] Given the batch is rejected, when I view the approval logs, then I see my rejection recorded with timestamp

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/approve-logs/{ReportBatchId}` | Submit L1 approval/rejection |
| GET | `/approve-logs/{ReportBatchId}/Level 1` | Get L1 approval log |
| GET | `/check-main-data-completeness` | View data check summary |
| GET | `/check-other-data-completeness` | View other checks summary |
