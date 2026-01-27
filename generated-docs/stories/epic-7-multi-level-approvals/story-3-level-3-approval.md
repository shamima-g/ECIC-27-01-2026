# Story: Level 3 Approval Screen

**Epic:** Multi-Level Approvals
**Story:** 3 of 4
**Wireframe:** `../../wireframes/screen-16-level-3-approval.md`

## User Story
**As an** L3 Approver, **I want** to perform final review and approve or reject with mandatory reason **So that** I provide final sign-off for report publication

## Acceptance Criteria
### Dashboard Display
- [ ] Given I navigate to L3 Approval, when the page loads, then I see the complete batch summary, L1/L2 approval details, and all report comments

### Approve Action
- [ ] Given I click "Approve", when I confirm, then the workflow advances to "Complete" and reports are published
- [ ] Given the workflow completes, when I view the Start Page, then the batch status shows "Complete" in green

### Reject Action - Mandatory Reason
- [ ] Given I click "Reject", when the dialog opens, then the rejection reason field is REQUIRED
- [ ] Given the reason field is empty, when I try to submit, then I see an error "Rejection reason is required for Level 3"
- [ ] Given I enter a reason and confirm, when the action completes, then the workflow returns to "Data Preparation" with the reason logged

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/approve-logs/{ReportBatchId}` | Submit L3 approval/rejection (RejectReason required) |
| GET | `/approve-logs/{ReportBatchId}` | Get all approval logs |
