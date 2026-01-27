# Story: Monthly Process Logs

**Epic:** Process Logs & Administration
**Story:** 2 of 7
**Wireframe:** `../../wireframes/screen-18-process-logs-monthly.md`

## User Story
**As an** Operations Lead or Administrator, **I want** to view monthly workflow execution logs **So that** I can understand workflow progress and troubleshoot issues

## Acceptance Criteria
- [ ] Given I navigate to Monthly Process Logs, when the page loads, then I see a grid of workflow execution events
- [ ] Given the grid is displayed, when I view columns, then I see: ReportBatchId, ReportDate, EventName, ExecutedAt, LastExecutedActivityName
- [ ] Given I filter by EventName, when I apply the filter, then only matching events display
- [ ] Given I select a batch from the dropdown, when it changes, then logs for that batch display

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/process-logs?ReportBatchId={id}` | Get monthly process logs |
