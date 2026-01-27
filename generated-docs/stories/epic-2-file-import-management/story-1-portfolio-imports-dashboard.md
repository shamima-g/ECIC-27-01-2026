# Story: Portfolio Imports Dashboard - Matrix View

**Epic:** File Import Management
**Story:** 1 of 6
**Wireframe:** `../../wireframes/screen-2-portfolio-imports.md`

## User Story

**As an** Operations Lead
**I want** to see all portfolio files in a matrix format
**So that** I can quickly identify which files are missing, complete, or failed for each portfolio

## Acceptance Criteria

### Matrix Display
- [ ] Given I navigate to Portfolio Imports, when the page loads, then I see a grid with portfolios as rows and file types as columns
- [ ] Given the matrix is displayed, when I look at the columns, then I see Holdings, Transactions, Instrument Static, Income, Cash, Performance, and Management Fees
- [ ] Given the matrix is displayed, when I look at the rows, then I see all portfolios configured in the system
- [ ] Given a file has not been uploaded, when I view its cell, then I see a gray "Missing" status icon
- [ ] Given a file is being processed, when I view its cell, then I see a yellow "Busy" status icon with a spinner
- [ ] Given a file validation failed, when I view its cell, then I see a red "Failed" status icon
- [ ] Given a file is successfully uploaded, when I view its cell, then I see a green "Complete" status icon

### Clickable Status Icons
- [ ] Given I see a status icon, when I click it, then a modal opens showing file details (handled in Story 3)

### Responsive Layout
- [ ] Given the matrix has many portfolios, when I scroll vertically, then the column headers remain fixed at the top
- [ ] Given the matrix has many file types, when I scroll horizontally, then the portfolio names remain fixed on the left

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/portfolio-files?ReportMonth={month}&ReportYear={year}` | Get all portfolio files with status |
| GET | `/configurations` | Get system configuration including portfolios and file types |

## Implementation Notes
- Use Shadcn `<Table>` component for the matrix grid
- Use color-coded badges/icons for status indicators (gray, yellow, red, green)
- Implement sticky headers for scrollable tables
- Store current ReportMonth and ReportYear from the active report batch
- Display portfolio names from the Portfolios array and file types from FileTypes configuration
