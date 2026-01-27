# Story: Home Page Setup

**Epic:** Foundation & Start Page
**Story:** 1 of 5
**Wireframe:** `../../wireframes/screen-1-start-page.md`

## User Story

**As a** user visiting the application
**I want** to see a relevant home page for InvestInsight
**So that** I can immediately understand and access the application's portfolio reporting functionality

## Acceptance Criteria

### Core Requirements
- [ ] Given I visit the root URL (/), when the page loads, then I see the InvestInsight Start Page
- [ ] Given the home page loads, when I look at the page, then I do NOT see the template README.md content
- [ ] Given I am on the home page, when I look for navigation, then I can access the main features (File Imports, Data Confirmation, Maintenance Screens, Approvals)

### Cleanup
- [ ] Given I inspect the codebase, when I look at web/src/app/page.tsx, then the template's README-displaying code has been completely removed
- [ ] Given I inspect the codebase, when I look at web/src/app/page.tsx, then it contains the Start Page implementation

## API Endpoints (from OpenAPI spec)

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/report-batches` | Fetch all report batches for display |
| GET | `/configurations` | Get system configuration data |

## Implementation Notes
- Remove the entire template home page implementation from `web/src/app/page.tsx`
- Remove the `convertMarkdownToHtml` function (template code)
- Remove the `fs` and `path` imports used for reading README.md
- Implement the Start Page as the home page (combines stories 2-5)
- Use Shadcn UI components: `<Card>`, `<Button>`, `<Badge>` for status indicators
- Reference the Start Page wireframe for layout details
