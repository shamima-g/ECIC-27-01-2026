# Story: Start Page - Navigation Links

**Epic:** Foundation & Start Page
**Story:** 4 of 5
**Wireframe:** `../../wireframes/screen-1-start-page.md`

## User Story

**As a** user
**I want** quick navigation links to key screens
**So that** I can efficiently access the areas I need to work in

## Acceptance Criteria

### Navigation Menu
- [ ] Given I am on the Start Page, when I look at the page, then I see a navigation menu with links to "File Uploads", "Data Confirmation", "Maintenance", "Approvals", "Process Logs", and "Administration"
- [ ] Given I click "File Uploads", when the link activates, then I navigate to the Portfolio Imports Dashboard
- [ ] Given I click "Data Confirmation", when the link activates, then I navigate to the Data Confirmation screen
- [ ] Given I click "Maintenance", when the link activates, then I see a submenu with links to Instruments, Index Prices, Durations, Betas, Credit Ratings, and Report Comments
- [ ] Given I click "Approvals", when the link activates, then I see a submenu with links to L1, L2, and L3 Approval screens
- [ ] Given I click "Process Logs", when the link activates, then I navigate to the Process Logs screen
- [ ] Given I click "Administration", when the link activates, then I see a submenu with links to User Management, Role Management, and Page Access

### Quick Action Cards
- [ ] Given I am on the Start Page, when I look below the status section, then I see quick action cards for "Upload Files", "View Data Confirmation", and "View Approvals"
- [ ] Given I click a quick action card, when it activates, then I navigate to the corresponding screen

### Role-Based Access
- [ ] Given I am logged in as an Analyst, when I view the navigation menu, then the "Administration" section is NOT visible
- [ ] Given I am logged in as an Administrator, when I view the navigation menu, then all sections are visible

## API Endpoints (from OpenAPI spec)

No direct API calls for navigation. Navigation links are client-side routing.

## Implementation Notes
- Use Next.js App Router with `<Link>` components for navigation
- Create a shared navigation layout component that all pages will use
- Use Shadcn `<NavigationMenu>` for the top navigation bar
- Use Shadcn `<Card>` for quick action cards
- Implement role-based visibility checks (will be implemented in Epic 8)
- **Note:** The home page (`web/src/app/page.tsx`) was created in the "Home Page Setup" story. This story enhances that existing page with navigation functionality.
