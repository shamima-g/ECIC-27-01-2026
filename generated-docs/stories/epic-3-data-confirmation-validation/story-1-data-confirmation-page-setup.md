# Story: Data Confirmation Page Setup

**Epic:** Data Confirmation & Validation
**Story:** 1 of 5
**Wireframe:** [screen-5-data-confirmation-file-checks.md](../../wireframes/screen-5-data-confirmation-file-checks.md)

## User Story

**As a** data operations user
**I want** to access a Data Confirmation screen with tab navigation
**So that** I can review data completeness across multiple dimensions before confirming data for approval

## Acceptance Criteria

### Happy Path
- [ ] Given I navigate to the Data Confirmation page, when the page loads, then I see the page title "Data Confirmation & Validation"
- [ ] Given I am on the Data Confirmation page, when I look at the tab navigation, then I see three tabs: "File Checks", "Main Data Checks", and "Other Checks"
- [ ] Given I am on the Data Confirmation page, when the page first loads, then the "File Checks" tab is active by default
- [ ] Given I am on the Data Confirmation page, when I click on a different tab, then that tab becomes active and displays its content
- [ ] Given I am on the Data Confirmation page, when I look at any tab, then I see a "Confirm Data" button visible at the bottom of the page
- [ ] Given I am on the Data Confirmation page, when I look at the layout, then the tab content area is scrollable if content exceeds viewport height

### Navigation
- [ ] Given I am elsewhere in the application, when I click the Data Confirmation navigation link, then I am taken to the Data Confirmation page with the File Checks tab active
- [ ] Given I am on any tab, when I switch to another tab, then the page does not reload (client-side tab switching)

### UI/UX
- [ ] Given I am on the Data Confirmation page, when I view the active tab, then it is visually distinct from inactive tabs (e.g., underline, bold, color)
- [ ] Given I am on the Data Confirmation page, when I hover over an inactive tab, then it shows hover feedback (e.g., background change)

## API Endpoints (from OpenAPI spec)

This story focuses on page structure and tab navigation. No API calls are made in this story. API integration will be implemented in subsequent stories (stories 2-5).

## Related Artifacts

- **Wireframes:**
  - [screen-5-data-confirmation-file-checks.md](../../wireframes/screen-5-data-confirmation-file-checks.md)
  - [screen-6-data-confirmation-main-checks.md](../../wireframes/screen-6-data-confirmation-main-checks.md)
  - [screen-7-data-confirmation-other-checks.md](../../wireframes/screen-7-data-confirmation-other-checks.md)
- **Depends on:**
  - Epic 1, Story 1 (Home Page Setup) - for navigation structure
  - Epic 1, Story 2 (Batch Management) - for active ReportBatchId context
- **Impacts:** Stories 2, 3, 4, 5 in this epic depend on this page structure

## Implementation Notes

- Implement as a client component (`"use client"`) to manage tab state
- Use Shadcn UI `<Tabs>` component for tab navigation
- Tab content should be lazy-loaded or conditionally rendered based on active tab
- The "Confirm Data" button should be positioned consistently across all tabs (sticky footer or fixed at bottom)
- Consider using Next.js App Router dynamic routes if needed (e.g., `/data-confirmation` page)
- Active ReportBatchId should be retrieved from context or state management (established in Epic 1, Story 2)
- Page should be accessible via main navigation menu (established in Epic 1)
