# Story: Start Page - Batch Creation

**Epic:** Foundation & Start Page
**Story:** 2 of 5
**Wireframe:** `../../wireframes/screen-1-start-page.md`

## User Story

**As an** Operations Lead
**I want** to create a new monthly report batch
**So that** I can initiate the reporting cycle for the current period

## Acceptance Criteria

### Happy Path
- [ ] Given I am on the Start Page, when I click the "Create New Batch" button, then a modal dialog opens prompting for the report date
- [ ] Given the create batch modal is open, when I select a report date and click "Create", then the system creates a new report batch and displays a success message
- [ ] Given a new batch is created, when the page refreshes, then I see the newly created batch in the "Current Batch" section with status "Data Preparation"

### Validation
- [ ] Given the create batch modal is open, when I select a report date that already exists, then I see an error message "Report batch for this date already exists"
- [ ] Given the create batch modal is open, when I click "Cancel", then the modal closes without creating a batch

### API Integration
- [ ] Given I submit a new batch, when the API call succeeds, then the batch is created with the correct ReportDate
- [ ] Given the API call fails, when an error occurs, then I see an error message with details

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/monthly-report-batch` | Create new monthly report batch |
| POST | `/monthly-runs/{ReportDate}` | Start the monthly process for the given date |
| GET | `/report-batches` | Refresh batch list after creation |

## Implementation Notes
- Use Shadcn `<Dialog>` component for the create batch modal
- Use Shadcn `<DatePicker>` for report date selection
- Use Shadcn `<Alert>` for success/error messages
- **Note:** The home page (`web/src/app/page.tsx`) was created in the "Home Page Setup" story. This story enhances that existing page with batch creation functionality.
