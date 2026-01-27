# Screen: Other Imports Dashboard

## Purpose

List view of non-portfolio-specific files (index data, Bloomberg feeds, custodian files) with clickable status icons for simplified management.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > [File Uploads] > Other Imports                                    |
|                                                                              |
|  Other Imports Dashboard                                                     |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [SFTP Import]  [Export]                                 Report Date: Jan-31|
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | File Type / Source                              | Status               |  |
|  |-----------------------------------------------------|------------------|  |
|  |                                                     |                  |  |
|  | Monthly Index Files                                 |      [✓]         |  |
|  | Index price data files for the reporting period     |                  |  |
|  |                                                     |                  |  |
|  |-----------------------------------------------------|------------------|  |
|  |                                                     |                  |  |
|  | Bloomberg Credit Ratings                            |      [✓]         |  |
|  | Credit rating data from Bloomberg                   |                  |  |
|  |                                                     |                  |  |
|  |-----------------------------------------------------|------------------|  |
|  |                                                     |                  |  |
|  | Bloomberg Holdings                                  |      [⏳]        |  |
|  | Holdings data from Bloomberg                        |                  |  |
|  |                                                     |                  |  |
|  |-----------------------------------------------------|------------------|  |
|  |                                                     |                  |  |
|  | Custodian Files                                     |      [✓]         |  |
|  | Holdings, transactions, cash, and fees              |                  |  |
|  |                                                     |                  |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Legend:  [✓] Complete   [⏳] Processing   [✗] Failed   [○] Missing         |
|                                                                              |
|  Status Summary: 3/4 files complete | 1 processing | 0 failed | 0 missing   |
|                                                                              |
+------------------------------------------------------------------------------+

Note: Each status icon is clickable and opens the File Upload Modal (Screen 4)
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| SFTP Import | Button | Triggers automatic import from SFTP folder |
| Export | Button | Exports uploaded file data |
| File Type Row | List Item | One row per file type/source |
| Status Icon | Clickable Icon | Shows file status; click opens upload modal |
| File Description | Text | Explains what data the file contains |
| Status Summary | Display | Shows aggregate file status counts |
| Report Date | Display | Current reporting period date |

## User Actions

- **View Status**: See at-a-glance status of all other files
- **Click Status Icon**: Opens File Upload Modal for that specific file
- **SFTP Import**: Trigger automatic import from configured location
- **Export**: Export file data for external review

## Navigation

- **From:** Start Page, Portfolio Imports Dashboard
- **To:** File Upload Modal (click any status icon), Portfolio Imports Dashboard, Data Confirmation
