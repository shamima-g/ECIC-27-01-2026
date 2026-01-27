# Story: Other Imports Dashboard - List View

**Epic:** File Import Management
**Story:** 2 of 6
**Wireframe:** `../../wireframes/screen-3-other-imports.md`

## User Story

**As an** Operations Lead
**I want** to see non-portfolio files in a list format
**So that** I can quickly check the status of shared reference data files

## Acceptance Criteria

### List Display
- [ ] Given I navigate to Other Imports, when the page loads, then I see a list of file types: Monthly Index Files, Bloomberg Credit Ratings, Bloomberg Holdings, and Custodian Files
- [ ] Given each file type is displayed, when I view a row, then I see the file type name and a status icon
- [ ] Given a file has not been uploaded, when I view its row, then I see a gray "Missing" status icon
- [ ] Given a file is being processed, when I view its row, then I see a yellow "Busy" status icon with a spinner
- [ ] Given a file validation failed, when I view its row, then I see a red "Failed" status icon
- [ ] Given a file is successfully uploaded, when I view its row, then I see a green "Complete" status icon

### Clickable Status Icons
- [ ] Given I see a status icon, when I click it, then a modal opens showing file details (handled in Story 3)

### Real-time Status Updates
- [ ] Given a file is being processed, when the validation completes, then the status icon updates automatically without page refresh

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/other-files?ReportMonth={month}&ReportYear={year}` | Get all other files with status |

## Implementation Notes
- Use Shadcn `<Card>` components for each file type row
- Use color-coded badges/icons for status indicators
- Implement client-side polling (every 5 seconds) to refresh status for files in "Busy" state
- Group files by FileSource (e.g., Bloomberg files together, Custodian files together)
