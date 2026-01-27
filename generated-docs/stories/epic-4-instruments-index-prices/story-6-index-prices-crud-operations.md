# Story: Index Prices Maintenance - CRUD Operations

**Epic:** Instruments & Index Prices Maintenance
**Story:** 6 of 8
**Wireframe:** `../../wireframes/screen-9-index-prices-maintenance.md`

## User Story

**As an** Analyst
**I want** to create, update, and delete index prices
**So that** I can maintain accurate index pricing data for reports

## Acceptance Criteria

### Create Price
- [ ] Given I click "Add Price", when the modal opens, then I select IndexId from a dropdown and enter Price
- [ ] Given I save a new price, when the save completes, then the price appears in the grid

### Update Price
- [ ] Given I click "Edit" on a price row, when the modal opens, then I can modify the Price value
- [ ] Given I save changes, when the save completes, then the grid updates

### Delete Price
- [ ] Given I click "Delete" on a price, when I confirm deletion, then the price is removed

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/index-prices` | Create new index price |
| PUT | `/index-prices/{Id}` | Update index price |
| DELETE | `/index-prices/{Id}` | Delete index price |

## Implementation Notes
- Use Shadcn `<Dialog>` for CRUD forms
- Validate Price is a positive number
- Auto-populate ReportBatchId from current batch
