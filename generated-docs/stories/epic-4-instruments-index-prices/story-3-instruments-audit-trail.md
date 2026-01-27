# Story: Instruments Maintenance - Audit Trail

**Epic:** Instruments & Index Prices Maintenance
**Story:** 3 of 8
**Wireframe:** `../../wireframes/screen-8-instruments-maintenance.md`

## User Story

**As an** Analyst or Auditor
**I want** to view the complete audit history for an instrument
**So that** I can see who made changes and when

## Acceptance Criteria

- [ ] Given I click "View History" on an instrument, when the audit trail modal opens, then I see all historical changes for that instrument
- [ ] Given the audit trail is displayed, when I view each record, then I see ValidFrom, ValidTo, field changes (old → new values), and LastChangedUser
- [ ] Given there are many audit records, when I view the modal, then records are paginated
- [ ] Given I click "View Full Audit Trail", when the page loads, then I see audit history for ALL instruments in a searchable grid

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/instruments-audit-trail/{InstrumentId}` | Get instrument audit trail |
| GET | `/instruments-full-audit-trail` | Get full instruments audit trail |

## Implementation Notes
- Use Shadcn `<Dialog>` for single instrument audit trail
- Highlight changed fields in audit records
- Format dates for readability
