# Screen: Administration - Role Management

## Purpose

Define roles with specific permissions, assign page access to roles, and configure approval authorities. Central management for role-based access control.

## Wireframe

```
+------------------------------------------------------------------------------+
|  InvestInsight                                    [Admin] [Logout] [Profile] |
+------------------------------------------------------------------------------+
|  [Start] > Administration                                                    |
|                                                                              |
|  Administration                                                              |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  [User Management] [Role Management] [Page Access]                           |
|                                                                              |
|  [Add New Role]  [Export Roles]                                             |
|                                                                              |
|  Search: [____________] Filter by: [Permission Type ▼] [Search]  [Clear]   |
|                                                                              |
|  Role Management                                                             |
|  +------------------------------------------------------------------------+  |
|  | Role | Role Name       | Description           | Users | Permissions |  |
|  | Id   |                 |                       | Count |             |  |
|  |------|-----------------|------------------------|-------|-------------|  |
|  | 1    | Administrator   | Full system access     | 2     | All         | [↓]|
|  |      |                 |                       |       |             |  |
|  |------|-----------------|------------------------|-------|-------------|  |
|  | 2    | Operations Lead | Data prep and workflow | 3     | File Upload,| [↓]|
|  |      |                 | management            |       | Maintenance |  |
|  |------|-----------------|------------------------|-------|-------------|  |
|  | 3    | Analyst         | Data maintenance and   | 5     | Data Edit,  | [↓]|
|  |      |                 | commentary            |       | Comments    |  |
|  |------|-----------------|------------------------|-------|-------------|  |
|  | 4    | L1 Approver     | First level approval   | 2     | L1 Approve  | [↓]|
|  |      |                 |                       |       |             |  |
|  |------|-----------------|------------------------|-------|-------------|  |
|  | 5    | L2 Approver     | Second level approval  | 2     | L2 Approve  | [↓]|
|  |      |                 |                       |       |             |  |
|  |------|-----------------|------------------------|-------|-------------|  |
|  | 6    | L3 Approver     | Final level approval   | 1     | L3 Approve  | [↓]|
|  |      |                 |                       |       |             |  |
|  |------|-----------------|------------------------|-------|-------------|  |
|  | 7    | Read-Only       | View access only       | 8     | Read All    | [↓]|
|  |      |                 |                       |       |             |  |
|  +------------------------------------------------------------------------+  |
|  | ...  | ...             | ...                   | ...   | ...         |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-10 of 10 roles                                                    |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row View (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | Role Id: 2  | Operations Lead                                        |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | Role Details:                                                          |  |
|  | ───────────────────────────────────────────────────────────────────   |  |
|  | Role Name: Operations Lead                                             |  |
|  | Description: Data preparation and workflow management                  |  |
|  | Users Assigned: 3                                                      |  |
|  | Status: Active                                                         |  |
|  |                                                                        |  |
|  | Permissions:                                                           |  |
|  | ───────────────────────────────────────────────────────────────────   |  |
|  | Data Access:                                                           |  |
|  |   ✓ View all data                                                      |  |
|  |   ✓ Upload files                                                       |  |
|  |   ✓ Edit instruments                                                   |  |
|  |   ✓ Edit index prices                                                  |  |
|  |   ✓ Edit durations                                                     |  |
|  |   ✓ Edit betas                                                         |  |
|  |   ✓ Edit credit ratings                                                |  |
|  |   ✓ Add/edit report comments                                           |  |
|  |   ✓ Trigger SFTP import                                                |  |
|  |   ✓ Re-import files                                                    |  |
|  |                                                                        |  |
|  | Workflow Access:                                                       |  |
|  |   ✓ Create report batches                                              |  |
|  |   ✓ Submit for approval                                                |  |
|  |   ✗ Approve L1/L2/L3                                                   |  |
|  |                                                                        |  |
|  | Page Access:                                                           |  |
|  |   ✓ Start Page                                                         |  |
|  |   ✓ File Uploads (Portfolio & Other)                                   |  |
|  |   ✓ Data Confirmation                                                  |  |
|  |   ✓ All Maintenance Screens                                            |  |
|  |   ✓ Process Logs                                                       |  |
|  |   ✗ Approvals                                                          |  |
|  |   ✗ Administration                                                     |  |
|  |                                                                        |  |
|  | Assigned Users:                                                        |  |
|  | - opslead (John Smith)                                                 |  |
|  | - opslead2 (Mike Brown)                                                |  |
|  | - opslead3 (Lisa White)                                                |  |
|  |                                                                        |  |
|  | [Edit Role]  [Configure Permissions]  [View Audit Trail]     [Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+

Add/Edit Role Modal (when "Add New Role" or "Edit Role" clicked):
+------------------------------------------------------------------------------+
|    ┌────────────────────────────────────────────────────────────────┐       |
|    │  Edit Role - Operations Lead                            [X]    │       |
|    ├────────────────────────────────────────────────────────────────┤       |
|    │                                                                 │       |
|    │  Role Name: [Operations Lead_____________________]             │       |
|    │                                                                 │       |
|    │  Description:                                                  │       |
|    │  ┌───────────────────────────────────────────────────────┐    │       |
|    │  │ Data preparation and workflow management              │    │       |
|    │  └───────────────────────────────────────────────────────┘    │       |
|    │                                                                 │       |
|    │  Permissions:                                                  │       |
|    │  ─────────────────────────────────────────────────────────     │       |
|    │  Data Access:                                                  │       |
|    │  [✓] View all data                                             │       |
|    │  [✓] Upload files                                              │       |
|    │  [✓] Edit instruments                                          │       |
|    │  [✓] Edit index prices                                         │       |
|    │  [✓] Edit durations                                            │       |
|    │  [✓] Edit betas                                                │       |
|    │  [✓] Edit credit ratings                                       │       |
|    │  [✓] Add/edit report comments                                  │       |
|    │  [✓] Trigger SFTP import                                       │       |
|    │  [✓] Re-import files                                           │       |
|    │                                                                 │       |
|    │  Workflow Access:                                              │       |
|    │  [✓] Create report batches                                     │       |
|    │  [✓] Submit for approval                                       │       |
|    │  [ ] Approve L1                                                │       |
|    │  [ ] Approve L2                                                │       |
|    │  [ ] Approve L3                                                │       |
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
| Role Management Tab | Tab | Active tab showing role management |
| Add New Role | Button | Opens modal to create new role |
| Export Roles | Button | Exports role list to Excel |
| Search Input | Text Input | Search by role name |
| Filter Dropdowns | Dropdown | Filter by permission type |
| Roles Grid | Table | Displays all roles with key details |
| Expand Row | Button | Shows detailed role permissions and users |
| Edit Role | Button | Opens edit modal for role |
| Configure Permissions | Button | Opens permission configuration interface |
| View Audit Trail | Button | Shows role change history |
| Role Name Input | Text Input | Role name field |
| Description Text Area | Text Area | Role description |
| Permission Checkboxes | Checkboxes | Granular permission assignment |
| Status Radio | Radio Buttons | Active or Inactive status |
| Save Button | Button | Saves role changes |

## User Actions

- **View Roles**: See all system roles and their permissions
- **Search/Filter**: Find roles by name or permission type
- **Add Role**: Create new role with custom permissions
- **Edit Role**: Modify role details and permissions
- **Configure Permissions**: Set granular access rights for role
- **View Assigned Users**: See which users have each role
- **View Audit Trail**: Access complete role change history
- **Export Roles**: Download role list for documentation

## Navigation

- **From:** User Management Tab, Administration menu
- **To:** User Management Tab, Page Access Tab, Audit Trail View

## Access Restrictions

- **Visible to:** Users with Administrator role only
- **Actions logged:** All role creation, modification, and permission changes
