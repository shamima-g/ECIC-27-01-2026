# Story: Credit Ratings - Decision Flow Retry

**Epic:** Risk Data Maintenance
**Story:** 8 of 8

## User Story
**As an** Analyst, **I want** to re-run the credit rating decision flow **So that** I can recalculate final ratings after making manual corrections

## Acceptance Criteria
- [ ] Given I am on Credit Ratings Maintenance, when I click "Retry Decision Flow", then a confirmation dialog appears
- [ ] Given I confirm the retry, when the flow runs, then the system recalculates FinalRatingNational and FinalRatingInternational for all instruments
- [ ] Given the decision flow completes, when I view the grid, then I see updated final rating values
- [ ] Given the flow fails, when I view the error message, then I see details about what went wrong

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/credit-ratings-decision-flow/{ReportBatchId}` | Retry credit rating decision flow |
