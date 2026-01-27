# Screen: Level 1 Approval

## Purpose

Initial review of data completeness with approve/reject actions. First checkpoint in the three-level approval workflow focusing on data completeness and key checks.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > Approvals > Level 1                                               |
|                                                                              |
|  Level 1 Approval                                                            |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  Report Batch: 2026-01-31 (Monthly)              Status: Awaiting L1 Review |
|                                                                              |
|  Reviewer Focus: Data completeness and key checks                            |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | Current Batch Status                                                   |  |
|  | ─────────────────────────────────────────────────────────────────────  |  |
|  |                                                                        |  |
|  | Workflow State: First Approval                                         |  |
|  | Submitted for L1: 2026-01-27 16:00 by OpsLead                          |  |
|  | Progress: Data Preparation ✓ → L1 Review (Current) → L2 → L3 → Final  |  |
|  |                                                                        |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  +----------------------------------+  +----------------------------------+  |
|  | Data Completeness Checks         |  | Report Comments                  |  |
|  | ───────────────────────────────── |  | ───────────────────────────────  |  |
|  |                                  |  |                                  |  |
|  | Portfolio Manager Files:    ✓    |  | Total Comments: 5                |  |
|  | All portfolios complete          |  |                                  |  |
|  |                                  |  | Recent:                          |  |
|  | Custodian Files:            ✓    |  | - Portfolio A: Market volatil... |  |
|  | All files validated              |  | - Sanlam: New bond position...   |  |
|  |                                  |  | - Portfolio C: Compliance ok...  |  |
|  | Bloomberg Holdings:         ✓    |  |                                  |  |
|  | Complete for all portfolios      |  | [View All Comments]              |  |
|  |                                  |  |                                  |  |
|  | Index Prices:               ✓    |  |                                  |  |
|  | All required prices captured     |  |                                  |  |
|  |                                  |  |                                  |  |
|  | Instruments:                ✓    |  |                                  |  |
|  | All instruments complete         |  |                                  |  |
|  |                                  |  |                                  |  |
|  | Credit Ratings:             ✓    |  |                                  |  |
|  | All ratings current              |  |                                  |  |
|  |                                  |  |                                  |  |
|  | Durations:                  ✓    |  |                                  |  |
|  | All durations captured           |  |                                  |  |
|  |                                  |  |                                  |  |
|  | Betas:                      ✓    |  |                                  |  |
|  | All betas captured               |  |                                  |  |
|  |                                  |  |                                  |  |
|  | [View Detailed Checks]           |  |                                  |  |
|  +----------------------------------+  +----------------------------------+  |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | Previous Approval History                                              |  |
|  | ─────────────────────────────────────────────────────────────────────  |  |
|  |                                                                        |  |
|  | No previous approval actions for this batch                            |  |
|  |                                                                        |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Approval Decision                                                           |
|  ┌──────────────────────────────────────────────────────────────────────┐  |
|  │                                                                        │  |
|  │  All data checks passed. Ready to proceed to Level 2 approval.        │  |
|  │                                                                        │  |
|  │  Rejection Reason (required if rejecting):                            │  |
|  │  ┌──────────────────────────────────────────────────────────────┐    │  |
|  │  │                                                                │    │  |
|  │  └──────────────────────────────────────────────────────────────┘    │  |
|  │                                                                        │  |
|  │                                [Reject]            [Approve]           │  |
|  └──────────────────────────────────────────────────────────────────────┘  |
|                                                                              |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Batch Status Panel | Display | Shows current batch and workflow state |
| Progress Indicator | Visual | Shows workflow progression through approval stages |
| Data Completeness Checks | Display Panel | Summary of all data completeness checks with status |
| Report Comments Panel | Display Panel | Shows recent comments and count |
| View Detailed Checks | Button | Opens Data Confirmation screen |
| View All Comments | Button | Opens Report Comments screen |
| Previous History Panel | Display | Shows prior approval/rejection actions |
| Rejection Reason | Text Area | Input field for rejection reason (optional for L1) |
| Reject | Button | Returns workflow to Data Preparation phase |
| Approve | Button | Advances workflow to Level 2 approval |

## User Actions

- **Review Data Checks**: View comprehensive data completeness summary
- **View Detailed Checks**: Navigate to Data Confirmation for details
- **Review Comments**: See all report comments
- **Approve**: Advance workflow to Level 2 approval
- **Reject**: Return to Data Preparation with optional reason

## Behaviour

- **On Approve**: Workflow advances to Level 2 approval stage
- **On Reject**: Workflow returns to Data Preparation phase; calculations are cleared; file upload and maintenance screens become accessible again
- **Data Checks**: Must all show green (✓) status before approval
- **Rejection Reason**: Optional for L1 (but recommended); captured in audit log

## Navigation

- **From:** Start Page, Workflow Notifications
- **To:** Data Confirmation (detailed checks), Report Comments, Level 2 Approval (after approve), Data Preparation (after reject)

## Access Restrictions

- **Visible to:** Users with L1 Approver role
- **Available when:** Workflow state is "First Approval"
