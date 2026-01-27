# Story: Start Page - Batch History

**Epic:** Foundation & Start Page
**Story:** 5 of 5
**Wireframe:** `../../wireframes/screen-1-start-page.md`

## User Story

**As an** Operations Lead or Analyst
**I want** to view historical report batches
**So that** I can reference past reporting periods and their completion status

## Acceptance Criteria

### Batch History Table
- [ ] Given I am on the Start Page, when I scroll to the "Batch History" section, then I see a table listing previous report batches
- [ ] Given the batch history table is displayed, when I look at the columns, then I see ReportDate, WorkflowStatusName, CreatedAt, FinishedAt, and LastExecutedActivityName
- [ ] Given there are historical batches, when I view the table, then batches are sorted by ReportDate in descending order (newest first)
- [ ] Given a batch is complete, when I view its row, then the WorkflowStatusName is displayed with a green badge
- [ ] Given a batch is in progress, when I view its row, then the WorkflowStatusName is displayed with a yellow badge

### Batch History Details
- [ ] Given I click on a historical batch row, when the row expands, then I see additional details including approval logs and process execution times
- [ ] Given I view a completed batch, when I look at the details, then I see who approved at each level (L1, L2, L3) and when

### Pagination
- [ ] Given there are more than 10 historical batches, when I view the batch history, then I see pagination controls
- [ ] Given I am on page 1 of batch history, when I click "Next", then I see the next 10 batches

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/report-batches` | Get all report batches (includes historical) |
| GET | `/approve-logs/{ReportBatchId}` | Get approval logs for a specific batch |
| GET | `/process-logs?ReportBatchId={id}` | Get process logs for a specific batch |

## Implementation Notes
- Use Shadcn `<Table>` component for the batch history list
- Use Shadcn `<Badge>` for status indicators
- Use Shadcn `<Collapsible>` for expandable rows showing details
- Use Shadcn `<Pagination>` for table pagination
- Implement client-side filtering and sorting if needed
- **Note:** The home page (`web/src/app/page.tsx`) was created in the "Home Page Setup" story. This story enhances that existing page with batch history functionality.
