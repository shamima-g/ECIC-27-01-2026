# Story: Instruments Maintenance - Main Grid

**Epic:** Instruments & Index Prices Maintenance
**Story:** 1 of 8
**Wireframe:** `../../wireframes/screen-8-instruments-maintenance.md`

## User Story

**As an** Analyst
**I want** to view all instruments in a searchable, filterable grid
**So that** I can quickly find and review instrument master data

## Acceptance Criteria

### Grid Display
- [ ] Given I navigate to Instruments Maintenance, when the page loads, then I see a grid displaying all instruments
- [ ] Given the grid is displayed, when I view the columns, then I see: Id, InstrumentCode, ISIN, InstrumentName, InstrumentType, AssetClassTreeId, CurrencyId, CountryId, MaturityDate, Status, LastChangedUser, LastChangedDate
- [ ] Given there are many instruments, when I view the grid, then it is paginated with 50 rows per page
- [ ] Given I view an instrument row, when I look at the Status column, then instruments with incomplete data show "Incomplete" in red, complete instruments show "Complete" in green

### Search and Filter
- [ ] Given I am viewing the instruments grid, when I type in the search box, then instruments are filtered by InstrumentCode, ISIN, or InstrumentName
- [ ] Given I click the "Filter" button, when the filter panel opens, then I can filter by InstrumentType, Status, CountryId, and CurrencyId
- [ ] Given I apply filters, when I view the grid, then only matching instruments are displayed
- [ ] Given I have filters applied, when I click "Clear Filters", then all instruments are displayed again

### Row Actions
- [ ] Given I hover over an instrument row, when I view the actions column, then I see "Edit", "Delete", and "View History" buttons

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/instruments` | Get all instruments |

## Implementation Notes
- Use Shadcn `<Table>` with `<DataTable>` pattern for searchable, sortable grid
- Use Shadcn `<Input>` for search box
- Use Shadcn `<Popover>` for filter controls
- Use Shadcn `<Badge>` for Status column color coding
- Implement client-side search and filtering for performance
- Consider server-side pagination if instrument count exceeds 1000
