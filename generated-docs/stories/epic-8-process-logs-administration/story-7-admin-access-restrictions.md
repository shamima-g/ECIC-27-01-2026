# Story: Administration Access Restrictions

**Epic:** Process Logs & Administration
**Story:** 7 of 7

## User Story
**As a** System, **I want** to restrict administration screens to administrators only **So that** non-admin users cannot modify system configuration

## Acceptance Criteria
- [ ] Given I am logged in as an Analyst, when I try to access User Management, then I see a "403 Forbidden - Administrators Only" message
- [ ] Given I am logged in as an Administrator, when I access User Management, then the page loads normally
- [ ] Given I am not an administrator, when I view the navigation menu, then the "Administration" section is NOT visible
- [ ] Given I try to access an admin page directly via URL without admin role, when the page loads, then I am redirected to the Start Page with an error message

## Implementation Notes
- Implement role checking in a `useAuth` hook
- Wrap admin routes with a `<ProtectedRoute requiresAdmin={true}>` component
- Hide admin navigation items based on user role
- Display clear error messages when access is denied
