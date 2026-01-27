# Story: Level 2 Approval Screen

**Epic:** Multi-Level Approvals
**Story:** 2 of 4
**Wireframe:** `../../wireframes/screen-15-level-2-approval.md`

## User Story
**As an** L2 Approver, **I want** to review portfolio-level data and approve or reject the batch **So that** I can confirm portfolio accuracy before final approval

## Acceptance Criteria
### Dashboard Display
- [ ] Given I navigate to L2 Approval, when the page loads, then I see the current batch status, L1 approval details, and portfolio summaries
- [ ] Given the dashboard is displayed, when I view it, then I see report comments and risk data summaries

### Approve Action
- [ ] Given I click "Approve", when I confirm, then the workflow advances to "Level 3"

### Reject Action
- [ ] Given I click "Reject", when I confirm with optional reason, then the workflow returns to "Data Preparation"

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/approve-logs/{ReportBatchId}` | Submit L2 approval/rejection |
| GET | `/approve-logs/{ReportBatchId}` | Get all approval logs |
