# Story: Index Prices Maintenance - Main Grid

**Epic:** Instruments & Index Prices Maintenance
**Story:** 5 of 8
**Wireframe:** `../../wireframes/screen-9-index-prices-maintenance.md`

## User Story

**As an** Analyst
**I want** to view all index prices for the current report batch
**So that** I can review and maintain index pricing data

## Acceptance Criteria

- [ ] Given I navigate to Index Prices Maintenance, when the page loads, then I see a grid of index prices for the current ReportBatchId
- [ ] Given the grid is displayed, when I view the columns, then I see: Id, ReportDate, IndexCode, IndexBloombergTicker, Price, Status
- [ ] Given an index price is missing, when I view the grid, then I see a row with Status = "Missing" in red
- [ ] Given I can search by IndexCode or Bloomberg Ticker, when I type in the search box, then the grid filters accordingly

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/index-prices` | Get all index prices |

## Implementation Notes
- Use Shadcn `<Table>` for the grid
- Filter by current ReportBatchId on page load
- Highlight missing prices prominently
