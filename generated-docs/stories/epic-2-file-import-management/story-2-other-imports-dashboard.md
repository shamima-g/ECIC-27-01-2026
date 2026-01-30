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
- [x] Given I navigate to Other Imports, when the page loads, then I see a list of file types: Monthly Index Files, Bloomberg Credit Ratings, Bloomberg Holdings, and Custodian Files
- [x] Given each file type is displayed, when I view a row, then I see the file type name and a status icon
- [x] Given a file has not been uploaded (StatusColor=⏱️), when I view its row, then I see a gray "Not Uploaded" status icon
- [x] Given a file is being processed (StatusColor=⏳), when I view its row, then I see a yellow "Processing" status icon with a spinner
- [x] Given a file has errors (StatusColor=⚠️), when I view its row, then I see an orange "Error" status icon
- [x] Given a file requires action (StatusColor=‼️), when I view its row, then I see a red "Action Required" status icon
- [x] Given a file is successfully uploaded (StatusColor=✅), when I view its row, then I see a green "Complete" status icon

### Clickable Status Icons
- [x] Given I see a status icon, when I click it, then a modal opens showing file details (handled in Story 3)

### Real-time Status Updates
- [x] Given a file is being processed (StatusColor=⏳), when the validation completes, then the status icon updates automatically without page refresh

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/other-files?ReportMonth={month}&ReportYear={year}` | Get all other files with status |

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
- Use Shadcn `<Card>` components for each file type row
- Use emoji-based status values from API (`StatusColor` field)
- Status icons use `getStatusConfig()` from `types/file-import.ts` for colors and icons
- Implement client-side polling (every 5 seconds) to refresh status for files in "Processing" state (⏳ or Yellow)
- Group files by FileSource (e.g., Bloomberg files together, Custodian files together)
