# Screen: Data Confirmation - Main Data Checks Tab

## Purpose

Verifies portfolio and custodian data completeness across multiple data types (holdings, transactions, income, cash, performance, fees). Displays three sections: Portfolio Manager Data, Custodian Data, and Bloomberg Holdings.

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
|                   ════════════════════                                  |
|                                                                         |
|  Main Data Completeness Verification                    [Refresh Icon] |
|                                                                         |
|  Portfolio Manager Data                                                |
|  +-------------------------------------------------------------------+  |
|  | Portfolio | Holdings | Trans. | Income | Cash | Perf. | Mgmt Fee|  |
|  | Code      | Complete | Comp.  | Comp.  | Comp.| Comp. | Complete|  |
|  +-------------------------------------------------------------------+  |
|  | SANLAM    |    ✓     |   ✓    |   ✓    |  ✓   |   ✓   |    ✓    |  |
|  | PORT-A    |    ✓     |   ✗    |   ✓    |  ✓   |   ✗   |    ✓    |  |
|  | PORT-B    |    ✓     |   ✓    |   ✓    |  ✓   |   ✓   |    ✓    |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  Custodian Data                                                        |
|  +-------------------------------------------------------------------+  |
|  | Portfolio | Custodian | Custodian | Custodian | Custodian        |  |
|  | Code      | Holdings  | Trans.    | Cash      | Fees             |  |
|  |           | Complete  | Complete  | Complete  | Complete         |  |
|  +-------------------------------------------------------------------+  |
|  | SANLAM    |     ✓     |     ✓     |     ✓     |     ✓            |  |
|  | PORT-A    |     ✓     |     ✓     |     ✗     |     ✓            |  |
|  | PORT-B    |     ✓     |     ✓     |     ✓     |     ✓            |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  Bloomberg Holdings                                                    |
|  +-------------------------------------------------------------------+  |
|  | Portfolio Code      | Bloomberg Holdings Complete                 |  |
|  +-------------------------------------------------------------------+  |
|  | SANLAM              |              ✓                              |  |
|  | PORT-A              |              ✓                              |  |
|  | PORT-B              |              ✗                              |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  Legend:  ✓ Complete   ✗ Incomplete                                    |
|                                                                         |
|                                            [Confirm Data Button]       |
|                                                                         |
+-------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Tab Navigation | Tabs Component | Three tabs: File Checks, Main Data Checks (active), Other Checks |
| Refresh Icon | Button | Refreshes the main data check status from the API |
| Portfolio Manager Table | Table | Shows completeness of portfolio manager data across 7 dimensions |
| Custodian Data Table | Table | Shows completeness of custodian data across 4 dimensions |
| Bloomberg Holdings Table | Table | Shows completeness of Bloomberg holdings data |
| Status Indicator | Badge/Icon | Visual indicator showing complete (✓) or incomplete (✗) status |
| Legend | Static Text | Explains status indicators |
| Confirm Data Button | Primary Button | Always visible; confirms data and moves to approval phase |

## User Actions

- **View Data Completeness**: Review completeness status across all portfolios and data types
- **Refresh Data**: Click refresh icon to update check status in real-time
- **Navigate Tabs**: Click File Checks or Other Checks tabs to view other validation screens
- **Confirm Data**: Click "Confirm Data" button to submit approval and advance workflow
- **Identify Gaps**: Red ✗ indicators highlight which portfolios have incomplete data
- **Navigate to Fixes**: User manually navigates to File Upload screens to resolve issues

## Data Displayed

### Portfolio Manager Data Table Columns:
- **PortfolioCode**: Portfolio identifier
- **HoldingDataComplete**: Holdings data status (✓/✗)
- **TransactionDataComplete**: Transaction data status (✓/✗)
- **IncomeDataComplete**: Income data status (✓/✗)
- **CashDataComplete**: Cash data status (✓/✗)
- **PerformanceDataComplete**: Performance data status (✓/✗)
- **ManagementFeeDataComplete**: Management fee data status (✓/✗)

### Custodian Data Table Columns:
- **PortfolioCode**: Portfolio identifier
- **CustodianHoldingDataComplete**: Custodian holding status (✓/✗)
- **CustodianTransactionDataComplete**: Custodian transaction status (✓/✗)
- **CustodianCashDataComplete**: Custodian cash status (✓/✗)
- **CustodianFeeDataComplete**: Custodian fee status (✓/✗)

### Bloomberg Holdings Table Columns:
- **PortfolioCode**: Portfolio identifier
- **BloombergHoldingDataComplete**: Bloomberg holding status (✓/✗)

### Status Values:
- API returns string values: "Complete", "Incomplete", or similar
- UI renders as ✓ (green) for complete, ✗ (red) for incomplete

## Navigation

- **From**: File Checks tab, Other Checks tab, or navigation menu
- **To**:
  - File Checks tab (tab navigation)
  - Other Checks tab (tab navigation)
  - File Upload screens (user navigates manually to fix issues)
  - Approval screens (after clicking Confirm Data)

## API Integration

### API Endpoints Used:
- **GET** `/check-main-data-completeness` - Retrieves main data completeness check data
- **POST** `/approve-logs/{ReportBatchId}` - Confirms data (triggered by Confirm Data button)

### Response Structure (GET `/check-main-data-completeness`):
```typescript
{
  PortfolioManagerData: {
    PortfolioCode: string;
    HoldingDataComplete: string;
    TransactionDataComplete: string;
    IncomeDataComplete: string;
    CashDataComplete: string;
    PerformanceDataComplete: string;
    ManagementFeeDataComplete: string;
  }[];
  CustodianData: {
    PortfolioCode: string;
    CustodianHoldingDataComplete: string;
    CustodianTransactionDataComplete: string;
    CustodianCashDataComplete: string;
    CustodianFeeDataComplete: string;
  }[];
  BloombergHoldings: {
    PortfolioCode: string;
    BloombergHoldingDataComplete: string;
  }[];
}
```

## Behavior Notes

- This screen is **informational only** - users cannot fix issues directly here
- User must navigate to File Upload screens to resolve incomplete data
- Status updates automatically when data is modified elsewhere
- Confirm Data button is always enabled (user decides if data is acceptable)
- Tables may be scrollable if many portfolios exist
- Refresh icon triggers real-time API call to update displayed data
