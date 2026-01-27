# Story: User Management

**Epic:** Process Logs & Administration
**Story:** 4 of 7
**Wireframe:** `../../wireframes/screen-20-admin-user-management.md`

## User Story
**As an** Administrator, **I want** to create, update, and deactivate users **So that** I can control who has access to the system

## Acceptance Criteria
- [ ] Given I navigate to User Management, when the page loads, then I see a grid of all users
- [ ] Given the grid is displayed, when I view columns, then I see: UserId, Username, Email, Roles, Status, LastLogin
- [ ] Given I click "Add User", when the modal opens, then I enter Username, Email, Password, and assign Roles
- [ ] Given I save a new user, when the save completes, then the user appears in the grid
- [ ] Given I click "Edit" on a user, when the modal opens, then I can modify Email and Roles
- [ ] Given I click "Deactivate", when I confirm, then the user's Status changes to "Inactive" and they cannot log in

## API Endpoints
Note: User management endpoints are not included in the provided API specs. These will need to be defined or may be handled by an external auth system.

## Implementation Notes
- Use Shadcn `<Dialog>` for add/edit modals
- Implement password strength validation for new users
- Display roles as badges in the grid
