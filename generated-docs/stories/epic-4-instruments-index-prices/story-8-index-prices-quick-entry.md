# Story: Index Prices Maintenance - Quick Pop-up Entry

**Epic:** Instruments & Index Prices Maintenance
**Story:** 8 of 8
**Wireframe:** `../../wireframes/screen-9-index-prices-maintenance.md`

## User Story

**As an** Analyst
**I want** a quick entry popup for missing index prices
**So that** I can rapidly fill in gaps without opening individual modals

## Acceptance Criteria

- [ ] Given I click "Quick Entry" button, when the popup opens, then I see a list of all missing indexes for the current batch
- [ ] Given the quick entry form is displayed, when I enter prices for multiple indexes, then I can save all at once
- [ ] Given I save quick entry data, when the save completes, then all entered prices are created and the popup closes

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/index-prices` | Create new index price (called multiple times) |

## Implementation Notes
- Use Shadcn `<Sheet>` or `<Dialog>` for quick entry interface
- Display only indexes with missing prices for current batch
- Allow tabbing between price inputs for efficiency
- Implement bulk save (multiple API calls in parallel)
