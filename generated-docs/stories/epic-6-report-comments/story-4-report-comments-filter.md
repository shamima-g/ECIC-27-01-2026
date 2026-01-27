# Story: Report Comments - Filter by Report

**Epic:** Report Comments
**Story:** 4 of 4

## User Story
**As an** Analyst or Portfolio Manager, **I want** to filter comments by report **So that** I can view commentary for a specific report

## Acceptance Criteria
- [ ] Given I click the "Filter by Report" dropdown, when it opens, then I see a list of all reports for the current batch
- [ ] Given I select a report from the filter, when I apply it, then only comments for that report are displayed
- [ ] Given I have a filter applied, when I click "Clear Filter", then all comments are displayed again

## Implementation Notes
- Use Shadcn `<Select>` for report filter dropdown
- Implement client-side filtering for performance
