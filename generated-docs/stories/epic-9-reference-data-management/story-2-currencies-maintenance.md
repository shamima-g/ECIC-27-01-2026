# Story: Currencies Maintenance

**Epic:** Reference Data Management
**Story:** 2 of 6

## User Story
**As an** Administrator or Analyst, **I want** to manage currency reference data **So that** financial data has accurate currency associations

## Acceptance Criteria
- [ ] Given I navigate to Currencies, when the page loads, then I see a grid of all currencies
- [ ] Given the grid is displayed, when I view columns, then I see: Id, CurrencyCode, CurrencyName, Symbol, Status, LastChangedUser
- [ ] Given I click "Add Currency", when the modal opens, then I enter CurrencyCode, CurrencyName, and Symbol
- [ ] Given I save/edit/delete, when actions complete, then changes are reflected in the grid

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/currencies` | Get all currencies |
| POST | `/currencies` | Create currency |
| PUT | `/currencies/{Id}` | Update currency |
| DELETE | `/currencies/{Id}` | Delete currency |
