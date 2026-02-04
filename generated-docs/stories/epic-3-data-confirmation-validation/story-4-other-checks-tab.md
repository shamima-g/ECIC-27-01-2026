# Story: Other Checks Tab

**Epic:** Data Confirmation & Validation
**Story:** 4 of 5
**Wireframe:** [screen-7-data-confirmation-other-checks.md](../../wireframes/screen-7-data-confirmation-other-checks.md)

## User Story

**As a** data operations user
**I want** to view reference data completeness counts for index prices, instruments, credit ratings, durations, and betas
**So that** I can identify how many reference data records are missing before confirming data

## Acceptance Criteria

### Happy Path
- [ ] Given I am on the Other Checks tab, when the page loads, then I see a table with columns: "Data Check Type", "Incomplete Count", and "Status"
- [ ] Given I am on the Other Checks tab, when the data loads, then I see rows for "Index Price Incomplete Count", "Instrument Incomplete Count", "Credit Rating Incomplete Count", "Instrument Duration Incomplete Count", and "Instrument Beta Incomplete Count"
- [ ] Given I am on the Other Checks tab, when a check type has an incomplete count of 0, then I see a green checkmark (✓) in the Status column
- [ ] Given I am on the Other Checks tab, when a check type has an incomplete count greater than 0, then I see a red X (✗) in the Status column
- [ ] Given I am on the Other Checks tab, when I view the table, then I see the incomplete count displayed as an integer for each check type

### Summary and Guidance
- [ ] Given I am on the Other Checks tab, when the data loads, then I see a summary message showing how many data check types have incomplete records (e.g., "3 data check types have incomplete records.")
- [ ] Given I am on the Other Checks tab, when I view the page, then I see guidance text directing me to appropriate maintenance screens to resolve incomplete data
- [ ] Given I am on the Other Checks tab, when I view the guidance text, then it lists the maintenance screens: Instruments Maintenance, Index Prices Maintenance, Credit Ratings Maintenance, Durations & YTM Maintenance, Instrument Betas Maintenance

### Refresh Functionality
- [ ] Given I am on the Other Checks tab, when I click the Refresh icon, then the other data check data is fetched from the API
- [ ] Given I am on the Other Checks tab, when I click the Refresh icon, then I see a loading indicator while data is being fetched
- [ ] Given I am on the Other Checks tab, when the refresh completes, then the table and summary update with the latest data

### UI/UX
- [ ] Given I am on the Other Checks tab, when I view the table, then I see a legend explaining "✓ Complete (0 incomplete)" and "✗ Incomplete (>0 incomplete)"

### Edge Cases
- [ ] Given I am on the Other Checks tab, when the API returns all counts as 0, then all rows show green checkmarks (✓) and the summary says "All data check types are complete."
- [ ] Given I am on the Other Checks tab, when the API call fails, then I see an error message "Failed to load other data checks. Please try again."

### Error Handling
- [ ] Given I am on the Other Checks tab, when the API returns a 500 error, then I see an error message "Unable to load other data checks. Please contact support."
- [ ] Given I encounter an error, when I click the Refresh icon again, then the API call is retried

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/check-other-data-completeness` | Fetch other data completeness check data for the current batch |

**Required Parameters:** None (uses current active batch context)

**Response Structure:**
```typescript
{
  IndexPriceIncompleteCounts: Array<{
    IndexPriceIncompleteCount: number;
  }>;
  InstrumentIncompleteCounts: Array<{
    InstrumentIncompleteCount: number;
  }>;
  CreditRatingIncompleteCounts: Array<{
    CreditRatingIncompleteCount: number;
  }>;
  InstrumentDurationIncompleteCounts: Array<{
    InstrumentDurationIncompleteCount: number;
  }>;
  InstrumentBetaIncompleteCounts: Array<{
    InstrumentBetaIncompleteCount: number;
  }>;
}
```

**Note:** API returns arrays with single objects. Extract the count from the first element of each array.

**Status Logic:**
- Complete (✓): Count = 0
- Incomplete (✗): Count > 0

**Summary Logic:**
- Count how many check types have count > 0
- Display summary: "{count} data check types have incomplete records." or "All data check types are complete."

## Related Artifacts

- **Wireframes:** [screen-7-data-confirmation-other-checks.md](../../wireframes/screen-7-data-confirmation-other-checks.md)
- **Depends on:** Story 1 (Data Confirmation Page Setup) - for tab structure
- **Impacts:**
  - Story 5 (Confirm Data Workflow) - uses this tab as one of the data quality views
  - Epic 4 stories - users may navigate to Instruments or Index Prices Maintenance screens
  - Epic 5 stories - users may navigate to Duration, Beta, or Credit Rating Maintenance screens

## Implementation Notes

- Fetch data from `/check-other-data-completeness` on component mount and when Refresh icon is clicked
- Use Shadcn UI `<Table>` component for the check summary table
- Status indicators should be accessible: use `aria-label` (e.g., "Complete" or "Incomplete")
- Use green color for checkmark (e.g., `text-green-600`) and red for X (e.g., `text-red-600`)
- Show loading state with Shadcn UI `<Spinner>` or skeleton loader during API calls
- Display error messages using Shadcn UI `<Alert>` component
- Guidance text can be styled as an informational callout using Shadcn UI `<Alert>` with variant="info"
- Summary text should dynamically calculate based on how many counts are > 0
- Refresh icon should be a button with proper aria-label (e.g., "Refresh other data checks")
- This tab is informational only - no edit/delete actions
- Consider adding a timestamp showing when data was last refreshed
- The API structure is unusual (arrays with single objects) - ensure extraction logic handles this correctly
