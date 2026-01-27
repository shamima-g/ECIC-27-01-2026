# Screen: Report Comments

## Purpose

Capture commentary tied to specific reports within a reporting period. Enables collaboration and documentation of important observations for report users.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > [Data Maintenance] > Report Comments                              |
|                                                                              |
|  Report Comments                                                             |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [Add Comment]  [Export Comments]                        Report Date: Jan-31|
|                                                                              |
|  Filter by: [Report Type ▼] [Portfolio ▼] [User ▼] [Apply] [Clear]        |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | Id  | Report Name              | Portfolio  | Comment Preview   | ... |  |
|  |-----|--------------------------|------------|-------------------|-----|  |
|  | 1   | Monthly Performance      | Sanlam     | Market volatility | [↓] |  |
|  |     | Summary                  |            | increased due to..|     |  |
|  |-----|--------------------------|------------|-------------------|-----|  |
|  | 2   | Holdings Analysis        | Portfolio A| Note: New bond    | [↓] |  |
|  |     |                          |            | position added... |     |  |
|  |-----|--------------------------|------------|-------------------|-----|  |
|  | 3   | Risk Metrics             | Portfolio B| Beta calculation  | [↓] |  |
|  |     |                          |            | updated based on..|     |  |
|  |-----|--------------------------|------------|-------------------|-----|  |
|  | 4   | Transaction Summary      | Sanlam     | Large redemption  | [↓] |  |
|  |     |                          |            | processed on...   |     |  |
|  |-----|--------------------------|------------|-------------------|-----|  |
|  | 5   | Compliance Report        | Portfolio C| All compliance    | [↓] |  |
|  |     |                          |            | checks passed...  |     |  |
|  +------------------------------------------------------------------------+  |
|  | ... | ...                      | ...        | ...               | ... |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 67 comments                              [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row View (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Id: 1  | Report: Monthly Performance Summary                        |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Report Date: 2026-01-31                                                |  |
|  | Report Batch: 456 (Monthly)                                            |  |
|  | Portfolio: Sanlam                                                      |  |
|  |                                                                        |  |
|  | Comment:                                                               |  |
|  | ┌────────────────────────────────────────────────────────────────┐    |  |
|  | │ Market volatility increased due to global economic uncertainty. │    |  |
|  | │ The portfolio saw a 2.3% decline in January, primarily driven   │    |  |
|  | │ by equity positions. Fixed income holdings provided some        │    |  |
|  | │ stability. Risk metrics remain within acceptable ranges.        │    |  |
|  | │ Portfolio managers recommend maintaining current allocation.    │    |  |
|  | └────────────────────────────────────────────────────────────────┘    |  |
|  |                                                                        |  |
|  | Last Changed: 2026-01-27 15:30 by PortfolioManager                    |  |
|  |                                                                        |  |
|  | [Edit]  [Delete]  [View in Report Context]                   [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+

Add/Edit Comment Modal (when "Add Comment" or "Edit" clicked):
+------------------------------------------------------------------------------+
|    ┌────────────────────────────────────────────────────────────────┐       |
|    │  Add Report Comment                                     [X]    │       |
|    ├────────────────────────────────────────────────────────────────┤       |
|    │                                                                 │       |
|    │  Report Batch: [Dropdown: 2026-01-31 (Monthly) ▼]             │       |
|    │                                                                 │       |
|    │  Select Report: [Dropdown: Select Report ▼]                    │       |
|    │                                                                 │       |
|    │  Portfolio (if applicable): [Dropdown: Select Portfolio ▼]     │       |
|    │                                                                 │       |
|    │  Comment:                                                       │       |
|    │  ┌───────────────────────────────────────────────────────┐    │       |
|    │  │                                                         │    │       |
|    │  │                                                         │    │       |
|    │  │                                                         │    │       |
|    │  │                                                         │    │       |
|    │  │                                                         │    │       |
|    │  │                                                         │    │       |
|    │  └───────────────────────────────────────────────────────┘    │       |
|    │                                                                 │       |
|    │  Character count: 0 / 2000                                     │       |
|    │                                                                 │       |
|    │                               [Cancel]      [Save]             │       |
|    └────────────────────────────────────────────────────────────────┘       |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Add Comment | Button | Opens modal to create new report comment |
| Export Comments | Button | Exports all comments to Excel |
| Filter Dropdowns | Dropdown | Filter by report type, portfolio, or user |
| Comments Grid | Table | Displays all report comments with preview |
| Comment Preview | Text | First 50 characters of comment |
| Expand Row | Button | Expands row to show full comment details |
| Edit | Button | Opens edit modal for comment |
| Delete | Button | Removes comment |
| View in Report Context | Button | Opens associated report with comment highlighted |
| Report Batch Dropdown | Dropdown | Select reporting period |
| Select Report Dropdown | Dropdown | Select specific report |
| Portfolio Dropdown | Dropdown | Select portfolio (optional) |
| Comment Text Area | Text Area | Multi-line input for comment (max 2000 chars) |
| Character Count | Display | Shows remaining characters |
| Save | Button | Saves comment |
| Pagination | Navigation | Page through comments list |

## User Actions

- **View Comments**: See all comments for current reporting batch
- **Add Comment**: Create new commentary for a specific report
- **Edit Comment**: Modify existing comment
- **Delete Comment**: Remove comment
- **Filter Comments**: Filter by report type, portfolio, or author
- **Export Comments**: Download all comments for external review
- **View in Context**: See comment within the associated report

## Navigation

- **From:** Start Page, Quick Navigation, Approvals Screens
- **To:** Add/Edit Comment Modal, Report Viewer (context view)
