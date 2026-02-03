# Story: Data Confirmation - Main Data Checks Tab

**Epic:** Data Confirmation & Validation
**Story:** 1 of 5
**Wireframe:** `../../wireframes/screen-5-data-confirmation-main.md`

## User Story

**As an** Operations Lead or Analyst
**I want** to see the completeness status of portfolio, custodian, and Bloomberg data
**So that** I can identify missing or incomplete data before proceeding to approvals

## Acceptance Criteria

### Tab Display
- [ ] Given I navigate to Data Confirmation, when the page loads, then I see three tabs: "Main Data Checks", "Other Checks", and "Portfolio Re-imports"
- [ ] Given I am on the Main Data Checks tab, when I view the page, then the tab is highlighted as active

### Portfolio Manager Data Grid
- [ ] Given the Main Data Checks tab is active, when I view the grid, then I see a section titled "Portfolio Manager Data"
- [ ] Given the Portfolio Manager Data section is displayed, when I view the columns, then I see: PortfolioCode, HoldingDataComplete, TransactionDataComplete, IncomeDataComplete, CashDataComplete, PerformanceDataComplete, ManagementFeeDataComplete
- [ ] Given a portfolio's data is complete, when I view its row, then I see a green checkmark icon in the corresponding column
- [ ] Given a portfolio's data is incomplete, when I view its row, then I see a red X icon in the corresponding column
- [ ] Given all portfolios have complete data, when I view the section, then I see a summary badge "All portfolios complete" in green

### Custodian Data Grid
- [ ] Given the Main Data Checks tab is active, when I scroll down, then I see a section titled "Custodian Data"
- [ ] Given the Custodian Data section is displayed, when I view the columns, then I see: PortfolioCode, CustodianHoldingDataComplete, CustodianTransactionDataComplete, CustodianCashDataComplete, CustodianFeeDataComplete
- [ ] Given custodian data is complete, when I view a cell, then I see a green checkmark icon
- [ ] Given custodian data is incomplete, when I view a cell, then I see a red X icon

### Bloomberg Holdings Grid
- [ ] Given the Main Data Checks tab is active, when I scroll down, then I see a section titled "Bloomberg Holdings"
- [ ] Given the Bloomberg Holdings section is displayed, when I view the columns, then I see: PortfolioCode, BloombergHoldingDataComplete
- [ ] Given Bloomberg holdings are complete, when I view a cell, then I see a green checkmark icon
- [ ] Given Bloomberg holdings are incomplete, when I view a cell, then I see a red X icon

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/check-main-data-completeness` | Get main data completeness checks |

## Implementation Notes
- Use Shadcn `<Tabs>` component for tab navigation
- Use Shadcn `<Table>` for each data grid section
- Use Shadcn `<Badge>` with success/destructive variants for status icons
- Display summary badges at the top of each section showing overall completeness
- Implement color-coded visual indicators (green = complete, red = incomplete)
