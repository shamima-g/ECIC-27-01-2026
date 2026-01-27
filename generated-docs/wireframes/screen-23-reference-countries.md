# Screen: Reference Data - Countries

## Purpose

Manage country reference data with full CRUD operations and audit trail. Standard reference data screen pattern used across all reference data types.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > [Reference Data] > Countries                                      |
|                                                                              |
|  Reference Data - Countries                                                  |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [Add Country]  [View Full Audit Trail]  [Export]                           |
|                                                                              |
|  Search: [____________] Filter by: [Status ▼] [Search]  [Clear]            |
|                                                                              |
|  Countries                                                                   |
|  +------------------------------------------------------------------------+  |
|  | Id  | Country Code | Country Name    | ISO Code | Status  | Last    |  |
|  |     |              |                 |          |         | Changed |  |
|  |-----|--------------|-----------------|----------|---------|---------|  |
|  | 1   | ZA           | South Africa    | ZAF      | Active  | 2025-06 | [↓]|
|  |     |              |                 |          |         | -15     |  |
|  |-----|--------------|-----------------|----------|---------|---------|  |
|  | 2   | US           | United States   | USA      | Active  | 2025-06 | [↓]|
|  |     |              |                 |          |         | -15     |  |
|  |-----|--------------|-----------------|----------|---------|---------|  |
|  | 3   | GB           | United Kingdom  | GBR      | Active  | 2025-06 | [↓]|
|  |     |              |                 |          |         | -15     |  |
|  |-----|--------------|-----------------|----------|---------|---------|  |
|  | 4   | DE           | Germany         | DEU      | Active  | 2025-06 | [↓]|
|  |     |              |                 |          |         | -15     |  |
|  |-----|--------------|-----------------|----------|---------|---------|  |
|  | 5   | JP           | Japan           | JPN      | Active  | 2025-06 | [↓]|
|  |     |              |                 |          |         | -15     |  |
|  |-----|--------------|-----------------|----------|---------|---------|  |
|  | 6   | CN           | China           | CHN      | Active  | 2025-06 | [↓]|
|  |     |              |                 |          |         | -15     |  |
|  +------------------------------------------------------------------------+  |
|  | ... | ...          | ...             | ...      | ...     | ...     |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 195 countries                            [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row View (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Id: 1  | Country: South Africa (ZA)                                  |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Country Details:                                                       |  |
|  | ───────────────────────────────────────────────────────────────────   |  |
|  | Country Code: ZA                                                       |  |
|  | Country Name: South Africa                                             |  |
|  | ISO Code: ZAF                                                          |  |
|  | Status: Active                                                         |  |
|  |                                                                        |  |
|  | Last Changed: 2025-06-15 10:00 by Admin                               |  |
|  |                                                                        |  |
|  | Usage:                                                                 |  |
|  | - 234 instruments                                                      |  |
|  | - 12 issuers                                                           |  |
|  |                                                                        |  |
|  | [Edit]  [Delete]  [View Audit Trail]                         [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+

Add/Edit Country Modal (when "Add Country" or "Edit" clicked):
+------------------------------------------------------------------------------+
|    ┌────────────────────────────────────────────────────────────────┐       |
|    │  Add Country                                            [X]    │       |
|    ├────────────────────────────────────────────────────────────────┤       |
|    │                                                                 │       |
|    │  Country Code: [____]                                          │       |
|    │  (Required, 2 characters, uppercase)                           │       |
|    │                                                                 │       |
|    │  Country Name: [_________________________________]             │       |
|    │  (Required)                                                    │       |
|    │                                                                 │       |
|    │  ISO Code: [____]                                              │       |
|    │  (Required, 3 characters, uppercase)                           │       |
|    │                                                                 │       |
|    │  Status: ( ) Active  ( ) Inactive                              │       |
|    │                                                                 │       |
|    │                               [Cancel]      [Save]             │       |
|    └────────────────────────────────────────────────────────────────┘       |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Add Country | Button | Opens modal to create new country |
| View Full Audit Trail | Button | Shows complete change history for all countries |
| Export | Button | Exports country list to Excel |
| Search Input | Text Input | Search by code or name |
| Filter Dropdowns | Dropdown | Filter by status |
| Countries Grid | Table | Displays all countries |
| Expand Row | Button | Shows detailed country information |
| Edit | Button | Opens edit modal for country |
| Delete | Button | Soft deletes country (if not in use) |
| View Audit Trail | Button | Shows audit history for specific country |
| Country Code Input | Text Input | 2-character country code |
| Country Name Input | Text Input | Full country name |
| ISO Code Input | Text Input | 3-character ISO code |
| Status Radio | Radio Buttons | Active or Inactive status |
| Pagination | Navigation | Page through countries list |

## User Actions

- **Search/Filter**: Find countries by code, name, or status
- **Add Country**: Create new country reference record
- **Edit Country**: Modify existing country details
- **Delete Country**: Remove country (only if not used in data)
- **View Audit Trail**: Access complete change history
- **View Usage**: See where country is referenced in system
- **Export**: Download country list for external use

## Navigation

- **From:** Start Page, Instruments Maintenance (reference), Administration
- **To:** Add/Edit Country Modal, Audit Trail View, Instruments Maintenance

## Access Restrictions

- **View Access**: All users
- **Edit Access**: Operations Lead, Analyst, Administrator
- **Delete Restrictions**: Cannot delete if country is referenced by instruments or issuers
