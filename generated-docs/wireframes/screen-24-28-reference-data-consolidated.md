# Screens: Reference Data - Consolidated (Currencies, Portfolios, Indexes, Asset Managers, Benchmarks)

## Purpose

All reference data screens follow the same standardized CRUD pattern with audit trails. This consolidated wireframe covers screens 24-28.

## Screen List

- **Screen 24:** Reference Data - Currencies
- **Screen 25:** Reference Data - Portfolios
- **Screen 26:** Reference Data - Indexes
- **Screen 27:** Reference Data - Asset Managers
- **Screen 28:** Reference Data - Benchmarks

## Standardized Wireframe Pattern

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > [Reference Data] > [Entity Type]                                  |
|                                                                              |
|  Reference Data - [Entity Type]                                              |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [Add New]  [View Full Audit Trail]  [Export]                               |
|                                                                              |
|  Search: [____________] Filter by: [Status ▼] [Filter] [Search]  [Clear]   |
|                                                                              |
|  [Entity Type] List                                                          |
|  +------------------------------------------------------------------------+  |
|  | Id  | [Key Fields specific to entity type...]    | Status | Last   |...|
|  |     |                                            |        | Changed|   |
|  |-----|-----------------------------------------------|--------|--------|   |
|  | 1   | [Entity-specific data row 1...]              | Active | Date   | [↓]|
|  |-----|-----------------------------------------------|--------|--------|   |
|  | 2   | [Entity-specific data row 2...]              | Active | Date   | [↓]|
|  |-----|-----------------------------------------------|--------|--------|   |
|  | 3   | [Entity-specific data row 3...]              | Active | Date   | [↓]|
|  |-----|-----------------------------------------------|--------|--------|   |
|  | ... | ...                                          | ...    | ...    |...|
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of [N] records                              [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row View (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Id: [N]  | [Entity Name]                                            |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Details:                                                               |  |
|  | ───────────────────────────────────────────────────────────────────   |  |
|  | [Entity-specific fields and values...]                                 |  |
|  | Status: Active                                                         |  |
|  |                                                                        |  |
|  | Last Changed: [Date] by [User]                                         |  |
|  |                                                                        |  |
|  | Usage:                                                                 |  |
|  | [Where this entity is referenced in the system...]                     |  |
|  |                                                                        |  |
|  | [Edit]  [Delete]  [View Audit Trail]                         [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+

Add/Edit Modal (when "Add New" or "Edit" clicked):
+------------------------------------------------------------------------------+
|    ┌────────────────────────────────────────────────────────────────┐       |
|    │  Add [Entity Type]                                      [X]    │       |
|    ├────────────────────────────────────────────────────────────────┤       |
|    │                                                                 │       |
|    │  [Entity-specific input fields...]                             │       |
|    │                                                                 │       |
|    │  Status: ( ) Active  ( ) Inactive                              │       |
|    │                                                                 │       |
|    │                               [Cancel]      [Save]             │       |
|    └────────────────────────────────────────────────────────────────┘       |
+------------------------------------------------------------------------------+
```

---

## Screen 24: Reference Data - Currencies

### Entity-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| Currency Code | String | 3-character currency code (e.g., ZAR, USD, GBP) |
| Currency Name | String | Full currency name (e.g., South African Rand) |
| Symbol | String | Currency symbol (e.g., R, $, £) |
| Decimal Places | Integer | Number of decimal places (typically 2) |
| Status | Enum | Active or Inactive |

### Usage References
- Instruments (denominated in currency)
- Portfolios (base currency)
- Index prices (currency)

---

## Screen 25: Reference Data - Portfolios

### Entity-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| Portfolio Code | String | Unique portfolio identifier |
| Portfolio Name | String | Full portfolio name |
| Asset Manager | Foreign Key | Reference to Asset Manager |
| Base Currency | Foreign Key | Reference to Currency |
| Benchmark | Foreign Key | Reference to Benchmark |
| Inception Date | Date | Portfolio start date |
| Status | Enum | Active or Inactive |

### Usage References
- File uploads (portfolio-specific files)
- Holdings data
- Performance calculations
- Report generation

---

## Screen 26: Reference Data - Indexes

### Entity-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| Index Code | String | Unique index identifier |
| Index Name | String | Full index name |
| Bloomberg Ticker | String | Bloomberg ticker code |
| Index Provider | String | Provider name (e.g., JSE, S&P, MSCI) |
| Currency | Foreign Key | Reference to Currency |
| Index Type | Enum | Equity, Bond, Commodity, etc. |
| Status | Enum | Active or Inactive |

### Usage References
- Index prices maintenance
- Portfolio benchmarking
- Performance attribution
- Risk analytics

---

## Screen 27: Reference Data - Asset Managers

### Entity-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| Manager Code | String | Unique asset manager identifier |
| Manager Name | String | Full asset manager name |
| Contact Email | String | Primary contact email |
| Contact Phone | String | Primary contact phone |
| Address | Text | Physical/postal address |
| Status | Enum | Active or Inactive |

### Usage References
- Portfolios (managed by)
- File uploads (manager-specific files)
- Reporting grouping

---

## Screen 28: Reference Data - Benchmarks

### Entity-Specific Fields

| Field | Type | Description |
|-------|------|-------------|
| Benchmark Code | String | Unique benchmark identifier |
| Benchmark Name | String | Full benchmark name |
| Composition | Text | Description of benchmark composition |
| Index References | Array | One or more indexes that make up the benchmark |
| Rebalancing Frequency | Enum | Quarterly, Monthly, Annual |
| Status | Enum | Active or Inactive |

### Usage References
- Portfolios (benchmarked against)
- Performance attribution
- Relative return calculations
- Risk-adjusted metrics

---

## Common Elements (All Reference Data Screens)

| Element | Type | Description |
|---------|------|-------------|
| Add New | Button | Opens modal to create new record |
| View Full Audit Trail | Button | Shows complete change history |
| Export | Button | Exports data to Excel |
| Search Input | Text Input | Search by code or name |
| Filter Dropdowns | Dropdown | Filter by status or other criteria |
| Data Grid | Table | Displays all records |
| Expand Row | Button | Shows detailed record information |
| Edit | Button | Opens edit modal |
| Delete | Button | Soft deletes record (if not in use) |
| View Audit Trail | Button | Shows audit history for specific record |
| Status Radio | Radio Buttons | Active or Inactive status |
| Pagination | Navigation | Page through records list |

## Common User Actions

- **Search/Filter**: Find records by code, name, or status
- **Add Record**: Create new reference data record
- **Edit Record**: Modify existing record details
- **Delete Record**: Remove record (only if not used in data)
- **View Audit Trail**: Access complete change history
- **View Usage**: See where record is referenced in system
- **Export**: Download data for external use

## Common Navigation

- **From:** Start Page, Maintenance Screens (as reference), Administration
- **To:** Add/Edit Modal, Audit Trail View, Related Maintenance Screens

## Common Access Restrictions

- **View Access**: All users
- **Edit Access**: Operations Lead, Analyst, Administrator
- **Delete Restrictions**: Cannot delete if referenced by other data
- **Audit Access**: All users can view audit trails
