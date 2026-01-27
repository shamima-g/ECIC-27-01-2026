# Story: Data Confirmation - Portfolio Re-imports Tab

**Epic:** Data Confirmation & Validation
**Story:** 3 of 5
**Wireframe:** `../../wireframes/screen-7-data-confirmation-reimports.md`

## User Story

**As an** Operations Lead
**I want** to see which portfolios are currently being re-imported
**So that** I can track the progress of re-import operations

## Acceptance Criteria

### Tab Display
- [ ] Given I am on Data Confirmation, when I click the "Portfolio Re-imports" tab, then the tab becomes active and displays re-import status

### Re-import Status Display
- [ ] Given the Portfolio Re-imports tab is active, when no re-imports are in progress, then I see a message "No active re-imports"
- [ ] Given a portfolio re-import is in progress, when I view the tab, then I see the PortfolioCode, re-import start time, and current status
- [ ] Given a re-import is running, when I view its status, then I see a progress indicator showing which files are being processed
- [ ] Given a re-import completes successfully, when I view the tab, then I see "Re-import complete" with a green badge
- [ ] Given a re-import fails, when I view the tab, then I see "Re-import failed" with a red badge and an error message

### Re-import History
- [ ] Given re-imports have completed, when I view the tab, then I see a history section showing recent re-imports with timestamps and outcomes
- [ ] Given I view re-import history, when I click on a completed re-import, then I see details including which files were processed and any errors encountered

### Refresh Button
- [ ] Given re-imports are in progress, when I click the "Refresh" button, then the status is updated with the latest information

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/portfolio-files?ReportMonth={month}&ReportYear={year}` | Get portfolio file status to determine re-import progress |

Note: Re-import status may need to be inferred from file workflow statuses or process logs if no dedicated endpoint exists.

## Implementation Notes
- Use Shadcn `<Card>` to display each re-import in progress
- Use Shadcn `<Progress>` component to show re-import progress
- Use Shadcn `<Badge>` for status indicators
- Implement auto-refresh (every 5 seconds) when re-imports are in progress
- Display a timestamp showing when the page was last refreshed
