# Story: File Process Logs

**Epic:** Process Logs & Administration
**Story:** 1 of 7
**Wireframe:** `../../wireframes/screen-17-process-logs-file.md`

## User Story
**As an** Operations Lead or Administrator, **I want** to view file processing logs **So that** I can troubleshoot file import issues and track file journey

## Acceptance Criteria
- [ ] Given I navigate to File Process Logs, when the page loads, then I see a grid of all file process logs for the current batch
- [ ] Given the grid is displayed, when I view columns, then I see: FileLogId, ReportDate, FileName, FilePath, RecordCount, WorkflowDefinitionName, WorkflowStatusName, CreatedAt, FinishedAt, LastExecutedActivityName
- [ ] Given I filter by FileName or WorkflowStatusName, when I apply filters, then only matching logs display
- [ ] Given a file failed, when I click on its row, then I see detailed error information
- [ ] Given I want to view logs for a different batch, when I select a batch from the dropdown, then logs for that batch display

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/process-logs?ReportBatchId={id}` | Get file process logs |
