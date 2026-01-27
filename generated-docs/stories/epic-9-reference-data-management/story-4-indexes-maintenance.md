# Story: Indexes Maintenance

**Epic:** Reference Data Management
**Story:** 4 of 6

## User Story
**As an** Administrator or Analyst, **I want** to manage index master data **So that** index prices can be associated with correct indexes

## Acceptance Criteria
- [ ] Given I navigate to Indexes, when the page loads, then I see a grid of all indexes
- [ ] Given the grid is displayed, when I view columns, then I see: Id, IndexCode, IndexName, IndexBloombergTicker, CurrencyId, Status, LastChangedUser
- [ ] Given I click "Add Index", when the modal opens, then I enter IndexCode, IndexName, IndexBloombergTicker, and CurrencyId
- [ ] Given I save/edit/delete, when actions complete, then changes are reflected in the grid

## API Endpoints
Note: Index endpoints are not explicitly included in the provided API specs but would follow the standard CRUD pattern.

## Implementation Notes
- Indexes are referenced by IndexId in the index-prices endpoints
- May need to define index CRUD endpoints or retrieve from configuration
