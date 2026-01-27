# Story: Report Comments - CRUD Operations

**Epic:** Report Comments
**Story:** 2 of 4

## User Story
**As an** Analyst or Portfolio Manager, **I want** to create, update, and delete report comments **So that** I can maintain accurate commentary

## Acceptance Criteria
- [ ] Given I click "Add Comment", when the modal opens, then I select a ReportListId and enter Comment text
- [ ] Given I save a new comment, when save completes, then it appears in the grid
- [ ] Given I click "Edit", when the modal opens, then I can modify the Comment text
- [ ] Given I click "Delete", when I confirm, then the comment is removed

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/report-comments` | Create comment |
| GET | `/report-comments/{Id}` | Get comment by ID |
| PUT | `/report-comments/{Id}` | Update comment |
| DELETE | `/report-comments/{Id}` | Delete comment |
