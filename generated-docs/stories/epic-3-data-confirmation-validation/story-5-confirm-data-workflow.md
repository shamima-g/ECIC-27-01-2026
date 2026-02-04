# Story: Confirm Data Workflow

**Epic:** Data Confirmation & Validation
**Story:** 5 of 5
**Wireframe:** All three wireframes (screen-5, screen-6, screen-7) show the "Confirm Data" button

## User Story

**As a** data operations user
**I want** to confirm data and submit for approval
**So that** the workflow can advance to the first approval level after I have reviewed data completeness

## Acceptance Criteria

### Happy Path
- [ ] Given I am on any Data Confirmation tab (File Checks, Main Data Checks, or Other Checks), when I look at the bottom of the page, then I see a "Confirm Data" button
- [ ] Given I am on any Data Confirmation tab, when the page loads, then the "Confirm Data" button is enabled (always enabled - business rule)
- [ ] Given I am on any Data Confirmation tab, when I click the "Confirm Data" button, then I see a confirmation dialog asking "Are you sure you want to confirm data and proceed to approval?"
- [ ] Given I see the confirmation dialog, when I click "Cancel", then the dialog closes and no action is taken
- [ ] Given I see the confirmation dialog, when I click "Confirm", then a POST request is sent to `/approve-logs/{ReportBatchId}` with Type="Data Preparation" and Status="Approved"

### Success Flow
- [ ] Given I confirm the data submission, when the API call succeeds, then I see a success message "Data confirmed successfully. Workflow advanced to Level 1 approval."
- [ ] Given I confirm the data submission, when the API call succeeds, then I am redirected to the home/start page or batch status page
- [ ] Given I confirm the data submission, when the API call succeeds, then the current batch status updates to show "First Approval" phase

### Loading and Feedback
- [ ] Given I click "Confirm" in the dialog, when the API call is in progress, then the "Confirm" button in the dialog shows a loading spinner and is disabled
- [ ] Given I click "Confirm" in the dialog, when the API call is in progress, then I cannot close the dialog

### Error Handling
- [ ] Given I confirm the data submission, when the API returns a 500 error, then I see an error message "Failed to confirm data. Please try again or contact support."
- [ ] Given I see an error message, when I click "Try Again", then the API call is retried
- [ ] Given I see an error message, when I click "Cancel", then the dialog closes and no workflow state change occurs

### Edge Cases
- [ ] Given I am on the Data Confirmation page, when I click "Confirm Data" multiple times rapidly, then only one API request is sent (prevent double submission)
- [ ] Given I have already confirmed data, when I navigate back to the Data Confirmation page, then I see a message "Data has already been confirmed for this batch. Workflow is in approval phase." and the "Confirm Data" button is disabled

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/approve-logs/{ReportBatchId}` | Submit approval/rejection for a report batch |

**Required Parameters:**
- `ReportBatchId` (path parameter): Integer - The active report batch ID

**Request Body:**
```typescript
{
  Type: "Data Preparation";    // Fixed value for this story
  Status: "Approved";          // Fixed value for this story (always "Approved" - user confirms data)
  Username: string;            // Current logged-in user
  Date: string;                // Current date (YYYY-MM-DD format)
  Time: string;                // Current time (HH:mm:ss format)
  RejectReason: string | null; // Always null for "Data Preparation" confirmation
}
```

**Response Structure (201 Created):**
```typescript
{
  message: string; // e.g., "Report batch approval status updated successfully."
}
```

**Note:** The API endpoint is the same for all approval types (Data Preparation, Level 1, Level 2, Level 3). The `Type` field differentiates them. For this story, we always use Type="Data Preparation" and Status="Approved".

## Related Artifacts

- **Wireframes:**
  - [screen-5-data-confirmation-file-checks.md](../../wireframes/screen-5-data-confirmation-file-checks.md)
  - [screen-6-data-confirmation-main-checks.md](../../wireframes/screen-6-data-confirmation-main-checks.md)
  - [screen-7-data-confirmation-other-checks.md](../../wireframes/screen-7-data-confirmation-other-checks.md)
- **Depends on:**
  - Story 1 (Data Confirmation Page Setup) - for page structure
  - Story 2 (File Checks Tab) - for one of the data quality views
  - Story 3 (Main Data Checks Tab) - for one of the data quality views
  - Story 4 (Other Checks Tab) - for one of the data quality views
  - Epic 1, Story 2 (Batch Management) - for active ReportBatchId context
- **Impacts:**
  - Epic 7 stories - advances workflow to Level 1 approval phase
  - Epic 1, Story 2 (Batch Management) - batch status should update to "First Approval"

## Implementation Notes

- Use Shadcn UI `<AlertDialog>` component for confirmation dialog
- Use Shadcn UI `<Button>` with loading state for submit action
- Retrieve active ReportBatchId from context or state management (established in Epic 1, Story 2)
- Retrieve current username from authentication context
- Generate current date and time in the required formats (YYYY-MM-DD, HH:mm:ss)
- Use the API client from `web/src/lib/api/client.ts` for the POST request
- Implement debouncing or disable button after first click to prevent double submission
- Display success/error messages using Shadcn UI `<Toast>` or `<Alert>` component
- After successful confirmation, use Next.js router to navigate to home/start page
- Consider updating global state to reflect new workflow phase
- The "Confirm Data" button should be styled as a primary action button (e.g., blue, prominent)
- Position the button consistently across all tabs (e.g., sticky footer or fixed at bottom right)
- Ensure the button is accessible (keyboard navigation, screen reader support)
- **Business Rule:** The button is ALWAYS enabled. The system does not enforce data completeness - users decide if data is acceptable even with incomplete checks.
