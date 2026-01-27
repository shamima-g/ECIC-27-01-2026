# Screen: Process Logs - File Process

## Purpose

Tracks each file's journey through the system from upload to validation completion. Provides evidence for operations teams and supports debugging of file processing issues.

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
|  Filter by: [Portfolio ▼] [File Type ▼] [Status ▼] [Apply] [Clear]        |
|                                                                              |
|  File Process Logs                                                           |
|  +------------------------------------------------------------------------+  |
|  | File  | Portfolio | File     | Upload    | Validation | Process  | ...|
|  | Log   |           | Type     | Time      | Status     | Status   |    |
|  | Id    |           |          |           |            |          |    |
|  |-------|-----------|----------|-----------|------------|----------|    |
|  | 1001  | Sanlam    | Holdings | 2026-01   | Passed     | Complete | [↓]|
|  |       |           |          | -27 10:45 |            |          |    |
|  |-------|-----------|----------|-----------|------------|----------|    |
|  | 1002  | Portfolio | Trans.   | 2026-01   | Passed     | Complete | [↓]|
|  |       | A         |          | -27 10:50 |            |          |    |
|  |-------|-----------|----------|-----------|------------|----------|    |
|  | 1003  | Portfolio | Holdings | 2026-01   | Failed     | Failed   | [↓]|
|  |       | C         |          | -27 09:15 | (12 errors)|          |    |
|  |-------|-----------|----------|-----------|------------|----------|    |
|  | 1004  | Index     | Monthly  | 2026-01   | Passed     | Complete | [↓]|
|  |       | Files     | Indexes  | -27 08:30 |            |          |    |
|  |-------|-----------|----------|-----------|------------|----------|    |
|  | 1005  | Bloomberg | Credit   | 2026-01   | Passed     | Complete | [↓]|
|  |       |           | Ratings  | -27 08:45 |            |          |    |
|  |-------|-----------|----------|-----------|------------|----------|    |
|  | 1006  | Portfolio | Perf.    | 2026-01   | Processing | In       | [↓]|
|  |       | E         |          | -27 14:20 |            | Progress |    |
|  +------------------------------------------------------------------------+  |
|  | ...   | ...       | ...      | ...       | ...        | ...      | ...|
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 234 file process logs                    [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row View (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | File Log Id: 1003  | Portfolio: Portfolio C  | File: Holdings        |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Upload Details:                                                        |  |
|  | ───────────────────────────────────────────────────────────────────   |  |
|  | Filename: PortfolioC_Holdings_2026-01-31.xlsx                         |  |
|  | Upload Timestamp: 2026-01-27 09:15:00                                 |  |
|  | Uploaded By: Analyst1                                                  |  |
|  | File Size: 3.2 MB                                                      |  |
|  | Rows Attempted: 1,567                                                  |  |
|  |                                                                        |  |
|  | Processing Timeline:                                                   |  |
|  | ───────────────────────────────────────────────────────────────────   |  |
|  | 09:15:00 - File uploaded                                               |  |
|  | 09:15:12 - Validation started                                          |  |
|  | 09:15:45 - Validation failed (12 errors detected)                      |  |
|  | 09:15:45 - Processing stopped                                          |  |
|  |                                                                        |  |
|  | Validation Status: Failed                                              |  |
|  | Error Count: 12 validation errors                                      |  |
|  | Process Status: Failed                                                 |  |
|  |                                                                        |  |
|  | Error Summary:                                                         |  |
|  | - 5 missing required values                                            |  |
|  | - 4 invalid date formats                                               |  |
|  | - 3 unknown securities                                                 |  |
|  |                                                                        |  |
|  | [View Detailed Errors]  [Retry Validation]  [View File]     [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| File Process Logs Tab | Tab | Active tab showing file process logs |
| Monthly Process Logs Tab | Tab | Tab for monthly workflow logs |
| Calculation Logs Tab | Tab | Tab for calculation execution logs |
| Refresh | Button | Updates log display with latest data |
| Export Logs | Button | Exports logs to Excel |
| Filter Dropdowns | Dropdown | Filter by portfolio, file type, or status |
| File Logs Grid | Table | Displays all file process logs |
| Expand Row | Button | Shows detailed processing timeline and errors |
| View Detailed Errors | Button | Opens error details modal |
| Retry Validation | Button | Triggers re-validation of the file |
| View File | Button | Downloads/views the uploaded file |
| Pagination | Navigation | Page through logs list |

## User Actions

- **View File Logs**: See all file processing history
- **Filter Logs**: Filter by portfolio, file type, or status
- **Expand Details**: View detailed processing timeline
- **View Errors**: See validation error details
- **Retry Validation**: Re-run validation after corrections
- **Export Logs**: Download logs for analysis
- **Refresh**: Update logs display

## Navigation

- **From:** Start Page, File Uploads screens (after processing)
- **To:** Monthly Process Logs Tab, Calculation Logs Tab, Error Details Modal, File Upload Modal

## Access Restrictions

- **Visible to:** All users (read-only)
- **Data retention:** Logs retained per configured retention policy
