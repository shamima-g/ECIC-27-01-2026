# Story: Credit Ratings - Changes View

**Epic:** Risk Data Maintenance
**Story:** 7 of 8

## User Story
**As an** Analyst or Portfolio Manager, **I want** to see which credit ratings have changed **So that** I can review rating upgrades/downgrades impacting portfolios

## Acceptance Criteria
- [ ] Given I click "View Rating Changes" tab, when the page loads, then I see a grid of rating changes
- [ ] Given the changes grid is displayed, when I view columns, then I see: ReportDate, InstrumentCode, ISIN, Country, FinalRatingNational, PreviousFinalRatingNational, FinalRatingInternational, PreviousFinalRatingInternational
- [ ] Given a rating was upgraded, when I view the row, then it is highlighted in green
- [ ] Given a rating was downgraded, when I view the row, then it is highlighted in red
- [ ] Given I filter by country, when I apply the filter, then only ratings for that country display

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/credit-rating-changes` | Get credit rating changes |
