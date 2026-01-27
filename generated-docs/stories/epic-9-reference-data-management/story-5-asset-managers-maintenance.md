# Story: Asset Managers Maintenance

**Epic:** Reference Data Management
**Story:** 5 of 6

## User Story
**As an** Administrator, **I want** to manage asset manager records **So that** portfolios can be associated with their asset managers

## Acceptance Criteria
- [ ] Given I navigate to Asset Managers, when the page loads, then I see a grid of all asset managers
- [ ] Given the grid is displayed, when I view columns, then I see: Id, AssetManagerCode, AssetManagerName, Status, LastChangedUser
- [ ] Given I click "Add Asset Manager", when the modal opens, then I enter AssetManagerCode and AssetManagerName
- [ ] Given I save/edit/delete, when actions complete, then changes are reflected in the grid
- [ ] Given I click "View Audit Trail", when the modal opens, then I see all historical changes

## API Endpoints
| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/asset-managers` | Get all asset managers |
| POST | `/asset-managers` | Create asset manager |
| PUT | `/asset-managers/{Id}` | Update asset manager |
| DELETE | `/asset-managers/{Id}` | Delete asset manager |
| GET | `/asset-managers-full-audit-trail` | Get full audit trail |
