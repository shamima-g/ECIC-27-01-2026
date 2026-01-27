# Screen: Level 3 Approval

## Purpose

Final sign-off with mandatory rejection reason requirement. Third and final checkpoint in the approval workflow requiring complete review before publishing final reports.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > Approvals > Level 3                                               |
|                                                                              |
|  Level 3 Approval (Final Sign-off)                                           |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  Report Batch: 2026-01-31 (Monthly)              Status: Awaiting L3 Review |
|                                                                              |
|  Reviewer Focus: Complete review and final sign-off                          |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | Current Batch Status                                                   |  |
|  | ─────────────────────────────────────────────────────────────────────  |  |
|  |                                                                        |  |
|  | Workflow State: Third Approval (Final)                                 |  |
|  | Submitted for L3: 2026-01-28 14:00 by L2Approver                       |  |
|  | Progress: Data Prep ✓ → L1 ✓ → L2 ✓ → L3 Review (Current) → Publish   |  |
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
|  | Level 2 Approval: Approved                                             |  |
|  |   By: L2Approver                                                       |  |
|  |   Date: 2026-01-28 14:00                                               |  |
|  |                                                                        |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Final Approval Decision                                                     |
|  ┌──────────────────────────────────────────────────────────────────────┐  |
|  │                                                                        │  |
|  │  Final review complete. Ready to publish final reports.                │  |
|  │                                                                        │  |
|  │  ⚠️  Rejection Reason (REQUIRED if rejecting):                         │  |
|  │  ┌──────────────────────────────────────────────────────────────┐    │  |
|  │  │                                                                │    │  |
|  │  │                                                                │    │  |
|  │  │                                                                │    │  |
|  │  └──────────────────────────────────────────────────────────────┘    │  |
|  │                                                                        │  |
|  │  Note: Rejecting at L3 will return the workflow to Data Preparation.  │  |
|  │        All calculations will be cleared and data must be re-validated. │  |
|  │                                                                        │  |
|  │                                [Reject]            [Approve & Publish] │  |
|  └──────────────────────────────────────────────────────────────────────┘  |
|                                                                              |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Batch Status Panel | Display | Shows current batch and workflow state |
| Progress Indicator | Visual | Shows workflow progression through all approval stages |
| Data Completeness Checks | Display Panel | Summary of all data completeness checks with status |
| Report Comments Panel | Display Panel | Shows recent comments and count |
| View Detailed Checks | Button | Opens Data Confirmation screen |
| View All Comments | Button | Opens Report Comments screen |
| Previous History Panel | Display | Shows L1 and L2 approval details |
| Rejection Reason | Text Area | **REQUIRED** input field for rejection reason |
| Reject | Button | Returns workflow to Data Preparation (reason required) |
| Approve & Publish | Button | Advances workflow to publish final reports |
| Warning Icon | Visual | Highlights mandatory rejection reason requirement |

## User Actions

- **Review Data Checks**: View comprehensive data completeness summary
- **View Detailed Checks**: Navigate to Data Confirmation for details
- **Review Comments**: See all report comments
- **Review Previous Approvals**: See L1 and L2 approval details
- **Approve & Publish**: Advance workflow to publish final reports
- **Reject**: Return to Data Preparation with **mandatory** reason

## Behaviour

- **On Approve**: Workflow advances to Publish Final Reports and then Complete state
- **On Reject**:
  - **Rejection reason is REQUIRED** - system will not allow rejection without reason
  - Workflow returns to Data Preparation phase
  - Calculations are cleared
  - File upload and maintenance screens become accessible again
  - Rejection reason is captured in audit log for traceability
- **Previous History**: Shows L1 and L2 approval timestamps and approvers
- **Final State**: This is the last manual approval step before reports are published

## Navigation

- **From:** Start Page, Workflow Notifications, Level 2 Approval (after L2 approve)
- **To:** Data Confirmation (detailed checks), Report Comments, Publish Final Reports (after approve), Data Preparation (after reject)

## Access Restrictions

- **Visible to:** Users with L3 Approver role (senior management)
- **Available when:** Workflow state is "Third Approval"
