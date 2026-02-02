# Screen: Data Confirmation - Main File Checks Tab

## Purpose

Verifies portfolio and custodian data completeness with status grid showing at-a-glance data readiness before proceeding to approvals.

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
|  [Refresh Checks]  [Export Results]                      Report Date: Jan-31|
|                                                                              |
|  Portfolio Manager Data                                                      |
|  +------------------------------------------------------------------------+  |
|  | Portfolio  | Holdings | Trans. | Income | Cash | Perf. | Mgmt Fees |   |
|  |------------|----------|--------|--------|------|-------|-----------|   |
|  | Sanlam     |    ✓     |   ✓    |   ✓    |  ✓   |   ✓   |     ✓     |   |
|  | Portfolio A|    ✓     |   ✓    |   ✓    |  ✓   |   ✓   |     ✓     |   |
|  | Portfolio B|    ✓     |   ✓    |   ✓    |  ✓   |   ✓   |     ✓     |   |
|  | Portfolio C|    ✗     |   ✓    |   ○    |  ✓   |   ✓   |     ✓     |   |
|  | Portfolio D|    ✓     |   ✓    |   ✓    |  ✓   |   ✓   |     ✓     |   |
|  | Portfolio E|    ✓     |   ✓    |   ✓    |  ✓   |   ✓   |     ✓     |   |
|  | Portfolio F|    ✓     |   ✓    |   ✓    |  ✓   |   ✓   |     ✓     |   |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Custodian Data                                                              |
|  +------------------------------------------------------------------------+  |
|  | Portfolio  | Custodian   | Custodian  | Custodian | Custodian     |    |
|  |            | Holdings    | Trans.     | Cash      | Fees          |    |
|  |------------|-------------|------------|-----------|---------------|    |
|  | Sanlam     |      ✓      |     ✓      |     ✓     |      ✓        |    |
|  | Portfolio A|      ✓      |     ✓      |     ✓     |      ✓        |    |
|  | Portfolio B|      ✓      |     ✓      |     ✓     |      ✓        |    |
|  | Portfolio C|      ✓      |     ✓      |     ✓     |      ✓        |    |
|  | Portfolio D|      ✓      |     ✓      |     ✓     |      ✓        |    |
|  | Portfolio E|      ✓      |     ✓      |     ✓     |      ✓        |    |
|  | Portfolio F|      ✓      |     ✓      |     ✓     |      ✓        |    |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Bloomberg Holdings                                                          |
|  +------------------------------------------------------------------------+  |
|  | Portfolio  | Bloomberg Holdings                                      |  |
|  |------------|----------------------------------------------------------|  |
|  | Sanlam     |              ✓                                           |  |
|  | Portfolio A|              ✓                                           |  |
|  | Portfolio B|              ✓                                           |  |
|  | Portfolio C|              ✓                                           |  |
|  | Portfolio D|              ✓                                           |  |
|  | Portfolio E|              ✓                                           |  |
|  | Portfolio F|              ✓                                           |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Legend:  ✓ Complete   ✗ Failed   ○ Missing                                 |
|                                                                              |
|  Overall Status: 2 issues found                                             |
|                                                                              |
+------------------------------------------------------------------------------+

Note: Use the navigation menu to access file upload screens for resolving issues
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Main File Checks Tab | Tab | Active tab showing file completeness |
| Other Checks Tab | Tab | Tab for reference data checks |
| Portfolio Re-imports Tab | Tab | Tab for re-import status |
| Refresh Checks | Button | Updates check status in real-time |
| Export Results | Button | Exports check results to Excel |
| Status Indicators | Icon | Green ✓, Red ✗, or Gray ○ showing data status |
| Portfolio Manager Grid | Table | Shows PM data completeness by portfolio |
| Custodian Grid | Table | Shows custodian data completeness by portfolio |
| Bloomberg Grid | Table | Shows Bloomberg data completeness by portfolio |
| Overall Status | Display | Summary of total issues found |

## User Actions

- **View Status**: See comprehensive data completeness across all portfolios
- **Refresh Checks**: Update status after making corrections
- **Export Results**: Export check results for external review
- **Switch Tabs**: Navigate to Other Checks or Portfolio Re-imports

## Navigation

- **From:** Start Page, File Uploads
- **To:** Other Checks Tab, Portfolio Re-imports Tab
