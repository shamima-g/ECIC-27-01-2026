# Story: Credit Ratings Maintenance - Main Grid

**Epic:** Risk Data Maintenance
**Story:** 5 of 8
**Wireframe:** `../../wireframes/screen-12-credit-ratings-maintenance.md`

## User Story
**As an** Analyst, **I want** to view all credit ratings in a searchable grid **So that** I can review and maintain rating data

## Acceptance Criteria
- [ ] Given I navigate to Credit Ratings, when the page loads, then I see a grid of all credit ratings
- [ ] Given the grid is displayed, when I view columns, then I see: Id, InstrumentCode, ISIN, Country, RatingAgencyId, NationalRating, InternationalRating, FinalRatingNational, FinalRatingInternational, EffectiveDate, LastChangedUser
- [ ] Given I search by InstrumentCode or ISIN, when I type, then the grid filters
- [ ] Given I filter by Country or RatingAgencyId, when I apply filters, then only matching ratings display

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/credit-ratings` | Get all credit ratings |
