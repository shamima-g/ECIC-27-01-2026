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
- [x] Given I navigate to Portfolio Imports, when the page loads, then I see a grid with portfolios as rows and file types as columns
- [x] Given the matrix is displayed, when I look at the columns, then I see Holdings, Transactions, Instrument Static, Income, Cash, Performance, and Management Fees
- [x] Given the matrix is displayed, when I look at the rows, then I see all portfolios configured in the system
- [x] Given a file has not been uploaded (StatusColor=⏱️), when I view its cell, then I see a gray "Not Uploaded" status icon
- [x] Given a file is being processed (StatusColor=⏳), when I view its cell, then I see a yellow "Processing" status icon with a spinner
- [x] Given a file has errors (StatusColor=⚠️), when I view its cell, then I see an orange "Error" status icon
- [x] Given a file requires action (StatusColor=‼️), when I view its cell, then I see a red "Action Required" status icon
- [x] Given a file is successfully uploaded (StatusColor=✅), when I view its cell, then I see a green "Complete" status icon

### Clickable Status Icons
- [x] Given I see a status icon, when I click it, then a modal opens showing file details (handled in Story 3)

### Responsive Layout
- [x] Given the matrix has many portfolios, when I scroll vertically, then the column headers remain fixed at the top
- [x] Given the matrix has many file types, when I scroll horizontally, then the portfolio names remain fixed on the left

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/portfolio-files?ReportMonth={month}&ReportYear={year}` | Get all portfolio files with status |
| GET | `/configurations` | Get system configuration including portfolios and file types |

## Status Icon Mapping

The API returns emoji-based `StatusColor` values:

| StatusColor | Display | Color | Icon | Meaning |
|-------------|---------|-------|------|---------|
| `✅` | Complete | Green | ✓ | File successfully uploaded |
| `⏱️` | Not Uploaded | Gray | — | No file uploaded yet |
| `⚠️` | Error | Orange | ⚠ | Error in file |
| `⏳` | Processing | Yellow | Spinner | File busy uploading |
| `‼️` | Action Required | Red | ! | Missing mappings, requires action |

## Implementation Notes
- Use Shadcn `<Table>` component for the matrix grid
- Use emoji-based status values from API (`StatusColor` field)
- Status icons use `getStatusConfig()` from `types/file-import.ts` for colors and icons
- Implement sticky headers for scrollable tables
- Store current ReportMonth and ReportYear from the active report batch
- Display portfolio names from the Portfolios array and file types from FileTypes configuration
