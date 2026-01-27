# Screen: Portfolio Imports Dashboard

## Purpose

Matrix view of portfolio files organized by portfolio (rows) and file type (columns) with clickable status icons for quick identification and management.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > [File Uploads] > Portfolio Imports                                |
|                                                                              |
|  Portfolio Imports Dashboard                                                 |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [SFTP Import]  [Re-import All]  [Export]                Report Date: Jan-31|
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | Portfolio  | Holdings | Trans.  | Inst.   | Income | Cash | Perf. | Mgmt |
|  |            |          |         | Static  |        |      |       | Fees |
|  |------------|----------|---------|---------|--------|------|-------|------|
|  | Sanlam     |   [✓]    |  [✓]    |  [✓]    |  [✓]   | [✓]  |  [✓]  | [✓]  |
|  | Portfolio A|   [✓]    |  [⏳]   |  [✓]    |  [✓]   | [✓]  |  [✓]  | [✓]  |
|  | Portfolio B|   [✓]    |  [✓]    |  [✓]    |  [✓]   | [✓]  |  [✓]  | [✓]  |
|  | Portfolio C|   [✗]    |  [✓]    |  [✓]    |  [○]   | [✓]  |  [✓]  | [✓]  |
|  | Portfolio D|   [✓]    |  [✓]    |  [✓]    |  [✓]   | [✓]  |  [✓]  | [✓]  |
|  | Portfolio E|   [✓]    |  [✓]    |  [✓]    |  [✓]   | [✓]  |  [⏳] | [✓]  |
|  | Portfolio F|   [✓]    |  [✓]    |  [○]    |  [✓]   | [✓]  |  [✓]  | [✓]  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Legend:  [✓] Complete   [⏳] Processing   [✗] Failed   [○] Missing         |
|                                                                              |
|  Status Summary: 45/49 files complete | 2 processing | 1 failed | 1 missing |
|                                                                              |
+------------------------------------------------------------------------------+

Note: Each status icon is clickable and opens the File Upload Modal (Screen 4)
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| SFTP Import | Button | Triggers automatic import from SFTP folder |
| Re-import All | Button | Re-imports all files for all portfolios |
| Export | Button | Exports uploaded file data |
| Status Icons | Clickable Icons | Shows file status; click opens upload modal |
| Portfolio Row | Table Row | One row per portfolio |
| File Type Column | Table Column | One column per file type |
| Status Summary | Display | Shows aggregate file status counts |
| Report Date | Display | Current reporting period date |

## User Actions

- **View Status**: See at-a-glance status of all portfolio files
- **Click Status Icon**: Opens File Upload Modal for that specific file
- **SFTP Import**: Trigger automatic import from configured location
- **Re-import**: Re-import all files for a portfolio
- **Export**: Export file data for external review

## Navigation

- **From:** Start Page, Main Navigation
- **To:** File Upload Modal (click any status icon), Other Imports Dashboard, Data Confirmation
