# Story: Durations & YTM Maintenance - CRUD & Audit

**Epic:** Risk Data Maintenance
**Story:** 2 of 8

## User Story
**As an** Analyst, **I want** to create, update, delete duration entries and view audit trails **So that** I can maintain accurate duration data with full traceability

## Acceptance Criteria
- [ ] Given I click "Add Duration", when the modal opens, then I select an instrument and enter Duration and YTM values
- [ ] Given I save a new duration entry, when save completes, then it appears in the main grid
- [ ] Given I click "Edit" on a duration row, when the modal opens, then I can modify Duration and YTM
- [ ] Given I click "Delete", when I confirm, then the duration entry is removed
- [ ] Given I click "View Audit Trail", when the modal opens, then I see all historical changes for that instrument's duration

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/instrument-duration` | Create duration |
| PUT | `/instrument-duration/{Id}` | Update duration |
| DELETE | `/instrument-duration/{Id}` | Delete duration |
| GET | `/instrument-duration-audit-trail/{Id}` | Get audit trail |
| GET | `/instrument-duration-full-audit-trail` | Get full audit trail |
