# Story: Instruments Maintenance - CRUD Operations

**Epic:** Instruments & Index Prices Maintenance
**Story:** 2 of 8
**Wireframe:** `../../wireframes/screen-8-instruments-maintenance.md`

## User Story

**As an** Analyst
**I want** to create, update, and delete instrument records
**So that** I can maintain accurate instrument master data

## Acceptance Criteria

### Create Instrument
- [ ] Given I click "Add Instrument", when the modal opens, then I see a form with all instrument fields
- [ ] Given I fill in required fields (ISIN, InstrumentCode, Name) and click "Save", then the instrument is created and appears in the grid
- [ ] Given I try to create an instrument with an existing ISIN, when I click "Save", then I see an error "Instrument with this ISIN already exists"

### Update Instrument
- [ ] Given I click "Edit" on an instrument row, when the modal opens, then the form is pre-filled with current values
- [ ] Given I modify fields and click "Save", when the save completes, then the grid updates with new values
- [ ] Given I change critical fields (e.g., CountryId, CurrencyId), when I save, then the changes are recorded in the audit trail

### Delete Instrument
- [ ] Given I click "Delete" on an instrument, when the confirmation dialog appears, then I must confirm before deletion
- [ ] Given I confirm deletion, when the delete completes, then the instrument is removed from the grid (soft delete)

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/instruments` | Create new instrument |
| GET | `/instruments/{Id}` | Get instrument by ID |
| PUT | `/instruments/{Id}` | Update instrument |
| DELETE | `/instruments/{Id}` | Delete instrument |

## Implementation Notes
- Use Shadcn `<Dialog>` for add/edit modals
- Use Shadcn `<Form>` with validation (Zod schema)
- Implement proper error handling for API failures
- Record LastChangedUser from current session
