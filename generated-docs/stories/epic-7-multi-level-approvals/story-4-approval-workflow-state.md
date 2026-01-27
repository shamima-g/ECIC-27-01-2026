# Story: Approval Workflow State Management

**Epic:** Multi-Level Approvals
**Story:** 4 of 4

## User Story
**As a** System, **I want** to enforce workflow state transitions and access control **So that** data integrity is maintained during approvals

## Acceptance Criteria
### State Transitions
- [ ] Given a batch is in "Data Preparation", when L1 approval is submitted, then the state advances to "Level 1 Approval"
- [ ] Given a batch is in "Level 1 Approval", when approved, then the state advances to "Level 2 Approval"
- [ ] Given a batch is in "Level 2 Approval", when approved, then the state advances to "Level 3 Approval"
- [ ] Given a batch is in "Level 3 Approval", when approved, then the state advances to "Complete"
- [ ] Given a batch is rejected at any level, when the rejection is submitted, then the state returns to "Data Preparation"

### Access Control
- [ ] Given the batch is in "Level 1 Approval", when I try to access file uploads, then I see a locked message
- [ ] Given the batch is in any approval level, when I try to access maintenance screens, then they are read-only
- [ ] Given the batch returns to "Data Preparation" after rejection, when I access file uploads, then they are unlocked

### Approval History
- [ ] Given approvals/rejections are submitted, when I view the approval log, then I see Type, Status (Approved/Rejected), User, Time, and RejectReason (if applicable)

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/report-batches` | Get current batch workflow status |
| GET | `/approve-logs/{ReportBatchId}` | Get approval history |
