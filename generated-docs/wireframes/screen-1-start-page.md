# Screen: Start Page

## Purpose

High-level entry point to create new report batches and monitor active reporting cycles with at-a-glance system status.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|                                                                              |
|  Start Page                                                                  |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | Current Report Batch                                                   |  |
|  |                                                                        |  |
|  |  Report Date: 2026-01-31          Batch Type: Monthly                 |  |
|  |  Status: Data Preparation         Progress: ████████░░░░ 60%          |  |
|  |                                                                        |  |
|  |  Workflow State: Preparing Data                                       |  |
|  |  Last Updated: 2026-01-27 14:30 by OpsLead                            |  |
|  |                                                                        |  |
|  |  [View Data Confirmation]  [View Process Logs]                        |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  +----------------------------------+  +----------------------------------+  |
|  | Quick Actions                    |  | Recent Batches                   |  |
|  |                                  |  |                                  |  |
|  |  [Create New Weekly Batch]       |  |  2026-01-24  Monthly  Complete  |  |
|  |                                  |  |  2026-01-17  Weekly   Complete  |  |
|  |  [Create New Monthly Batch]      |  |  2025-12-31  Monthly  Complete  |  |
|  |                                  |  |  2025-12-24  Weekly   Complete  |  |
|  |  [View Batch History]            |  |  2025-12-17  Weekly   Complete  |  |
|  |                                  |  |                                  |  |
|  +----------------------------------+  |  [View All Batches]              |  |
|                                       +----------------------------------+  |
|  +------------------------------------------------------------------------+  |
|  | Quick Navigation                                                       |  |
|  |                                                                        |  |
|  |  [File Uploads]  [Data Confirmation]  [Instruments]  [Index Prices]   |  |
|  |  [Durations]  [Betas]  [Credit Ratings]  [Comments]  [Approvals]      |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Create New Weekly Batch | Button | Initiates a new weekly report batch |
| Create New Monthly Batch | Button | Initiates a new monthly report batch |
| View Data Confirmation | Button | Navigates to data confirmation screen |
| View Process Logs | Button | Navigates to process logs screen |
| View Batch History | Button | Shows historical batch list |
| Quick Navigation Links | Button Group | Direct links to key maintenance screens |
| Current Batch Status | Display Panel | Shows active batch workflow state |
| Recent Batches List | List | Shows last 5 completed batches |

## User Actions

- **Create New Batch**: Click button to start new weekly or monthly reporting cycle
- **View Current Status**: See at-a-glance workflow state and progress
- **Navigate to Screens**: Use quick navigation to access maintenance areas
- **View History**: Access completed batches (read-only)

## Navigation

- **From:** User login/dashboard
- **To:** File Uploads, Data Confirmation, Maintenance Screens, Approvals, Batch History
