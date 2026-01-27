# Story: Countries Maintenance

**Epic:** Reference Data Management
**Story:** 1 of 6
**Wireframe:** `../../wireframes/screen-23-reference-countries.md`

## User Story
**As an** Administrator or Analyst, **I want** to manage country reference data **So that** instrument and portfolio data has accurate country associations

## Acceptance Criteria
### Main Grid
- [ ] Given I navigate to Countries, when the page loads, then I see a grid of all countries
- [ ] Given the grid is displayed, when I view columns, then I see: Id, CountryCode, CountryName, RegionId, Status, LastChangedUser, LastChangedDate
- [ ] Given I search by CountryName or CountryCode, when I type, then the grid filters

### CRUD Operations
- [ ] Given I click "Add Country", when the modal opens, then I enter CountryCode, CountryName, and RegionId
- [ ] Given I save a new country, when save completes, then it appears in the grid
- [ ] Given I click "Edit", when the modal opens, then I can modify country fields
- [ ] Given I click "Delete", when I confirm, then the country is soft-deleted

### Audit Trail
- [ ] Given I click "View Audit Trail", when the modal opens, then I see all historical changes for that country

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/countries` | Get all countries |
| POST | `/countries` | Create country |
| GET | `/countries/{Id}` | Get country by ID |
| PUT | `/countries/{Id}` | Update country |
| DELETE | `/countries/{Id}` | Delete country |
