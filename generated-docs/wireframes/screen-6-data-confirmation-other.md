# Screen: Data Confirmation - Other Checks Tab

## Purpose

Validates reference data completeness (instruments, prices, ratings, durations, betas) with summary counts showing data readiness before proceeding to approvals.

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
|  [Main Data Checks] [Other Checks] [Portfolio Re-imports]                    |
|                                                                              |
|  [Refresh Checks]  [Export Results]                      Report Date: Jan-31|
|                                                                              |
|  Reference Data Completeness                                                 |
|  +------------------------------------------------------------------------+  |
|  |                                                                        |  |
|  |  ┌──────────────────────────────────────────────────────────────┐    |  |
|  |  │  Index Prices                                                 │    |  |
|  |  │  ───────────────────────────────────────────────────────────  │    |  |
|  |  │                                                                │    |  |
|  |  │  Incomplete Count: 3                                     ✗    │    |  |
|  |  │                                                                │    |  |
|  |  └──────────────────────────────────────────────────────────────┘    |  |
|  |                                                                        |  |
|  |  ┌──────────────────────────────────────────────────────────────┐    |  |
|  |  │  Instruments                                                  │    |  |
|  |  │  ───────────────────────────────────────────────────────────  │    |  |
|  |  │                                                                │    |  |
|  |  │  Incomplete Count: 0                                     ✓    │    |  |
|  |  │                                                                │    |  |
|  |  └──────────────────────────────────────────────────────────────┘    |  |
|  |                                                                        |  |
|  |  ┌──────────────────────────────────────────────────────────────┐    |  |
|  |  │  Credit Ratings                                               │    |  |
|  |  │  ───────────────────────────────────────────────────────────  │    |  |
|  |  │                                                                │    |  |
|  |  │  Incomplete Count: 0                                     ✓    │    |  |
|  |  │                                                                │    |  |
|  |  └──────────────────────────────────────────────────────────────┘    |  |
|  |                                                                        |  |
|  |  ┌──────────────────────────────────────────────────────────────┐    |  |
|  |  │  Instrument Durations                                         │    |  |
|  |  │  ───────────────────────────────────────────────────────────  │    |  |
|  |  │                                                                │    |  |
|  |  │  Incomplete Count: 5                                     ✗    │    |  |
|  |  │                                                                │    |  |
|  |  └──────────────────────────────────────────────────────────────┘    |  |
|  |                                                                        |  |
|  |  ┌──────────────────────────────────────────────────────────────┐    |  |
|  |  │  Instrument Betas                                             │    |  |
|  |  │  ───────────────────────────────────────────────────────────  │    |  |
|  |  │                                                                │    |  |
|  |  │  Incomplete Count: 0                                     ✓    │    |  |
|  |  │                                                                │    |  |
|  |  └──────────────────────────────────────────────────────────────┘    |  |
|  |                                                                        |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Legend:  ✓ All Complete   ✗ Issues Found                                   |
|                                                                              |
|  Overall Status: 2 data types with incomplete records (8 total issues)      |
|                                                                              |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Other Checks Tab | Tab | Active tab showing reference data checks |
| Refresh Checks | Button | Updates check status in real-time |
| Export Results | Button | Exports check results to Excel |
| Check Card | Display Panel | Shows status for each data type |
| Incomplete Count | Display | Number of missing/incomplete records |
| Status Icon | Visual Indicator | Green ✓ or Red ✗ |
| Overall Status | Display | Summary of total issues across all checks |

## User Actions

- **View Status**: See at-a-glance reference data completeness
- **Refresh Checks**: Update status after making corrections
- **Export Results**: Export check results for external review
- **Switch Tabs**: Navigate to Main Data Checks or Portfolio Re-imports

## Navigation

- **From:** Start Page, Main Data Checks Tab
- **To:** Main Data Checks Tab, Portfolio Re-imports Tab
