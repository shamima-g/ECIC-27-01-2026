# Story: Calculation Logs

**Epic:** Process Logs & Administration
**Story:** 3 of 7
**Wireframe:** `../../wireframes/screen-19-process-logs-calculation.md`

## User Story
**As an** Operations Lead or Administrator, **I want** to view calculation execution logs and errors **So that** I can troubleshoot calculation failures

## Acceptance Criteria
- [ ] Given I navigate to Calculation Logs, when the page loads, then I see a grid of all calculation logs
- [ ] Given the grid is displayed, when I view columns, then I see: CalculationLogId, CalculationName, CalculationStatus, StartTime, EndTime, ViewErrors
- [ ] Given a calculation failed, when I click "View Errors", then a modal opens showing detailed error messages
- [ ] Given the error modal is displayed, when I view error details, then I see: CalculationLogErrorId, CalculationName, ErrorPrefix, FullError, StartTime, EndTime
- [ ] Given there are error count summaries, when I view the page header, then I see "X errors found" badge in red

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/calculation-log` | Get calculation logs |
| GET | `/calculation-log-error/{CalculationLogId}` | Get errors for a specific calculation |
| GET | `/calculation-log-error-count` | Get error count for current batch |
