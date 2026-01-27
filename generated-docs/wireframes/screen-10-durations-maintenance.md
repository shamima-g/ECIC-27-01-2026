# Screen: Durations & YTM Maintenance

## Purpose

Maintain instrument duration and yield-to-maturity data with comprehensive audit tracking. Includes outstanding durations grid for quick identification of gaps.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > [Data Maintenance] > Durations & YTM                              |
|                                                                              |
|  Durations & YTM Maintenance                                                 |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [Current Durations] [Outstanding Durations] [Audit Trail]                   |
|                                                                              |
|  [Add Duration Entry]  [View Full Audit Trail]           Report Date: Jan-31|
|                                                                              |
|  Search: [____________] Filter by: [Status ▼] [Search]  [Clear]            |
|                                                                              |
|  Current Durations for Batch                                                 |
|  +------------------------------------------------------------------------+  |
|  | Id  | Instr.   | ISIN        | Instr.     | Duration | YTM    | ... |  |
|  |     | Code     |             | Name       |          |        |     |  |
|  |-----|----------|-------------|------------|----------|--------|-----|  |
|  | 1   | GVT002   | ZAG0005678  | RSA Govt   | 7.45     | 9.25%  | [↓] |  |
|  |     |          |             | R186       |          |        |     |  |
|  | 2   | CRP003   | ZAC0009876  | Corporate  | 5.20     | 10.50% | [↓] |  |
|  |     |          |             | Bond A     |          |        |     |  |
|  | 3   | GVT006   | ZAG0003333  | RSA Govt   | 3.80     | 8.75%  | [↓] |  |
|  |     |          |             | R2035      |          |        |     |  |
|  | 4   | CRP009   | ZAC0007777  | Bank Bond  | 2.50     | 9.00%  | [↓] |  |
|  |     |          |             | Series 1   |          |        |     |  |
|  | 5   | GVT012   | ZAG0008888  | RSA Govt   | 10.25    | 8.50%  | [↓] |  |
|  |     |          |             | R2048      |          |        |     |  |
|  +------------------------------------------------------------------------+  |
|  | ... | ...      | ...         | ...        | ...      | ...    | ... |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 342 duration entries                     [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Outstanding Durations Tab View:
+------------------------------------------------------------------------------+
|  [Current Durations] [Outstanding Durations] [Audit Trail]                   |
|                                                                              |
|  [Add Duration Entry]                                    Report Date: Jan-31|
|                                                                              |
|  Outstanding Durations (Missing Data)                                        |
|  +------------------------------------------------------------------------+  |
|  | Instr.   | Instr.      | ISIN        | Instrument Name           | Add |  |
|  | Id       | Code        |             |                           |     |  |
|  |----------|-------------|-------------|---------------------------|-----|  |
|  | 45       | GVT015      | ZAG0009999  | RSA Govt R2040            |[+]  |  |
|  | 67       | CRP020      | ZAC0001234  | Corporate Bond B          |[+]  |  |
|  | 89       | GVT018      | ZAG0005555  | RSA Govt R2037            |[+]  |  |
|  | 102      | CRP025      | ZAC0006666  | Municipal Bond Series A   |[+]  |  |
|  | 134      | GVT022      | ZAG0007777  | RSA Govt R2044            |[+]  |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 5 instruments missing duration data                                 |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row Actions (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Id: 1  | Instrument: GVT002 (ZAG0005678) - RSA Govt R186          |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Duration: 7.45          YTM: 9.25%                                     |  |
|  | Report Batch: 456 (Monthly)                                            |  |
|  | Status: Complete                                                       |  |
|  |                                                                        |  |
|  | Last Changed: 2026-01-20 14:45 by Analyst2                            |  |
|  |                                                                        |  |
|  | [Edit]  [Delete]  [View Audit Trail]                         [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Current Durations Tab | Tab | Shows all duration entries for current batch |
| Outstanding Durations Tab | Tab | Shows instruments missing duration data |
| Audit Trail Tab | Tab | Shows complete audit history |
| Add Duration Entry | Button | Opens form to create new duration record |
| View Full Audit Trail | Button | Shows complete change history |
| Search Input | Text Input | Search by instrument code or ISIN |
| Filter Dropdowns | Dropdown | Filter by status |
| Durations Grid | Table | Displays all duration entries |
| Outstanding Grid | Table | Shows instruments missing duration data |
| Add Button [+] | Button | Quick add duration for outstanding instrument |
| Expand Row | Button | Expands row to show full details and actions |
| Edit | Button | Opens edit form for duration entry |
| Delete | Button | Removes duration entry |
| View Audit Trail | Button | Shows audit history for specific entry |
| Pagination | Navigation | Page through duration list |

## User Actions

- **Search/Filter**: Find duration entries by instrument
- **Add Duration**: Create new duration/YTM record
- **Edit Duration**: Modify existing duration values
- **Delete Duration**: Remove duration entry
- **View Outstanding**: See instruments missing duration data
- **Quick Add**: Add duration directly from outstanding list
- **View Audit Trail**: Access complete change history

## Navigation

- **From:** Start Page, Data Confirmation (Other Checks), Quick Navigation
- **To:** Add/Edit Duration Form, Audit Trail View, Data Confirmation

## Access Restrictions

- **Data Preparation Phase**: Full CRUD access
- **After First Approval**: Read-only until rejection returns to Data Preparation
