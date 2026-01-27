# Screen: Credit Ratings Maintenance

## Purpose

Manage credit rating data for instruments and view rating changes across portfolios. Supports both national and international rating scales with decision flow retry capability.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > [Data Maintenance] > Credit Ratings                               |
|                                                                              |
|  Credit Ratings Maintenance                                                  |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [Current Ratings] [Rating Changes] [Audit Trail]                            |
|                                                                              |
|  [Add Rating]  [Retry Decision Flow]  [View Full Audit]  Report Date: Jan-31|
|                                                                              |
|  Search: [____________] Filter by: [Agency ▼] [Country ▼] [Search] [Clear] |
|                                                                              |
|  Current Credit Ratings                                                      |
|  +------------------------------------------------------------------------+  |
|  | Id | Instr. | ISIN      | Country | Agency | National | Intl.  | ... |  |
|  |    | Code   |           |         |        | Rating   | Rating |     |  |
|  |----|--------|-----------|---------|--------|----------|--------|-----|  |
|  | 1  | GVT002 | ZAG000567 | ZA      | Moody  | A2.za    | Baa3   | [↓] |  |
|  |    |        |           |         |        |          |        |     |  |
|  | 2  | CRP003 | ZAC000987 | ZA      | S&P    | zaAA-    | BB+    | [↓] |  |
|  |    |        |           |         |        |          |        |     |  |
|  | 3  | GVT006 | ZAG000333 | ZA      | Fitch  | AA+(zaf) | BB+    | [↓] |  |
|  |    |        |           |         |        |          |        |     |  |
|  | 4  | CRP009 | ZAC000777 | ZA      | Moody  | A1.za    | Ba1    | [↓] |  |
|  |    |        |           |         |        |          |        |     |  |
|  | 5  | USG001 | US123456  | US      | S&P    | AA+      | AA+    | [↓] |  |
|  |    |        |           |         |        |          |        |     |  |
|  +------------------------------------------------------------------------+  |
|  | ...| ...    | ...       | ...     | ...    | ...      | ...    | ... |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 412 credit ratings                       [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Rating Changes Tab View:
+------------------------------------------------------------------------------+
|  [Current Ratings] [Rating Changes] [Audit Trail]                            |
|                                                                              |
|  [Export Changes]                                        Report Date: Jan-31|
|                                                                              |
|  Credit Rating Changes                                                       |
|  +------------------------------------------------------------------------+  |
|  | Report  | Instr. | ISIN      | Country | Natl.  | Prev.  | Intl.  |...|
|  | Date    | Code   |           |         | Rating | Natl.  | Rating |   |
|  |---------|--------|-----------|---------|--------|--------|--------|---|  |
|  | 2026-01 | GVT002 | ZAG000567 | ZA      | A2.za  | A3.za  | Baa3   |[↓]|
|  | -31     |        |           |         |        |        |        |   |  |
|  | 2026-01 | CRP015 | ZAC000444 | ZA      | zaA+   | zaAA-  | BB     |[↓]|
|  | -31     |        |           |         |        |        |        |   |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 2 rating changes for this period                                    |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row Actions (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Id: 1  | Instrument: GVT002 (ZAG0005678) - RSA Govt R186          |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Country: South Africa                  Rating Agency: Moody's         |  |
|  | Rating Scale: National + International                                |  |
|  |                                                                        |  |
|  | National Rating: A2.za                                                 |  |
|  | International Rating: Baa3                                             |  |
|  | Final National Rating: A2.za                                           |  |
|  | Final International Rating: Baa3                                       |  |
|  |                                                                        |  |
|  | Effective Date: 2026-01-15                                             |  |
|  | Last Changed: 2026-01-15 11:00 by DataSteward                         |  |
|  |                                                                        |  |
|  | [Edit]  [Delete]  [View History]  [View Audit Trail]        [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Current Ratings Tab | Tab | Shows all current credit ratings |
| Rating Changes Tab | Tab | Shows rating changes across reporting periods |
| Audit Trail Tab | Tab | Shows complete audit history |
| Add Rating | Button | Opens form to create new credit rating |
| Retry Decision Flow | Button | Re-runs credit rating decision flow for batch |
| View Full Audit | Button | Shows complete change history |
| Export Changes | Button | Exports rating changes to Excel |
| Search Input | Text Input | Search by instrument code or ISIN |
| Filter Dropdowns | Dropdown | Filter by agency or country |
| Ratings Grid | Table | Displays all credit ratings |
| Rating Changes Grid | Table | Shows rating changes with before/after values |
| Expand Row | Button | Expands row to show full details and actions |
| Edit | Button | Opens edit form for rating |
| Delete | Button | Removes rating entry |
| View History | Button | Shows rating history for instrument |
| View Audit Trail | Button | Shows audit history for specific rating |
| Pagination | Navigation | Page through ratings list |

## User Actions

- **Search/Filter**: Find ratings by instrument, agency, or country
- **Add Rating**: Create new credit rating
- **Edit Rating**: Modify existing rating
- **Delete Rating**: Remove rating entry
- **View Changes**: See rating changes across periods
- **View History**: Access rating history for an instrument
- **Retry Decision Flow**: Re-run rating decision logic
- **View Audit Trail**: Access complete change history
- **Export Changes**: Download rating changes for review

## Navigation

- **From:** Start Page, Data Confirmation (Other Checks), Quick Navigation
- **To:** Add/Edit Rating Form, Rating History View, Audit Trail View

## Access Restrictions

- **Data Preparation Phase**: Full CRUD access
- **After First Approval**: Read-only until rejection returns to Data Preparation
