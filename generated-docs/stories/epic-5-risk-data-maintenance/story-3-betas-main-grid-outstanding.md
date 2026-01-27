# Story: Betas Maintenance - Main Grid & Outstanding

**Epic:** Risk Data Maintenance
**Story:** 3 of 8

## User Story
**As an** Analyst, **I want** to view all beta entries and see instruments missing beta data **So that** I can maintain complete beta information for the current batch

## Acceptance Criteria
- [ ] Given I navigate to Betas Maintenance, when the page loads, then I see a grid of all beta entries for the current batch
- [ ] Given the grid is displayed, when I view columns, then I see: Id, InstrumentCode, ISIN, Beta, Status, LastChangedUser
- [ ] Given I click the "Outstanding" tab, when it loads, then I see instruments missing beta data
- [ ] Given I click an outstanding instrument, when the action registers, then the add beta modal opens

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/instrument-beta` | Get all betas for current batch |
| GET | `/instrument-beta-outstanding` | Get instruments missing beta |
