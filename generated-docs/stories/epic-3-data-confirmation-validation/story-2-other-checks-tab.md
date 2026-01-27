# Story: Data Confirmation - Other Checks Tab

**Epic:** Data Confirmation & Validation
**Story:** 2 of 5
**Wireframe:** `../../wireframes/screen-6-data-confirmation-other.md`

## User Story

**As an** Operations Lead or Analyst
**I want** to see the completeness status of reference data (instruments, prices, ratings, durations, betas)
**So that** I can identify missing reference data that needs to be maintained before approvals

## Acceptance Criteria

### Tab Display
- [ ] Given I am on Data Confirmation, when I click the "Other Checks" tab, then the tab becomes active and displays other data checks

### Incomplete Counts Display
- [ ] Given the Other Checks tab is active, when I view the page, then I see cards showing incomplete counts for: Index Prices, Instruments, Credit Ratings, Instrument Durations, Instrument Betas
- [ ] Given there are no incomplete index prices, when I view the Index Price card, then it shows "0 incomplete" with a green badge
- [ ] Given there are incomplete index prices, when I view the Index Price card, then it shows "X incomplete" with a red badge and the count is clickable
- [ ] Given there are no incomplete instruments, when I view the Instruments card, then it shows "0 incomplete" with a green badge
- [ ] Given there are incomplete instruments, when I view the Instruments card, then it shows "X incomplete" with a red badge
- [ ] Given there are incomplete credit ratings, when I view the Credit Ratings card, then it shows "X incomplete" with a red badge
- [ ] Given there are incomplete durations, when I view the Durations card, then it shows "X incomplete" with a red badge
- [ ] Given there are incomplete betas, when I view the Betas card, then it shows "X incomplete" with a red badge

### Click-Through Navigation
- [ ] Given I click an incomplete count (e.g., "12 incomplete instruments"), when the click registers, then I navigate to the appropriate maintenance screen (handled in Story 4)

### Overall Status Indicator
- [ ] Given all reference data is complete (all counts = 0), when I view the page, then I see a large green badge at the top saying "All reference data complete"
- [ ] Given any reference data is incomplete, when I view the page, then I see a yellow badge at the top saying "Reference data incomplete - resolve issues before approval"

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/check-other-data-completeness` | Get other data completeness checks |

## Implementation Notes
- Use Shadcn `<Card>` components for each check type (Index Prices, Instruments, etc.)
- Use Shadcn `<Badge>` with success/warning/destructive variants for counts
- Make incomplete counts clickable (styled as links or buttons)
- Display cards in a responsive grid layout (2-3 columns on desktop)
- Use large, easy-to-read typography for counts
