# Story: Credit Ratings Maintenance - CRUD & Audit

**Epic:** Risk Data Maintenance
**Story:** 6 of 8

## User Story
**As an** Analyst, **I want** to create, update, delete credit ratings and view audit trails **So that** I can maintain accurate rating data with full traceability

## Acceptance Criteria
- [ ] Given I click "Add Rating", when the modal opens, then I select instrument, rating agency, and enter rating values
- [ ] Given I save a new rating, when save completes, then it appears in the main grid
- [ ] Given I click "Edit", when the modal opens, then I can modify rating fields
- [ ] Given I click "Delete", when I confirm, then the rating is removed
- [ ] Given I click "View Audit Trail", when the modal opens, then I see all historical rating changes
- [ ] Given I click "View History", when the page loads, then I see rating history for that instrument across all batches

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/credit-ratings` | Create rating |
| PUT | `/credit-ratings/{Id}` | Update rating |
| DELETE | `/credit-ratings/{Id}` | Delete rating |
| GET | `/credit-rating-audit-trail/{Id}` | Get audit trail |
| GET | `/credit-ratings-history/{InstrumentId}` | Get rating history |
