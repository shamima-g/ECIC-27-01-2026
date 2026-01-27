# Story: Data Confirmation - Navigation to Fix Screens

**Epic:** Data Confirmation & Validation
**Story:** 4 of 5
**Wireframe:** `../../wireframes/screen-6-data-confirmation-other.md`

## User Story

**As an** Analyst
**I want** to click on incomplete data items and navigate directly to the fix screen
**So that** I can resolve issues quickly without manually navigating through menus

## Acceptance Criteria

### Click-Through from Other Checks Tab
- [ ] Given I see "12 incomplete" for Index Prices on Other Checks, when I click the count, then I navigate to the Index Prices Maintenance screen
- [ ] Given I see "5 incomplete" for Instruments on Other Checks, when I click the count, then I navigate to the Instruments Maintenance screen with a filter applied showing only incomplete instruments
- [ ] Given I see "8 incomplete" for Credit Ratings on Other Checks, when I click the count, then I navigate to the Credit Ratings Maintenance screen
- [ ] Given I see "15 incomplete" for Durations on Other Checks, when I click the count, then I navigate to the Durations & YTM Maintenance screen
- [ ] Given I see "10 incomplete" for Betas on Other Checks, when I click the count, then I navigate to the Betas Maintenance screen

### Click-Through from Main File Checks Tab
- [ ] Given I see a red X for a portfolio's HoldingDataComplete, when I click the X, then I navigate to the Portfolio Imports Dashboard with that portfolio highlighted
- [ ] Given I see a red X for CustodianCashDataComplete, when I click the X, then I navigate to the Other Imports Dashboard with Custodian Files highlighted

### Contextual Filtering
- [ ] Given I navigate to a maintenance screen from Data Confirmation, when the page loads, then the grid is automatically filtered to show only incomplete items
- [ ] Given I am on a filtered maintenance screen, when I look at the toolbar, then I see a badge indicating "Filtered view from Data Confirmation"
- [ ] Given I am on a filtered view, when I click "Clear Filter", then all items are displayed

### Breadcrumb Navigation
- [ ] Given I navigate to a maintenance screen from Data Confirmation, when I view the page, then I see a breadcrumb trail: "Data Confirmation > [Screen Name]"
- [ ] Given I click "Data Confirmation" in the breadcrumb, when the click registers, then I navigate back to the Data Confirmation screen

## API Endpoints (from OpenAPI spec)

No specific API calls for navigation - this is client-side routing with query parameters.

## Implementation Notes
- Use Next.js `useRouter` for navigation with query parameters (e.g., `/instruments?filter=incomplete&from=data-confirmation`)
- Implement breadcrumb navigation using Shadcn `<Breadcrumb>` component
- Pass filter context via URL query parameters
- Maintenance screens should read query parameters and apply filters accordingly
- Use visual indicators (e.g., highlighting) to show user where they navigated from
