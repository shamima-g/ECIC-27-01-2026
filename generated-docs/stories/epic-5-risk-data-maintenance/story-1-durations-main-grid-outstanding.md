# Story: Durations & YTM Maintenance - Main Grid & Outstanding

**Epic:** Risk Data Maintenance
**Story:** 1 of 8
**Wireframe:** `../../wireframes/screen-10-durations-maintenance.md`

## User Story

**As an** Analyst
**I want** to view all duration entries and see instruments missing duration data
**So that** I can maintain complete duration/YTM information for the current batch

## Acceptance Criteria

### Main Grid
- [ ] Given I navigate to Durations & YTM, when the page loads, then I see a grid of all duration entries for the current batch
- [ ] Given the grid is displayed, when I view columns, then I see: Id, InstrumentCode, ISIN, Duration, YTM, Status, LastChangedUser
- [ ] Given I can search by InstrumentCode or ISIN, when I type in the search box, then the grid filters

### Outstanding Durations Tab
- [ ] Given I click the "Outstanding" tab, when it loads, then I see instruments missing duration data for the current batch
- [ ] Given the outstanding list is displayed, when I view columns, then I see: InstrumentId, InstrumentCode, ISIN, InstrumentName
- [ ] Given I click an outstanding instrument, when the action registers, then the add duration modal opens pre-filled with that instrument

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/instrument-duration` | Get all durations for current batch |
| GET | `/instrument-duration-outstanding` | Get instruments missing duration |

## Implementation Notes
- Use Shadcn `<Tabs>` for Current/Outstanding views
- Make outstanding rows clickable to trigger quick add
