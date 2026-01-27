# Screen: File Upload Modal

## Purpose

Popup modal for viewing file status, uploading/replacing files, viewing errors, and managing file actions. Shared by both Portfolio Imports and Other Imports dashboards.

## Wireframe

```
+------------------------------------------------------------------------------+
|                                                                              |
|    ┌────────────────────────────────────────────────────────────────┐       |
|    │  File Upload - Holdings (Sanlam Portfolio)              [X]    │       |
|    ├────────────────────────────────────────────────────────────────┤       |
|    │                                                                 │       |
|    │  File Status: Complete ✓                                       │       |
|    │  ───────────────────────────────────────────────────────────   │       |
|    │                                                                 │       |
|    │  File Details                                                  │       |
|    │  ─────────────────────────────────────────────────────────     │       |
|    │  Filename:         Sanlam_Holdings_2026-01-31.xlsx             │       |
|    │  Upload Date:      2026-01-27 10:45:00                         │       |
|    │  Uploaded By:      OpsLead                                     │       |
|    │  File Size:        2.4 MB                                      │       |
|    │  Rows Processed:   1,245                                       │       |
|    │  Validation:       Passed ✓                                    │       |
|    │                                                                 │       |
|    │  ─────────────────────────────────────────────────────────     │       |
|    │                                                                 │       |
|    │  Actions                                                        │       |
|    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │       |
|    │  │ Upload/Replace│  │ Cancel File  │  │ Export File  │         │       |
|    │  └──────────────┘  └──────────────┘  └──────────────┘         │       |
|    │                                                                 │       |
|    │  ┌──────────────┐  ┌──────────────┐                           │       |
|    │  │ Retry Valid. │  │ View Errors  │                           │       |
|    │  └──────────────┘  └──────────────┘                           │       |
|    │                                                                 │       |
|    │  ─────────────────────────────────────────────────────────     │       |
|    │                                                                 │       |
|    │  File Upload Area (when Upload/Replace clicked)                │       |
|    │  ┌───────────────────────────────────────────────────────┐    │       |
|    │  │                                                         │    │       |
|    │  │     Drag & Drop file here or [Browse...]               │    │       |
|    │  │                                                         │    │       |
|    │  │     Accepted formats: .xlsx, .csv, .txt                │    │       |
|    │  │     Max file size: 50 MB                               │    │       |
|    │  │                                                         │    │       |
|    │  └───────────────────────────────────────────────────────┘    │       |
|    │                                                                 │       |
|    │                               [Close]      [Upload]            │       |
|    └────────────────────────────────────────────────────────────────┘       |
|                                                                              |
+------------------------------------------------------------------------------+
```

## Wireframe - Error View

```
+------------------------------------------------------------------------------+
|                                                                              |
|    ┌────────────────────────────────────────────────────────────────┐       |
|    │  File Upload - Transactions (Portfolio C)               [X]    │       |
|    ├────────────────────────────────────────────────────────────────┤       |
|    │                                                                 │       |
|    │  File Status: Failed ✗                                         │       |
|    │  ───────────────────────────────────────────────────────────   │       |
|    │                                                                 │       |
|    │  File Details                                                  │       |
|    │  ─────────────────────────────────────────────────────────     │       |
|    │  Filename:         PortfolioC_Trans_2026-01-31.xlsx            │       |
|    │  Upload Date:      2026-01-27 09:15:00                         │       |
|    │  Uploaded By:      Analyst1                                    │       |
|    │  Validation:       Failed ✗                                    │       |
|    │  Error Count:      12 validation errors                        │       |
|    │                                                                 │       |
|    │  ─────────────────────────────────────────────────────────     │       |
|    │                                                                 │       |
|    │  Validation Errors                                              │       |
|    │  ┌───────────────────────────────────────────────────────┐    │       |
|    │  │ Row | Error Code  | Description                       │    │       |
|    │  │─────|─────────────|───────────────────────────────────│    │       |
|    │  │ 15  | MISSING_VAL | Required field 'Amount' is empty  │    │       |
|    │  │ 23  | INVALID_DT  | Invalid date format in 'TranDate' │    │       |
|    │  │ 45  | UNKNOWN_SEC | Security 'ABC123' not in master   │    │       |
|    │  │ 67  | MISSING_VAL | Required field 'Amount' is empty  │    │       |
|    │  │ 89  | INVALID_CCY | Currency code 'XXX' not valid     │    │       |
|    │  │ ... | ...         | ...                               │    │       |
|    │  └───────────────────────────────────────────────────────┘    │       |
|    │                                      [Export Errors to Excel]  │       |
|    │                                                                 │       |
|    │  ─────────────────────────────────────────────────────────     │       |
|    │                                                                 │       |
|    │  Actions                                                        │       |
|    │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │       |
|    │  │ Upload/Replace│  │ Cancel File  │  │ Retry Valid. │         │       |
|    │  └──────────────┘  └──────────────┘  └──────────────┘         │       |
|    │                                                                 │       |
|    │                               [Close]                          │       |
|    └────────────────────────────────────────────────────────────────┘       |
|                                                                              |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| File Status | Display | Shows current status (Complete, Processing, Failed, Missing) |
| File Details | Display Panel | Shows filename, upload date, user, size, rows processed |
| Upload/Replace | Button | Opens file upload area to upload or replace file |
| Cancel File | Button | Cancels the file upload |
| Export File | Button | Exports the uploaded file data |
| Retry Validation | Button | Re-runs validation on the file |
| View Errors | Button | Shows validation error details (switches view) |
| Drag & Drop Area | File Input | Area to drag/drop or browse for files |
| Error Grid | Table | Lists all validation errors with details |
| Export Errors | Button | Exports error list to Excel |
| Browse | Button | Opens file browser dialog |
| Upload | Button | Confirms and uploads selected file |
| Close | Button | Closes the modal |

## User Actions

- **View Status**: See detailed file upload and validation status
- **Upload/Replace File**: Select and upload a new or replacement file
- **Cancel File**: Remove file from system
- **Retry Validation**: Re-run validation after corrections
- **View Errors**: See detailed list of validation errors
- **Export Errors**: Download error list for offline correction
- **Export File**: Download the uploaded file data

## Navigation

- **From:** Portfolio Imports Dashboard (click status icon), Other Imports Dashboard (click status icon)
- **To:** Returns to calling dashboard on close
