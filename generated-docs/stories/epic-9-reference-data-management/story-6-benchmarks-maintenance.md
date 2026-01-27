# Story: Benchmarks Maintenance

**Epic:** Reference Data Management
**Story:** 6 of 6

## User Story
**As an** Administrator or Analyst, **I want** to manage benchmark definitions **So that** portfolios can be evaluated against their benchmarks

## Acceptance Criteria
- [ ] Given I navigate to Benchmarks, when the page loads, then I see a grid of all benchmarks
- [ ] Given the grid is displayed, when I view columns, then I see: Id, BenchmarkCode, BenchmarkName, IndexId, Status, LastChangedUser
- [ ] Given I click "Add Benchmark", when the modal opens, then I enter BenchmarkCode, BenchmarkName, and IndexId
- [ ] Given I save/edit/delete, when actions complete, then changes are reflected in the grid
- [ ] Given benchmarks are linked to indexes, when I view a benchmark, then I see its associated index name

## API Endpoints
Note: Benchmark endpoints are not explicitly included in the provided API specs but would follow the standard CRUD pattern.

## Implementation Notes
- Benchmarks are referenced by BenchmarkId in the portfolios endpoints
- May need to define benchmark CRUD endpoints or retrieve from configuration
