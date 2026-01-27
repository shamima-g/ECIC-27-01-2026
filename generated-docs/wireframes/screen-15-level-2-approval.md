# Screen: Level 2 Approval

## Purpose

Portfolio confirmation and risk checks with approve/reject actions. Second checkpoint in the three-level approval workflow focusing on portfolio-level validation.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > Approvals > Level 2                                               |
|                                                                              |
|  Level 2 Approval                                                            |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  Report Batch: 2026-01-31 (Monthly)              Status: Awaiting L2 Review |
|                                                                              |
|  Reviewer Focus: Portfolio-level confirmation and risk checks                |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | Current Batch Status                                                   |  |
|  | ─────────────────────────────────────────────────────────────────────  |  |
|  |                                                                        |  |
|  | Workflow State: Second Approval                                        |  |
|  | Submitted for L2: 2026-01-28 09:30 by L1Approver                       |  |
|  | Progress: Data Prep ✓ → L1 Review ✓ → L2 Review (Current) → L3 → Final|  |
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
|  | Level 1 Approval: Approved                                             |  |
|  |   By: L1Approver                                                       |  |
|  |   Date: 2026-01-28 09:30                                               |  |
|  |                                                                        |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Approval Decision                                                           |
|  ┌──────────────────────────────────────────────────────────────────────┐  |
|  │                                                                        │  |
|  │  All checks passed. Portfolio data validated. Ready for Level 3.      │  |
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
| Previous History Panel | Display | Shows prior approval actions (L1 approved) |
| Rejection Reason | Text Area | Input field for rejection reason (optional for L2) |
| Reject | Button | Returns workflow to Data Preparation phase |
| Approve | Button | Advances workflow to Level 3 approval |

## User Actions

- **Review Data Checks**: View comprehensive data completeness summary
- **View Detailed Checks**: Navigate to Data Confirmation for details
- **Review Comments**: See all report comments
- **Review Previous Approvals**: See L1 approval details
- **Approve**: Advance workflow to Level 3 approval
- **Reject**: Return to Data Preparation with optional reason

## Behaviour

- **On Approve**: Workflow advances to Level 3 (final) approval stage
- **On Reject**: Workflow returns to Data Preparation phase; calculations are cleared; file upload and maintenance screens become accessible again
- **Previous History**: Shows L1 approval timestamp and approver
- **Rejection Reason**: Optional for L2 (but recommended); captured in audit log

## Navigation

- **From:** Start Page, Workflow Notifications, Level 1 Approval (after L1 approve)
- **To:** Data Confirmation (detailed checks), Report Comments, Level 3 Approval (after approve), Data Preparation (after reject)

## Access Restrictions

- **Visible to:** Users with L2 Approver role
- **Available when:** Workflow state is "Second Approval"
