# Story: Page Access Control

**Epic:** Process Logs & Administration
**Story:** 6 of 7
**Wireframe:** `../../wireframes/screen-22-admin-page-access.md`

## User Story
**As an** Administrator, **I want** to control which roles can access which screens **So that** I can enforce role-based access control

## Acceptance Criteria
- [ ] Given I navigate to Page Access, when the page loads, then I see a matrix of Pages (rows) and Roles (columns)
- [ ] Given the matrix is displayed, when I view a cell, then I see a checkbox indicating whether that role has access to that page
- [ ] Given I check/uncheck a checkbox, when I save changes, then the access control is updated
- [ ] Given a role loses access to a page, when a user with that role tries to access it, then they see a "403 Forbidden" message
- [ ] Given I want to configure read-only vs full access, when I click a cell, then I can select "No Access", "Read-Only", or "Full Access"

## API Endpoints
Note: Page access control endpoints are not included in the provided API specs. These will need to be defined.

## Implementation Notes
- Define all pages in the system as rows (Start Page, File Uploads, Data Confirmation, Instruments, etc.)
- Use Shadcn `<Checkbox>` or `<RadioGroup>` for access level selection
- Implement access control checks in a reusable hook (e.g., `usePageAccess(pageName)`)
