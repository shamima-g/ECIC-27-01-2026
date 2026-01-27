# Story: Instruments Maintenance - Export ISINs

**Epic:** Instruments & Index Prices Maintenance
**Story:** 4 of 8
**Wireframe:** `../../wireframes/screen-8-instruments-maintenance.md`

## User Story

**As an** Analyst
**I want** to export incomplete instruments' ISINs to Excel
**So that** I can research and complete missing data offline

## Acceptance Criteria

- [ ] Given I click "Export Incomplete ISINs", when the export completes, then an Excel file is downloaded
- [ ] Given the Excel file is opened, when I view the contents, then I see columns: ISIN, InstrumentCode, Name, Status, MissingFields
- [ ] Given the export includes incomplete instruments, when I view the file, then only instruments with Status = "Incomplete" are included

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/isin/export` | Export incomplete ISINs to Excel |

## Implementation Notes
- Trigger file download from API response (binary stream)
- Show loading spinner during export
- Display success toast after download
