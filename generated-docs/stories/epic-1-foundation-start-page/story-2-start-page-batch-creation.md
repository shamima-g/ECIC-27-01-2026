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
- [ ] Given I am on the Start Page, when I click the "Create New Batch" button, then the system directly calls the API to create a new report batch (no modal dialog)
- [ ] Given the API call succeeds, when the batch is created, then I see a success message displayed on the page
- [ ] Given a new batch is created, when the page refreshes, then I see the newly created batch in the "Current Batch" section with status "Data Preparation"

### Error Handling
- [ ] Given I click "Create New Batch", when a batch for the current period already exists, then I see an error message "Report batch for this date already exists"
- [ ] Given the API call fails, when an error occurs, then I see an error message with details

### API Integration
- [ ] Given I click "Create New Batch", when the API call is made, then it POSTs to `/monthly-report-batch` endpoint

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/monthly-report-batch` | Create new monthly report batch |
| GET | `/report-batches` | Refresh batch list after creation |

## Implementation Notes
- Button directly calls POST `/monthly-report-batch` without opening a modal dialog
- Use Shadcn `<Alert>` for success/error messages
- **Note:** The home page (`web/src/app/page.tsx`) was created in the "Home Page Setup" story. This story enhances that existing page with batch creation functionality.
