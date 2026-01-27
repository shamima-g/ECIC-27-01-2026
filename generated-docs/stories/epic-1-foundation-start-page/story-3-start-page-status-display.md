# Story: Start Page - Current Status Display

**Epic:** Foundation & Start Page
**Story:** 3 of 5
**Wireframe:** `../../wireframes/screen-1-start-page.md`

## User Story

**As an** Operations Lead or Analyst
**I want** to see the current batch status at a glance
**So that** I know which phase the reporting cycle is in and what actions are available

## Acceptance Criteria

### Status Display
- [ ] Given there is an active report batch, when I view the Start Page, then I see the batch's ReportDate prominently displayed
- [ ] Given an active batch exists, when I view the status section, then I see the current workflow state (e.g., "Data Preparation", "First Approval", "Second Approval", etc.)
- [ ] Given the batch is in "Data Preparation", when I view the page, then the status badge is displayed in blue
- [ ] Given the batch is in an approval stage, when I view the page, then the status badge is displayed in yellow
- [ ] Given the batch is "Complete", when I view the page, then the status badge is displayed in green

### Progress Indicator
- [ ] Given an active batch exists, when I view the page, then I see a visual progress indicator showing completed and remaining stages
- [ ] Given no active batch exists, when I view the Start Page, then I see a message "No active batch - create a new batch to begin"

### Real-time Updates
- [ ] Given the batch state changes (e.g., moves to approval), when I refresh the page, then the status display updates to reflect the new state

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/report-batches` | Get all report batches including current batch |
| GET | `/process-logs?ReportBatchId={id}` | Get workflow execution logs for the current batch |

## Implementation Notes
- Use Shadcn `<Card>` to display the current batch status
- Use Shadcn `<Badge>` with color variants for status indicators
- Use Shadcn `<Progress>` component for the workflow stage indicator
- Map WorkflowStatusName to user-friendly display names and colors
- **Note:** The home page (`web/src/app/page.tsx`) was created in the "Home Page Setup" story. This story enhances that existing page with status display functionality.
