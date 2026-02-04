# Story: File Checks Tab

**Epic:** Data Confirmation & Validation
**Story:** 2 of 5
**Wireframe:** [screen-5-data-confirmation-file-checks.md](../../wireframes/screen-5-data-confirmation-file-checks.md)

## User Story

**As a** data operations user
**I want** to view a summary of file upload completeness by file source
**So that** I can quickly identify which file categories have missing uploads before confirming data

## Acceptance Criteria

### Happy Path
- [ ] Given I am on the File Checks tab, when the page loads, then I see a table with columns: "File Source", "Expected File Count", "Actual File Count", and "Status"
- [ ] Given I am on the File Checks tab, when the data loads, then I see rows for "AssetManager", "Bloomberg", and "Custodian" file sources
- [ ] Given I am on the File Checks tab, when a file source has Actual File Count equal to Expected File Count, then I see a green checkmark (✓) in the Status column
- [ ] Given I am on the File Checks tab, when a file source has Actual File Count less than Expected File Count, then I see a red X (✗) in the Status column
- [ ] Given I am on the File Checks tab, when I view the table, then I see a legend explaining "✓ Complete" and "✗ Incomplete"

### Refresh Functionality
- [ ] Given I am on the File Checks tab, when I click the Refresh icon, then the file check data is fetched from the API
- [ ] Given I am on the File Checks tab, when I click the Refresh icon, then I see a loading indicator while data is being fetched
- [ ] Given I am on the File Checks tab, when the refresh completes, then the table updates with the latest data

### Edge Cases
- [ ] Given I am on the File Checks tab, when the API returns an empty array, then I see a message "No file check data available"
- [ ] Given I am on the File Checks tab, when the API call fails, then I see an error message "Failed to load file check data. Please try again."
- [ ] Given I am on the File Checks tab, when the API returns a file source with Expected File Count = 0, then I see "0" displayed (not an error)

### Error Handling
- [ ] Given I am on the File Checks tab, when the API returns a 500 error, then I see an error message "Unable to load file check data. Please contact support."
- [ ] Given I encounter an error, when I click the Refresh icon again, then the API call is retried

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/check-file-completeness` | Fetch file completeness check data for the current batch |

**Required Parameters:** None (uses current active batch context)

**Response Structure:**
```typescript
{
  FileChecks: Array<{
    FileSource: string;           // "AssetManager" | "Bloomberg" | "Custodian"
    ExpectedFileCount: number;    // Expected number of files
    ActualFileCount: number;      // Actual number of uploaded files
  }>
}
```

**Status Logic:**
- Complete (✓): `ActualFileCount === ExpectedFileCount`
- Incomplete (✗): `ActualFileCount < ExpectedFileCount`

## Related Artifacts

- **Wireframes:** [screen-5-data-confirmation-file-checks.md](../../wireframes/screen-5-data-confirmation-file-checks.md)
- **Depends on:** Story 1 (Data Confirmation Page Setup) - for tab structure
- **Impacts:**
  - Story 5 (Confirm Data Workflow) - uses this tab as one of the data quality views
  - Epic 2 stories - users may navigate to File Upload screens to resolve issues

## Implementation Notes

- Fetch data from `/check-file-completeness` on component mount and when Refresh icon is clicked
- Use Shadcn UI `<Table>` component for the file summary table
- Status indicators should be accessible: use `aria-label` (e.g., "Complete" or "Incomplete")
- Use green color for checkmark (e.g., `text-green-600`) and red for X (e.g., `text-red-600`)
- Show loading state with Shadcn UI `<Spinner>` or skeleton loader during API calls
- Display error messages using Shadcn UI `<Alert>` component
- Refresh icon should be a button with proper aria-label (e.g., "Refresh file check data")
- The table should be responsive (consider using responsive table patterns for mobile)
- This tab is informational only - no edit/delete actions
- Consider adding a timestamp showing when data was last refreshed
