# Story: Main Data Checks Tab

**Epic:** Data Confirmation & Validation
**Story:** 3 of 5
**Wireframe:** [screen-6-data-confirmation-main-checks.md](../../wireframes/screen-6-data-confirmation-main-checks.md)

## User Story

**As a** data operations user
**I want** to view portfolio manager, custodian, and Bloomberg data completeness by portfolio
**So that** I can identify which portfolios have incomplete data across multiple data types before confirming data

## Acceptance Criteria

### Happy Path - Portfolio Manager Data
- [ ] Given I am on the Main Data Checks tab, when the page loads, then I see a section titled "Portfolio Manager Data"
- [ ] Given I am viewing Portfolio Manager Data, when the data loads, then I see a table with columns: "Portfolio Code", "Holdings Complete", "Trans. Complete", "Income Complete", "Cash Complete", "Perf. Complete", "Mgmt Fee Complete"
- [ ] Given I am viewing Portfolio Manager Data, when a data type is complete for a portfolio, then I see a green checkmark (✓) in that column
- [ ] Given I am viewing Portfolio Manager Data, when a data type is incomplete for a portfolio, then I see a red X (✗) in that column

### Happy Path - Custodian Data
- [ ] Given I am on the Main Data Checks tab, when I scroll down, then I see a section titled "Custodian Data"
- [ ] Given I am viewing Custodian Data, when the data loads, then I see a table with columns: "Portfolio Code", "Custodian Holdings Complete", "Custodian Trans. Complete", "Custodian Cash Complete", "Custodian Fees Complete"
- [ ] Given I am viewing Custodian Data, when a data type is complete for a portfolio, then I see a green checkmark (✓) in that column
- [ ] Given I am viewing Custodian Data, when a data type is incomplete for a portfolio, then I see a red X (✗) in that column

### Happy Path - Bloomberg Holdings
- [ ] Given I am on the Main Data Checks tab, when I scroll further, then I see a section titled "Bloomberg Holdings"
- [ ] Given I am viewing Bloomberg Holdings, when the data loads, then I see a table with columns: "Portfolio Code", "Bloomberg Holdings Complete"
- [ ] Given I am viewing Bloomberg Holdings, when holdings are complete for a portfolio, then I see a green checkmark (✓)
- [ ] Given I am viewing Bloomberg Holdings, when holdings are incomplete for a portfolio, then I see a red X (✗)

### Refresh Functionality
- [ ] Given I am on the Main Data Checks tab, when I click the Refresh icon, then the main data check data is fetched from the API
- [ ] Given I am on the Main Data Checks tab, when I click the Refresh icon, then I see a loading indicator while data is being fetched
- [ ] Given I am on the Main Data Checks tab, when the refresh completes, then all three tables update with the latest data

### UI/UX
- [ ] Given I am on the Main Data Checks tab, when I view the page, then I see a legend explaining "✓ Complete" and "✗ Incomplete"
- [ ] Given I am viewing the tables, when there are many portfolios, then the tables are scrollable within the tab content area
- [ ] Given I am viewing the page, when I look at the sections, then there is clear visual separation between Portfolio Manager Data, Custodian Data, and Bloomberg Holdings sections

### Edge Cases
- [ ] Given I am on the Main Data Checks tab, when the API returns empty arrays for all sections, then I see a message "No main data check data available"
- [ ] Given I am on the Main Data Checks tab, when the API call fails, then I see an error message "Failed to load main data checks. Please try again."

### Error Handling
- [ ] Given I am on the Main Data Checks tab, when the API returns a 500 error, then I see an error message "Unable to load main data checks. Please contact support."
- [ ] Given I encounter an error, when I click the Refresh icon again, then the API call is retried

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/check-main-data-completeness` | Fetch main data completeness check data for the current batch |

**Required Parameters:** None (uses current active batch context)

**Response Structure:**
```typescript
{
  PortfolioManagers: Array<{
    PortfolioCode: string;
    HoldingDataComplete: string;          // "Complete" | "Incomplete"
    TransactionDataComplete: string;      // "Complete" | "Incomplete"
    IncomeDataComplete: string;           // "Complete" | "Incomplete"
    CashDataComplete: string;             // "Complete" | "Incomplete"
    PerformanceDataComplete: string;      // "Complete" | "Incomplete"
    ManagementFeeDataComplete: string;    // "Complete" | "Incomplete"
  }>;
  Custodians: Array<{
    PortfolioCode: string;
    CustodianHoldingDataComplete: string;       // "Complete" | "Incomplete"
    CustodianTransactionDataComplete: string;   // "Complete" | "Incomplete"
    CustodianCashDataComplete: string;          // "Complete" | "Incomplete"
    CustodianFeeDataComplete: string;           // "Complete" | "Incomplete"
  }>;
  BloombergHoldings: Array<{
    PortfolioCode: string;
    BloombergHoldingDataComplete: string;       // "Complete" | "Incomplete"
  }>;
}
```

**Status Logic:**
- Complete (✓): Field value is "Complete"
- Incomplete (✗): Field value is "Incomplete" (or any other non-"Complete" value)

## Related Artifacts

- **Wireframes:** [screen-6-data-confirmation-main-checks.md](../../wireframes/screen-6-data-confirmation-main-checks.md)
- **Depends on:** Story 1 (Data Confirmation Page Setup) - for tab structure
- **Impacts:**
  - Story 5 (Confirm Data Workflow) - uses this tab as one of the data quality views
  - Epic 2 stories - users may navigate to File Upload screens to resolve portfolio data issues

## Implementation Notes

- Fetch data from `/check-main-data-completeness` on component mount and when Refresh icon is clicked
- Use Shadcn UI `<Table>` component for all three tables
- Status indicators should be accessible: use `aria-label` (e.g., "Complete" or "Incomplete")
- Use green color for checkmark (e.g., `text-green-600`) and red for X (e.g., `text-red-600`)
- Show loading state with Shadcn UI `<Spinner>` or skeleton loader during API calls
- Display error messages using Shadcn UI `<Alert>` component
- Consider using `<Card>` component to visually separate the three sections
- Refresh icon should be a button with proper aria-label (e.g., "Refresh main data checks")
- Tables should be responsive (consider horizontal scroll or responsive patterns for mobile)
- Column headers may be abbreviated in the UI for space (use tooltips for full names if needed)
- This tab is informational only - no edit/delete actions
- Consider adding a timestamp showing when data was last refreshed
