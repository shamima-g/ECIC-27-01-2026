# Screen: Instrument Betas Maintenance

## Purpose

Maintain instrument beta values with full audit capabilities. Includes outstanding betas grid for quick identification of missing beta data.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > [Data Maintenance] > Instrument Betas                             |
|                                                                              |
|  Instrument Betas Maintenance                                                |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [Current Betas] [Outstanding Betas] [Audit Trail]                           |
|                                                                              |
|  [Add Beta Entry]  [View Full Audit Trail]               Report Date: Jan-31|
|                                                                              |
|  Search: [____________] Filter by: [Status ▼] [Search]  [Clear]            |
|                                                                              |
|  Current Betas for Batch                                                     |
|  +------------------------------------------------------------------------+  |
|  | Id  | Instr.   | ISIN        | Instr.     | Beta     | Status  | ... |  |
|  |     | Code     |             | Name       |          |         |     |  |
|  |-----|----------|-------------|------------|----------|---------|-----|  |
|  | 1   | SAL001   | ZAE0001234  | Sanlam Ltd | 1.15     | Active  | [↓] |  |
|  |     |          |             |            |          |         |     |  |
|  | 2   | EQT004   | US12345678  | US Equity  | 0.95     | Active  | [↓] |  |
|  |     |          |             | Fund       |          |         |     |  |
|  | 3   | SAL008   | ZAE0005555  | Banking    | 1.25     | Active  | [↓] |  |
|  |     |          |             | Sector ETF |          |         |     |  |
|  | 4   | EQT011   | GB98765432  | UK Equity  | 0.88     | Active  | [↓] |  |
|  |     |          |             | PLC        |          |         |     |  |
|  | 5   | SAL015   | ZAE0009999  | Resource   | 1.40     | Active  | [↓] |  |
|  |     |          |             | Stock A    |          |         |     |  |
|  +------------------------------------------------------------------------+  |
|  | ... | ...      | ...         | ...        | ...      | ...     | ... |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 287 beta entries                         [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Outstanding Betas Tab View:
+------------------------------------------------------------------------------+
|  [Current Betas] [Outstanding Betas] [Audit Trail]                           |
|                                                                              |
|  [Add Beta Entry]                                        Report Date: Jan-31|
|                                                                              |
|  Outstanding Betas (Missing Data)                                            |
|  +------------------------------------------------------------------------+  |
|  | Instr.   | Instr.      | ISIN        | Instrument Name           | Add |  |
|  | Id       | Code        |             |                           |     |  |
|  |----------|-------------|-------------|---------------------------|-----|  |
|  | 56       | SAL020      | ZAE0003333  | Emerging Market Fund      |[+]  |  |
|  | 78       | EQT025      | US67890123  | Tech Stock B              |[+]  |  |
|  | 91       | SAL030      | ZAE0007777  | Property Fund A           |[+]  |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 3 instruments missing beta data                                     |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row Actions (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Id: 1  | Instrument: SAL001 (ZAE0001234) - Sanlam Ltd             |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Beta: 1.15                                                             |  |
|  | Report Batch: 456 (Monthly)                                            |  |
|  | Status: Active                                                         |  |
|  |                                                                        |  |
|  | Last Changed: 2026-01-18 09:20 by RiskAnalyst                         |  |
|  |                                                                        |  |
|  | [Edit]  [Delete]  [View Audit Trail]                         [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Current Betas Tab | Tab | Shows all beta entries for current batch |
| Outstanding Betas Tab | Tab | Shows instruments missing beta data |
| Audit Trail Tab | Tab | Shows complete audit history |
| Add Beta Entry | Button | Opens form to create new beta record |
| View Full Audit Trail | Button | Shows complete change history |
| Search Input | Text Input | Search by instrument code or ISIN |
| Filter Dropdowns | Dropdown | Filter by status |
| Betas Grid | Table | Displays all beta entries |
| Outstanding Grid | Table | Shows instruments missing beta data |
| Add Button [+] | Button | Quick add beta for outstanding instrument |
| Expand Row | Button | Expands row to show full details and actions |
| Edit | Button | Opens edit form for beta entry |
| Delete | Button | Removes beta entry |
| View Audit Trail | Button | Shows audit history for specific entry |
| Pagination | Navigation | Page through beta list |

## User Actions

- **Search/Filter**: Find beta entries by instrument
- **Add Beta**: Create new beta record
- **Edit Beta**: Modify existing beta value
- **Delete Beta**: Remove beta entry
- **View Outstanding**: See instruments missing beta data
- **Quick Add**: Add beta directly from outstanding list
- **View Audit Trail**: Access complete change history

## Navigation

- **From:** Start Page, Data Confirmation (Other Checks), Quick Navigation
- **To:** Add/Edit Beta Form, Audit Trail View, Data Confirmation

## Access Restrictions

- **Data Preparation Phase**: Full CRUD access
- **After First Approval**: Read-only until rejection returns to Data Preparation
