# Screen: Data Confirmation - Other Checks Tab

## Purpose

Validates reference data completeness by showing incomplete count summaries for index prices, instruments, credit ratings, durations, and betas. Provides quick visibility into missing reference data that needs attention.

## Wireframe

```
+-------------------------------------------------------------------------+
|  InvestInsight - Data Confirmation                                     |
+-------------------------------------------------------------------------+
|                                                                         |
|  Data Confirmation & Validation                                        |
|  ─────────────────────────────────────────────────────────────────────  |
|                                                                         |
|  [ File Checks ]  [ Main Data Checks ]  [ Other Checks ]               |
|                                          ═══════════════                |
|                                                                         |
|  Reference Data Completeness Verification               [Refresh Icon] |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | Data Check Type                      | Incomplete Count | Status  |  |
|  +-------------------------------------------------------------------+  |
|  | Index Price Incomplete Count         |        0         |   ✓     |  |
|  | Instrument Incomplete Count          |        3         |   ✗     |  |
|  | Credit Rating Incomplete Count       |        0         |   ✓     |  |
|  | Instrument Duration Incomplete Count |        2         |   ✗     |  |
|  | Instrument Beta Incomplete Count     |        1         |   ✗     |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  Legend:  ✓ Complete (0 incomplete)   ✗ Incomplete (>0 incomplete)     |
|                                                                         |
|  Summary: 3 data check types have incomplete records.                  |
|                                                                         |
|  To resolve incomplete data, navigate to:                              |
|  - Instruments Maintenance (for incomplete instruments)                |
|  - Index Prices Maintenance (for missing index prices)                 |
|  - Credit Ratings Maintenance (for missing credit ratings)             |
|  - Durations & YTM Maintenance (for missing durations)                 |
|  - Instrument Betas Maintenance (for missing betas)                    |
|                                                                         |
|                                                                         |
|                                                                         |
|                                            [Confirm Data Button]       |
|                                                                         |
+-------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Tab Navigation | Tabs Component | Three tabs: File Checks, Main Data Checks, Other Checks (active) |
| Refresh Icon | Button | Refreshes the other data check status from the API |
| Other Checks Table | Table | Displays data check type, incomplete count, and status |
| Status Indicator | Badge/Icon | Visual indicator showing complete (✓) or incomplete (✗) status |
| Legend | Static Text | Explains status indicators |
| Summary Text | Static Text | Shows count of data types with incomplete records |
| Guidance Text | Static Text | Directs users to appropriate maintenance screens |
| Confirm Data Button | Primary Button | Always visible; confirms data and moves to approval phase |

## User Actions

- **View Reference Data Status**: See counts of incomplete reference data across all data types
- **Refresh Data**: Click refresh icon to update check status in real-time
- **Navigate Tabs**: Click File Checks or Main Data Checks tabs to view other validation screens
- **Confirm Data**: Click "Confirm Data" button to submit approval and advance workflow
- **Identify Issues**: Red ✗ indicators and non-zero counts show which data types need attention
- **Navigate to Maintenance**: User manually navigates to appropriate maintenance screens to fix issues

## Data Displayed

### Other Checks Table Columns:
- **Data Check Type**: Name of the reference data check
- **Incomplete Count**: Number of records that are incomplete or missing
- **Status**: Visual indicator (✓ green for 0 incomplete, ✗ red for >0 incomplete)

### Check Types:
1. **Index Price Incomplete Count**: Number of index prices missing for the current batch
2. **Instrument Incomplete Count**: Number of instruments with incomplete master data
3. **Credit Rating Incomplete Count**: Number of instruments missing credit ratings
4. **Instrument Duration Incomplete Count**: Number of instruments missing duration/YTM data
5. **Instrument Beta Incomplete Count**: Number of instruments missing beta values

### Status Logic:
- ✓ (Complete): Incomplete Count = 0
- ✗ (Incomplete): Incomplete Count > 0

## Navigation

- **From**: File Checks tab, Main Data Checks tab, or navigation menu
- **To**:
  - File Checks tab (tab navigation)
  - Main Data Checks tab (tab navigation)
  - Instruments Maintenance screen (user navigates manually)
  - Index Prices Maintenance screen (user navigates manually)
  - Credit Ratings Maintenance screen (user navigates manually)
  - Durations & YTM Maintenance screen (user navigates manually)
  - Instrument Betas Maintenance screen (user navigates manually)
  - Approval screens (after clicking Confirm Data)

## API Integration

### API Endpoints Used:
- **GET** `/check-other-data-completeness` - Retrieves other data completeness check data
- **POST** `/approve-logs/{ReportBatchId}` - Confirms data (triggered by Confirm Data button)

### Response Structure (GET `/check-other-data-completeness`):
```typescript
{
  IndexPriceIncompleteCount: number;
  InstrumentIncompleteCount: number;
  CreditRatingIncompleteCount: number;
  InstrumentDurationIncompleteCount: number;
  InstrumentBetaIncompleteCount: number;
}
```

## Behavior Notes

- This screen is **informational only** - users cannot fix issues directly here
- User must navigate to appropriate Maintenance screens to resolve incomplete data
- Status updates automatically when data is modified elsewhere
- Confirm Data button is always enabled (user decides if data is acceptable)
- Guidance text helps users understand where to go to fix each type of issue
- Refresh icon triggers real-time API call to update displayed data
- Summary text dynamically calculates how many check types have incomplete records
