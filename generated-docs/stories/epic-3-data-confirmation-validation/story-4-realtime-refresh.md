# Story: Data Confirmation - Real-time Refresh

**Epic:** Data Confirmation & Validation
**Story:** 4 of 4
**Wireframe:** `../../wireframes/screen-5-data-confirmation-main.md`

## User Story

**As an** Operations Lead or Analyst
**I want** data confirmation checks to update automatically as I fix issues
**So that** I can see progress in real-time without manually refreshing the page

## Acceptance Criteria

### Automatic Refresh
- [ ] Given I am on the Data Confirmation screen, when data is modified in maintenance screens, then the check statuses update automatically (within 10 seconds)
- [ ] Given I fix an incomplete instrument, when the change is saved, then the "Instruments incomplete" count decreases by 1 on the Other Checks tab
- [ ] Given I upload a missing file, when validation completes, then the corresponding completeness flag updates from red X to green checkmark on Main File Checks

### Manual Refresh Button
- [ ] Given I am on Data Confirmation, when I click the "Refresh" button in the toolbar, then all check statuses are re-fetched from the API immediately
- [ ] Given I click refresh, when the data is loading, then I see a loading spinner on the refresh button
- [ ] Given the refresh completes, when I view the page, then I see a timestamp showing "Last updated: [time]"

### Polling Strategy
- [ ] Given I am on the Data Confirmation screen, when the page is active, then the system polls the API every 10 seconds for updates
- [ ] Given I switch to another browser tab, when the page becomes inactive, then polling stops to save resources
- [ ] Given I return to the Data Confirmation tab, when the page becomes active again, then polling resumes immediately

### Change Notifications
- [ ] Given check statuses update while I'm viewing the page, when a status changes, then I see a subtle toast notification (e.g., "Instruments: 5 incomplete → 4 incomplete")
- [ ] Given all checks become complete, when the final update occurs, then I see a prominent success message "All checks complete - ready for approval!"

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/check-main-data-completeness` | Poll for main data updates |
| GET | `/check-other-data-completeness` | Poll for other data updates |

## Implementation Notes
- Implement polling using React hooks (e.g., `useEffect` with `setInterval`)
- Use browser Page Visibility API to detect when the tab is active/inactive
- Debounce rapid updates to avoid excessive re-renders
- Use Shadcn `<Toast>` component for change notifications
- Display a timestamp in the corner showing last refresh time
- Consider using WebSockets or Server-Sent Events for true real-time updates (future enhancement)
