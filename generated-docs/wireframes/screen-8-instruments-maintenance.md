# Screen: Instruments Maintenance

## Purpose

Create, update, and manage instrument master data with full audit trail support. Central repository for all instrument information.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > [Data Maintenance] > Instruments                                  |
|                                                                              |
|  Instruments Maintenance                                                     |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [Add New Instrument]  [Export ISINs]  [View Full Audit Trail]              |
|                                                                              |
|  Search: [____________] Filter by: [Type ▼] [Status ▼] [Search]  [Clear]   |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | Id  | Code   | ISIN        | Name       | Type  | Asset | Ccy | ... |  |
|  |     |        |             |            |       | Class |     |     |  |
|  |-----|--------|-------------|------------|-------|-------|-----|-----|  |
|  | 1   | SAL001 | ZAE0001234  | Sanlam Ltd | Equity| Equity| ZAR | [↓] |  |
|  | 2   | GVT002 | ZAG0005678  | RSA Govt   | Bond  | Fixed | ZAR | [↓] |  |
|  |     |        |             | R186       |       | Income|     |     |  |
|  | 3   | CRP003 | ZAC0009876  | Corporate  | Bond  | Fixed | ZAR | [↓] |  |
|  |     |        |             | Bond A     |       | Income|     |     |  |
|  | 4   | EQT004 | US12345678  | US Equity  | Equity| Equity| USD | [↓] |  |
|  | 5   | FND005 | ZAF0001111  | Money Mkt  | Fund  | Cash  | ZAR | [↓] |  |
|  |     |        |             | Fund       |       |       |     |     |  |
|  +------------------------------------------------------------------------+  |
|  | ... | ...    | ...         | ...        | ...   | ...   | ... | ... |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 1,234 instruments                        [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row Actions (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Id: 1  | Code: SAL001  | ISIN: ZAE0001234                          |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Instrument Name: Sanlam Ltd                                            |  |
|  | Type: Equity           Asset Class: Equity          Currency: ZAR      |  |
|  | Country: South Africa  Issuer: Sanlam Holdings                         |  |
|  | Maturity Date: N/A     Status: Active                                  |  |
|  |                                                                        |  |
|  | Last Changed: 2026-01-15 10:30 by DataSteward                          |  |
|  |                                                                        |  |
|  | [Edit]  [Delete]  [View Audit Trail]                         [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Add New Instrument | Button | Opens form to create new instrument |
| Export ISINs | Button | Exports incomplete ISINs to Excel |
| View Full Audit Trail | Button | Shows complete audit history for all instruments |
| Search Input | Text Input | Search by code, ISIN, or name |
| Filter Dropdowns | Dropdown | Filter by type or status |
| Instruments Grid | Table | Displays all instruments with key fields |
| Expand Row | Button | Expands row to show full details and actions |
| Edit | Button | Opens edit form for instrument |
| Delete | Button | Soft deletes instrument with audit |
| View Audit Trail | Button | Shows audit history for specific instrument |
| Pagination | Navigation | Page through instrument list |

## User Actions

- **Search/Filter**: Find instruments by code, ISIN, name, type, or status
- **Add Instrument**: Create new instrument master record
- **Edit Instrument**: Modify existing instrument attributes
- **Delete Instrument**: Remove instrument (soft delete with audit)
- **View Audit Trail**: Access complete change history for an instrument
- **Export ISINs**: Download list of incomplete ISINs for external enrichment
- **View Full Audit**: See all changes across all instruments

## Navigation

- **From:** Start Page, Data Confirmation (Other Checks), Quick Navigation
- **To:** Add/Edit Instrument Form, Audit Trail View, Data Confirmation

## Access Restrictions

- **Data Preparation Phase**: Full CRUD access
- **After First Approval**: Read-only until rejection returns to Data Preparation
