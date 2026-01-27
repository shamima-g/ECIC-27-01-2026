# Screen: Index Prices Maintenance

## Purpose

Upload, update, and view index price data with full history tracking. Ensures all required index prices are captured for the current reporting batch.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > [Data Maintenance] > Index Prices                                 |
|                                                                              |
|  Index Prices Maintenance                                                    |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [Add Price]  [Upload Prices]  [Quick Pop-up]           Report Date: Jan-31 |
|                                                                              |
|  Search: [____________] Filter by: [Index ▼] [Status ▼] [Search]  [Clear]  |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | Id  | Report   | Index    | Index Code | Bloomberg  | Price    | ... |  |
|  |     | Date     | Name     |            | Ticker     |          |     |  |
|  |-----|----------|----------|------------|------------|----------|-----|  |
|  | 1   | 2026-01  | ALSI     | J203       | J203:IND   | 78,234.5 | [↓] |  |
|  |     | -31      |          |            |            |          |     |  |
|  | 2   | 2026-01  | SWIX     | J403       | J403:IND   | 56,789.2 | [↓] |  |
|  |     | -31      |          |            |            |          |     |  |
|  | 3   | 2026-01  | ALBI     | JALBI      | JALBI:IND  | 1,234.8  | [↓] |  |
|  |     | -31      |          |            |            |          |     |  |
|  | 4   | 2026-01  | STeFI    | STEFI      | STEFI:IND  | 892.45   | [↓] |  |
|  |     | -31      |          |            |            |          |     |  |
|  | 5   | 2026-01  | S&P 500  | SPX        | SPX:IND    | 4,567.89 | [↓] |  |
|  |     | -31      |          |            |            |          |     |  |
|  +------------------------------------------------------------------------+  |
|  | ... | ...      | ...      | ...        | ...        | ...      | ... |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 145 index prices                         [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row Actions (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Id: 1  | Index: ALSI (J203)  | Bloomberg: J203:IND                 |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Report Date: 2026-01-31                                                |  |
|  | Report Batch: 456 (Monthly)                                            |  |
|  | Price: 78,234.50                                                       |  |
|  | Status: Complete                                                       |  |
|  |                                                                        |  |
|  | [Edit Price]  [Delete]  [View History]                       [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+

Quick Pop-up View (when "Quick Pop-up" clicked):
+------------------------------------------------------------------------------+
|    ┌────────────────────────────────────────────────────────────────┐       |
|    │  Quick Price Entry                                      [X]    │       |
|    ├────────────────────────────────────────────────────────────────┤       |
|    │                                                                 │       |
|    │  Report Date: 2026-01-31                                       │       |
|    │                                                                 │       |
|    │  Outstanding Index Prices:                                     │       |
|    │  ┌───────────────────────────────────────────────────────┐    │       |
|    │  │ Index Code    | Index Name      | Price Entry         │    │       |
|    │  │---------------|-----------------|---------------------│    │       |
|    │  │ MSCI          | MSCI World      | [_________]         │    │       |
|    │  │ EMBI          | Emerging Bonds  | [_________]         │    │       |
|    │  │ BCOM          | Bloomberg Comm. | [_________]         │    │       |
|    │  └───────────────────────────────────────────────────────┘    │       |
|    │                                                                 │       |
|    │                               [Cancel]      [Save All]         │       |
|    └────────────────────────────────────────────────────────────────┘       |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Add Price | Button | Opens form to create new price entry |
| Upload Prices | Button | Opens bulk upload dialog for price file |
| Quick Pop-up | Button | Opens quick entry form for missing prices |
| Search Input | Text Input | Search by index code or name |
| Filter Dropdowns | Dropdown | Filter by index or status |
| Index Prices Grid | Table | Displays all index prices for current batch |
| Expand Row | Button | Expands row to show full details and actions |
| Edit Price | Button | Opens edit form for price entry |
| Delete | Button | Removes price entry |
| View History | Button | Shows price history for specific index |
| Quick Entry Form | Modal | Rapid entry for multiple missing prices |
| Pagination | Navigation | Page through price list |

## User Actions

- **Search/Filter**: Find index prices by code or name
- **Add Price**: Enter new index price for current batch
- **Edit Price**: Modify existing price entry
- **Delete Price**: Remove price entry
- **Upload Prices**: Bulk upload price file
- **Quick Pop-up**: Rapid entry for outstanding prices
- **View History**: Access price history across reporting periods

## Navigation

- **From:** Start Page, Data Confirmation (Other Checks), Quick Navigation
- **To:** Add/Edit Price Form, Price History View, Bulk Upload Dialog

## Access Restrictions

- **Data Preparation Phase**: Full CRUD access
- **After First Approval**: Read-only until rejection returns to Data Preparation
