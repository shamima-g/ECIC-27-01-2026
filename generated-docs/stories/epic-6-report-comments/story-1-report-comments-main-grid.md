# Story: Report Comments - Main Grid

**Epic:** Report Comments
**Story:** 1 of 4
**Wireframe:** `../../wireframes/screen-13-report-comments.md`

## User Story
**As an** Analyst or Portfolio Manager, **I want** to view all report comments for the current batch **So that** I can review commentary captured for reports

## Acceptance Criteria
- [ ] Given I navigate to Report Comments, when the page loads, then I see a grid of all comments for the current ReportBatchId
- [ ] Given the grid is displayed, when I view columns, then I see: Id, ReportDate, ReportListName, Comment, LastChangedUser
- [ ] Given I search by ReportListName, when I type, then the grid filters
- [ ] Given there are many comments, when I view the grid, then it is paginated

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/report-comments` | Get all report comments |
