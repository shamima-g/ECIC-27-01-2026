# Screen: Process Logs - Monthly Process

## Purpose

Records end-to-end workflow execution events for monthly reporting cycles. Provides audit trail of workflow state transitions and activities.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > Process Logs                                                      |
|                                                                              |
|  Process Logs                                                                |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [File Process Logs] [Monthly Process Logs] [Calculation Logs]               |
|                                                                              |
|  [Refresh]  [Export Logs]                                                    |
|                                                                              |
|  Filter by: [Report Batch ▼] [Event Type ▼] [Apply] [Clear]                |
|                                                                              |
|  Monthly Process Logs                                                        |
|  +------------------------------------------------------------------------+  |
|  | Report  | Report    | Event Name              | Executed At    | Last |  |
|  | Batch   | Date      |                         |                | Act. |  |
|  | Id      |           |                         |                |      |  |
|  |---------|-----------|-------------------------|----------------|------|  |
|  | 456     | 2026-01   | Create Report Batch     | 2026-01-27     | N/A  |  |
|  |         | -31       |                         | 08:00:00       |      |  |
|  |---------|-----------|-------------------------|----------------|------|  |
|  | 456     | 2026-01   | Start Data Preparation  | 2026-01-27     | File |  |
|  |         | -31       |                         | 08:00:15       | Setup|  |
|  |---------|-----------|-------------------------|----------------|------|  |
|  | 456     | 2026-01   | File Upload Initiated   | 2026-01-27     | SFTP |  |
|  |         | -31       |                         | 08:30:00       | Imprt|  |
|  |---------|-----------|-------------------------|----------------|------|  |
|  | 456     | 2026-01   | File Validation         | 2026-01-27     | Valid|  |
|  |         | -31       | Complete                | 11:45:23       | All  |  |
|  |---------|-----------|-------------------------|----------------|------|  |
|  | 456     | 2026-01   | Run Calculations        | 2026-01-27     | Calc |  |
|  |         | -31       |                         | 12:00:00       | Start|  |
|  |---------|-----------|-------------------------|----------------|------|  |
|  | 456     | 2026-01   | Calculations Successful | 2026-01-27     | Calc |  |
|  |         | -31       |                         | 14:30:45       | Done |  |
|  |---------|-----------|-------------------------|----------------|------|  |
|  | 456     | 2026-01   | Publish Draft Reports   | 2026-01-27     | Draft|  |
|  |         | -31       |                         | 14:45:00       | Rpts |  |
|  |---------|-----------|-------------------------|----------------|------|  |
|  | 456     | 2026-01   | Submit First Level      | 2026-01-27     | L1   |  |
|  |         | -31       | Approval                | 16:00:00       | Wait |  |
|  |---------|-----------|-------------------------|----------------|------|  |
|  | 456     | 2026-01   | First Level Approved    | 2026-01-28     | L1   |  |
|  |         | -31       |                         | 09:30:00       | Done |  |
|  |---------|-----------|-------------------------|----------------|------|  |
|  | 456     | 2026-01   | Submit Second Level     | 2026-01-28     | L2   |  |
|  |         | -31       | Approval                | 09:30:15       | Wait |  |
|  +------------------------------------------------------------------------+  |
|  | ...     | ...       | ...                     | ...            | ...  |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 87 monthly process events                [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Filtered View - Single Batch Timeline:
+------------------------------------------------------------------------------+
|  Filter by: [Report Batch ▼: 2026-01-31 (456)]                              |
|                                                                              |
|  Batch 456 (2026-01-31) - Complete Workflow Timeline                         |
|  +------------------------------------------------------------------------+  |
|  |                                                                        |  |
|  |  2026-01-27 08:00    ● Create Report Batch                            |  |
|  |                      │                                                 |  |
|  |  2026-01-27 08:00    ├─ Start Data Preparation                        |  |
|  |                      │                                                 |  |
|  |  2026-01-27 08:30    ├─ File Upload Initiated                         |  |
|  |                      │                                                 |  |
|  |  2026-01-27 11:45    ├─ File Validation Complete                      |  |
|  |                      │                                                 |  |
|  |  2026-01-27 12:00    ├─ Run Calculations                              |  |
|  |                      │                                                 |  |
|  |  2026-01-27 14:30    ├─ Calculations Successful                       |  |
|  |                      │                                                 |  |
|  |  2026-01-27 14:45    ├─ Publish Draft Reports                         |  |
|  |                      │                                                 |  |
|  |  2026-01-27 16:00    ├─ Submit First Level Approval                   |  |
|  |                      │                                                 |  |
|  |  2026-01-28 09:30    ├─ First Level Approved                          |  |
|  |                      │                                                 |  |
|  |  2026-01-28 09:30    ├─ Submit Second Level Approval                  |  |
|  |                      │                                                 |  |
|  |  2026-01-28 14:00    ├─ Second Level Approved                         |  |
|  |                      │                                                 |  |
|  |  2026-01-28 14:00    ├─ Submit Third Level Approval                   |  |
|  |                      │                                                 |  |
|  |  2026-01-29 10:00    ├─ Third Level Approved                          |  |
|  |                      │                                                 |  |
|  |  2026-01-29 10:00    ├─ Publish Final Reports                         |  |
|  |                      │                                                 |  |
|  |  2026-01-29 10:15    ● Complete                                        |  |
|  |                                                                        |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Total Duration: 2 days, 2 hours, 15 minutes                                 |
|                                                                              |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Monthly Process Logs Tab | Tab | Active tab showing monthly workflow logs |
| Refresh | Button | Updates log display with latest data |
| Export Logs | Button | Exports logs to Excel |
| Filter Dropdowns | Dropdown | Filter by report batch or event type |
| Process Logs Grid | Table | Displays all workflow events |
| Timeline View | Visual | Shows workflow progression as timeline |
| Event Name | Display | Description of workflow event |
| Executed At | Display | Timestamp of event execution |
| Last Activity | Display | Most recent activity within the event |
| Pagination | Navigation | Page through logs list |

## User Actions

- **View Workflow Logs**: See complete workflow execution history
- **Filter by Batch**: View timeline for specific reporting period
- **Filter by Event**: See specific types of workflow events
- **View Timeline**: See visual representation of batch progression
- **Export Logs**: Download logs for analysis or audit
- **Refresh**: Update logs display

## Navigation

- **From:** Start Page, File Process Logs Tab
- **To:** File Process Logs Tab, Calculation Logs Tab

## Access Restrictions

- **Visible to:** All users (read-only)
- **Data retention:** Logs retained per configured retention policy
