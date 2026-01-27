# Screen: Process Logs - Calculation Logs

## Purpose

Tracks calculation execution status with error links. Provides detailed information on calculation performance, success/failure status, and error details for debugging.

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
|  [Refresh]  [Export Logs]                                Report Date: Jan-31|
|                                                                              |
|  Filter by: [Calculation Type ▼] [Status ▼] [Apply] [Clear]                |
|                                                                              |
|  Calculation Logs                                                            |
|  +------------------------------------------------------------------------+  |
|  | Calc.  | Calculation         | Status    | Start       | End      |...|
|  | Log Id | Name                |           | Time        | Time     |   |
|  |--------|---------------------|-----------|-------------|----------|   |
|  | 5001   | Portfolio           | Success   | 2026-01-27  | 2026-01  |[↓]|
|  |        | Valuation           |           | 12:00:00    | -27      |   |
|  |        |                     |           |             | 12:15:34 |   |
|  |--------|---------------------|-----------|-------------|----------|   |
|  | 5002   | Performance         | Success   | 2026-01-27  | 2026-01  |[↓]|
|  |        | Attribution         |           | 12:15:40    | -27      |   |
|  |        |                     |           |             | 12:45:12 |   |
|  |--------|---------------------|-----------|-------------|----------|   |
|  | 5003   | Risk Metrics        | Success   | 2026-01-27  | 2026-01  |[↓]|
|  |        |                     |           | 12:45:20    | -27      |   |
|  |        |                     |           |             | 13:10:45 |   |
|  |--------|---------------------|-----------|-------------|----------|   |
|  | 5004   | Fixed Income        | Failed    | 2026-01-27  | 2026-01  |[↓]|
|  |        | Analytics           |           | 13:10:50    | -27      |   |
|  |        |                     |           |             | 13:11:23 |   |
|  |--------|---------------------|-----------|-------------|----------|   |
|  | 5005   | Cashflow            | Success   | 2026-01-27  | 2026-01  |[↓]|
|  |        | Reconciliation      |           | 13:20:00    | -27      |   |
|  |        |                     |           |             | 13:55:10 |   |
|  |--------|---------------------|-----------|-------------|----------|   |
|  | 5006   | Compliance          | Success   | 2026-01-27  | 2026-01  |[↓]|
|  |        | Checks              |           | 13:55:15    | -27      |   |
|  |        |                     |           |             | 14:20:30 |   |
|  +------------------------------------------------------------------------+  |
|  | ...    | ...                 | ...       | ...         | ...      |...|
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 45 calculation logs                      [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row View - Success (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Calculation Log Id: 5001  | Portfolio Valuation                      |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Execution Details:                                                     |  |
|  | ───────────────────────────────────────────────────────────────────   |  |
|  | Calculation Name: Portfolio Valuation                                  |  |
|  | Status: Success                                                        |  |
|  | Start Time: 2026-01-27 12:00:00                                        |  |
|  | End Time: 2026-01-27 12:15:34                                          |  |
|  | Duration: 15 minutes 34 seconds                                        |  |
|  |                                                                        |  |
|  | Execution Summary:                                                     |  |
|  | - Portfolios processed: 7                                              |  |
|  | - Total holdings valued: 1,245                                         |  |
|  | - Total value calculated: R 4.5 billion                                |  |
|  | - Errors encountered: 0                                                |  |
|  |                                                                        |  |
|  | [Retry Calculation]  [View Detailed Output]                 [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+

Expanded Row View - Failed (when [↓] clicked on failed calc):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Calculation Log Id: 5004  | Fixed Income Analytics                   |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Execution Details:                                                     |  |
|  | ───────────────────────────────────────────────────────────────────   |  |
|  | Calculation Name: Fixed Income Analytics                               |  |
|  | Status: Failed                                                         |  |
|  | Start Time: 2026-01-27 13:10:50                                        |  |
|  | End Time: 2026-01-27 13:11:23                                          |  |
|  | Duration: 33 seconds (terminated early)                                |  |
|  |                                                                        |  |
|  | Error Count: 5 errors detected                                         |  |
|  |                                                                        |  |
|  | [View Errors]  [Retry Calculation]                          [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+

Calculation Error Details Modal (when "View Errors" clicked):
+------------------------------------------------------------------------------+
|    ┌────────────────────────────────────────────────────────────────┐       |
|    │  Calculation Errors - Fixed Income Analytics         [X]      │       |
|    ├────────────────────────────────────────────────────────────────┤       |
|    │                                                                 │       |
|    │  Calculation: Fixed Income Analytics                           │       |
|    │  Status: Failed                                                │       |
|    │  Error Count: 5                                                │       |
|    │                                                                 │       |
|    │  ┌───────────────────────────────────────────────────────┐    │       |
|    │  │ Error   | Category      | Full Error Message          │    │       |
|    │  │ Prefix  |               |                             │    │       |
|    │  │---------|---------------|-----------------------------│    │       |
|    │  │ DUR-001 | Duration      | Missing duration for        │    │       |
|    │  │         | Missing       | instrument GVT015           │    │       |
|    │  │---------|---------------|-----------------------------│    │       |
|    │  │ DUR-002 | Duration      | Missing duration for        │    │       |
|    │  │         | Missing       | instrument CRP020           │    │       |
|    │  │---------|---------------|-----------------------------│    │       |
|    │  │ YTM-001 | YTM Missing   | Missing YTM for instrument  │    │       |
|    │  │         |               | GVT018                      │    │       |
|    │  │---------|---------------|-----------------------------│    │       |
|    │  │ CALC-ERR| Calculation   | Division by zero in         │    │       |
|    │  │         | Error         | modified duration calc      │    │       |
|    │  │---------|---------------|-----------------------------│    │       |
|    │  │ DATA-001| Data Missing  | Missing market price for    │    │       |
|    │  │         |               | instrument CRP025           │    │       |
|    │  └───────────────────────────────────────────────────────┘    │       |
|    │                                                                 │       |
|    │                               [Export Errors]    [Close]       │       |
|    └────────────────────────────────────────────────────────────────┘       |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Calculation Logs Tab | Tab | Active tab showing calculation execution logs |
| Refresh | Button | Updates log display with latest data |
| Export Logs | Button | Exports logs to Excel |
| Filter Dropdowns | Dropdown | Filter by calculation type or status |
| Calculation Logs Grid | Table | Displays all calculation execution logs |
| Expand Row | Button | Shows detailed execution information |
| View Errors | Button | Opens error details modal (for failed calculations) |
| Retry Calculation | Button | Re-runs the calculation |
| View Detailed Output | Button | Shows calculation output details |
| Error Details Modal | Modal | Displays all errors with prefixes and messages |
| Export Errors | Button | Exports error list to Excel |
| Pagination | Navigation | Page through logs list |

## User Actions

- **View Calculation Logs**: See all calculation execution history
- **Filter Logs**: Filter by calculation type or status
- **Expand Details**: View detailed execution information and duration
- **View Errors**: See detailed error messages (for failed calculations)
- **Retry Calculation**: Re-run failed or completed calculations
- **Export Logs**: Download logs for analysis
- **Export Errors**: Download error details for debugging
- **Refresh**: Update logs display

## Navigation

- **From:** Start Page, File Process Logs Tab, Monthly Process Logs Tab
- **To:** File Process Logs Tab, Monthly Process Logs Tab, Durations Maintenance (from error context), Data Confirmation

## Access Restrictions

- **Visible to:** All users (read-only)
- **Data retention:** Logs retained per configured retention policy
