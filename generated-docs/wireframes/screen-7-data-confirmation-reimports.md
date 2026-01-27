# Screen: Data Confirmation - Portfolio Re-imports Tab

## Purpose

Manages re-import status for portfolios, showing which portfolios have requested re-imports and their processing status.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > Data Confirmation                                                 |
|                                                                              |
|  Data Confirmation                                                           |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [Main File Checks] [Other Checks] [Portfolio Re-imports]                    |
|                                                                              |
|  [Refresh Status]  [Export Results]                      Report Date: Jan-31|
|                                                                              |
|  Portfolio Re-import Status                                                  |
|  +------------------------------------------------------------------------+  |
|  | Portfolio     | Re-import    | Requested By | Requested At   | Status |  |
|  |               | Type         |              |                |        |  |
|  |---------------|--------------|--------------|----------------|--------|  |
|  | Portfolio C   | All Files    | OpsLead      | 2026-01-27     |   ✓    |  |
|  |               |              |              | 11:30          |Complete|  |
|  |               |              |              |                |        |  |
|  |---------------|--------------|--------------|----------------|--------|  |
|  | Portfolio A   | Holdings     | Analyst1     | 2026-01-27     |  ⏳    |  |
|  |               | Only         |              | 14:15          |Process |  |
|  |               |              |              |                |        |  |
|  |---------------|--------------|--------------|----------------|--------|  |
|  |               |              |              |                |        |  |
|  |               |              |              |                |        |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Re-import Actions                                                           |
|  ┌──────────────────────────────────────────────────────────────────────┐  |
|  │  Select Portfolio: [Dropdown: All Portfolios ▼]                       │  |
|  │                                                                        │  |
|  │  [Re-import All Files]  [Re-import Specific File Type]                │  |
|  └──────────────────────────────────────────────────────────────────────┘  |
|                                                                              |
|  Legend:  ✓ Complete   ⏳ Processing   ✗ Failed                              |
|                                                                              |
|  Note: Re-importing will overwrite existing data. Ensure this is intended.  |
|                                                                              |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Portfolio Re-imports Tab | Tab | Active tab showing re-import status |
| Refresh Status | Button | Updates re-import status in real-time |
| Export Results | Button | Exports re-import log to Excel |
| Re-import Status Grid | Table | Shows all re-import requests and their status |
| Portfolio Dropdown | Dropdown | Select portfolio for re-import action |
| Re-import All Files | Button | Triggers re-import of all files for selected portfolio |
| Re-import Specific File | Button | Triggers re-import of specific file type |
| Status Icon | Visual Indicator | ✓ Complete, ⏳ Processing, ✗ Failed |

## User Actions

- **View Re-import Status**: See all active and completed re-import requests
- **Trigger Re-import**: Initiate re-import for a specific portfolio
- **Monitor Progress**: Watch processing status of ongoing re-imports
- **Refresh Status**: Update status after re-import completion
- **Export Log**: Export re-import history for audit

## Navigation

- **From:** Main File Checks Tab, Other Checks Tab
- **To:** Main File Checks Tab (after re-import), Portfolio Imports Dashboard
