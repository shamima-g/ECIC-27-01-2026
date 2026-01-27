# Story: Portfolios Maintenance

**Epic:** Reference Data Management
**Story:** 3 of 6

## User Story
**As an** Administrator or Operations Lead, **I want** to manage portfolio definitions **So that** the system knows which portfolios to process in reports

## Acceptance Criteria
- [ ] Given I navigate to Portfolios, when the page loads, then I see a grid of all portfolios
- [ ] Given the grid is displayed, when I view columns, then I see: Id, PortfolioCode, PortfolioName, AssetManagerId, BenchmarkId, Status, LastChangedUser
- [ ] Given I click "Add Portfolio", when the modal opens, then I enter PortfolioCode, PortfolioName, AssetManagerId, and BenchmarkId
- [ ] Given I save/edit/delete, when actions complete, then changes are reflected in the grid

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/portfolios` | Get all portfolios |
| POST | `/portfolios` | Create portfolio |
| PUT | `/portfolios/{Id}` | Update portfolio |
| DELETE | `/portfolios/{Id}` | Delete portfolio |
