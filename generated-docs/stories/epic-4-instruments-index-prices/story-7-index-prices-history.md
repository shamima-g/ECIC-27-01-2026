# Story: Index Prices Maintenance - Price History

**Epic:** Instruments & Index Prices Maintenance
**Story:** 7 of 8
**Wireframe:** `../../wireframes/screen-9-index-prices-maintenance.md`

## User Story

**As an** Analyst
**I want** to view historical prices for a specific index
**So that** I can see price trends over time

## Acceptance Criteria

- [ ] Given I click "View History" on an index price row, when the modal opens, then I see all historical prices for that index across report batches
- [ ] Given the history modal is displayed, when I view each record, then I see ReportDate, Price, and LastChangedUser
- [ ] Given there are many historical records, when I view the modal, then I see a line chart visualizing price trends over time

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/index-prices-history/{Id}` | Get price history for an index |

## Implementation Notes
- Use Shadcn `<Dialog>` for history modal
- Use a charting library (Recharts) for trend visualization
- Sort by ReportDate descending
