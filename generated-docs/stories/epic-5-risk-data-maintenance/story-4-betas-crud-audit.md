# Story: Betas Maintenance - CRUD & Audit

**Epic:** Risk Data Maintenance
**Story:** 4 of 8

## User Story
**As an** Analyst, **I want** to create, update, delete beta entries and view audit trails **So that** I can maintain accurate beta data with full traceability

## Acceptance Criteria
- [ ] Given I click "Add Beta", when the modal opens, then I select an instrument and enter a Beta value
- [ ] Given I save a new beta entry, when save completes, then it appears in the main grid
- [ ] Given I click "Edit" on a beta row, when the modal opens, then I can modify the Beta value
- [ ] Given I click "Delete", when I confirm, then the beta entry is removed
- [ ] Given I click "View Audit Trail", when the modal opens, then I see all historical changes for that instrument's beta

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/instrument-beta` | Create beta |
| PUT | `/instrument-beta/{Id}` | Update beta |
| DELETE | `/instrument-beta/{Id}` | Delete beta |
| GET | `/instrument-beta-audit-trail/{Id}` | Get audit trail |
| GET | `/instrument-beta-full-audit-trail` | Get full audit trail |
