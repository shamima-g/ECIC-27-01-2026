# Screen: Administration - Page Access

## Purpose

Control which roles can access which screens, configure read-only vs. full access, and manage feature toggles. Fine-grained page-level access control.

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
|  [Export Access Matrix]  [Save All Changes]                                 |
|                                                                              |
|  Page Access Control Matrix                                                  |
|  +------------------------------------------------------------------------+  |
|  | Page / Screen      | Admin | Ops  | Analyst | L1  | L2  | L3  | RO  |  |
|  |                    |       | Lead |         | Apr | Apr | Apr |     |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Start Page         | ✓ FW  | ✓ FW | ✓ FW    | ✓FW | ✓FW | ✓FW | ✓RO |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Portfolio Imports  | ✓ FW  | ✓ FW | ✓ FW    | ✗   | ✗   | ✗   | ✓RO |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Other Imports      | ✓ FW  | ✓ FW | ✓ FW    | ✗   | ✗   | ✗   | ✓RO |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Data Confirmation  | ✓ FW  | ✓ FW | ✓ FW    | ✓RO | ✓RO | ✓RO | ✓RO |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Instruments        | ✓ FW  | ✓ FW | ✓ FW    | ✗   | ✗   | ✗   | ✓RO |  |
|  | Maintenance        |       |      |         |     |     |     |     |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Index Prices       | ✓ FW  | ✓ FW | ✓ FW    | ✗   | ✗   | ✗   | ✓RO |  |
|  | Maintenance        |       |      |         |     |     |     |     |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Durations          | ✓ FW  | ✓ FW | ✓ FW    | ✗   | ✗   | ✗   | ✓RO |  |
|  | Maintenance        |       |      |         |     |     |     |     |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Betas Maintenance  | ✓ FW  | ✓ FW | ✓ FW    | ✗   | ✗   | ✗   | ✓RO |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Credit Ratings     | ✓ FW  | ✓ FW | ✓ FW    | ✗   | ✗   | ✗   | ✓RO |  |
|  | Maintenance        |       |      |         |     |     |     |     |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Report Comments    | ✓ FW  | ✓ FW | ✓ FW    | ✓RO | ✓RO | ✓RO | ✓RO |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Level 1 Approval   | ✗     | ✗    | ✗       | ✓FW | ✗   | ✗   | ✗   |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Level 2 Approval   | ✗     | ✗    | ✗       | ✗   | ✓FW | ✗   | ✗   |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Level 3 Approval   | ✗     | ✗    | ✗       | ✗   | ✗   | ✓FW | ✗   |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Process Logs       | ✓ FW  | ✓ FW | ✓ FW    | ✓RO | ✓RO | ✓RO | ✓RO |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Administration     | ✓ FW  | ✗    | ✗       | ✗   | ✗   | ✗   | ✗   |  |
|  |--------------------|-------|------|---------|-----|-----|-----|-----|  |
|  | Reference Data     | ✓ FW  | ✓ FW | ✓RO     | ✗   | ✗   | ✗   | ✓RO |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Legend:  ✓ FW = Full Write Access   ✓ RO = Read-Only   ✗ = No Access      |
|                                                                              |
|  Click on any cell to modify access level                                    |
|                                                                              |
+------------------------------------------------------------------------------+

Cell Edit Modal (when clicking on a cell):
+------------------------------------------------------------------------------+
|    ┌────────────────────────────────────────────────────────────────┐       |
|    │  Configure Page Access                                  [X]    │       |
|    ├────────────────────────────────────────────────────────────────┤       |
|    │                                                                 │       |
|    │  Page: Instruments Maintenance                                 │       |
|    │  Role: L1 Approver                                             │       |
|    │                                                                 │       |
|    │  Access Level:                                                 │       |
|    │  ( ) No Access                                                 │       |
|    │  ( ) Read-Only                                                 │       |
|    │  ( ) Full Write Access                                         │       |
|    │                                                                 │       |
|    │  Conditional Access (optional):                                │       |
|    │  [ ] Access restricted to specific workflow states            │       |
|    │                                                                 │       |
|    │  If checked, specify allowed states:                           │       |
|    │  [ ] Data Preparation                                          │       |
|    │  [ ] First Approval                                            │       |
|    │  [ ] Second Approval                                           │       |
|    │  [ ] Third Approval                                            │       |
|    │  [ ] Complete                                                  │       |
|    │                                                                 │       |
|    │  Notes:                                                        │       |
|    │  ┌───────────────────────────────────────────────────────┐    │       |
|    │  │                                                         │    │       |
|    │  └───────────────────────────────────────────────────────┘    │       |
|    │                                                                 │       |
|    │                               [Cancel]      [Save]             │       |
|    └────────────────────────────────────────────────────────────────┘       |
+------------------------------------------------------------------------------+

Feature Toggles Section (below access matrix):
+------------------------------------------------------------------------------+
|  Feature Toggles                                                             |
|  ────────────────────────────────────────────────────────────────────────    |
|                                                                              |
|  +------------------------------------------------------------------------+  |
|  | Feature                          | Status    | Description            |  |
|  |----------------------------------|-----------|------------------------|  |
|  | SFTP Import                      | [✓] On    | Enable automatic SFTP  |  |
|  |                                  |           | file imports           |  |
|  |----------------------------------|-----------|------------------------|  |
|  | Email Notifications              | [✓] On    | Send email alerts for  |  |
|  |                                  |           | approvals and errors   |  |
|  |----------------------------------|-----------|------------------------|  |
|  | Audit Trail Export               | [✓] On    | Allow export of audit  |  |
|  |                                  |           | trail data             |  |
|  |----------------------------------|-----------|------------------------|  |
|  | Bulk Data Upload                 | [✓] On    | Enable bulk file       |  |
|  |                                  |           | uploads                |  |
|  |----------------------------------|-----------|------------------------|  |
|  | Advanced Filtering               | [ ] Off   | Enable advanced search |  |
|  |                                  |           | and filter options     |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  [Save Feature Toggles]                                                      |
|                                                                              |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Page Access Tab | Tab | Active tab showing page access control |
| Export Access Matrix | Button | Exports access matrix to Excel |
| Save All Changes | Button | Saves all page access modifications |
| Access Control Matrix | Table | Grid showing page/role access levels |
| Access Level Cell | Clickable Cell | Click to modify access level for page/role combo |
| Cell Edit Modal | Modal | Configure detailed access settings |
| Access Level Radio | Radio Buttons | No Access / Read-Only / Full Write |
| Conditional Access | Checkbox | Enable workflow-state-based access |
| Workflow States | Checkboxes | Select allowed workflow states |
| Notes Text Area | Text Area | Additional notes for access configuration |
| Feature Toggles Section | Display Panel | System-wide feature on/off switches |
| Feature Toggle Switch | Toggle | Enable/disable specific features |
| Save Feature Toggles | Button | Saves feature toggle changes |

## User Actions

- **View Access Matrix**: See comprehensive page/role access grid
- **Modify Access**: Click cell to change access level for specific page/role
- **Set Conditional Access**: Configure workflow-state-based access restrictions
- **Export Matrix**: Download access matrix for documentation
- **Manage Feature Toggles**: Enable/disable system-wide features
- **Save Changes**: Apply all access modifications

## Behaviour

- **Access Levels**:
  - **No Access**: Page not visible to role
  - **Read-Only**: Page visible but no edit/create/delete actions
  - **Full Write**: Complete CRUD access
- **Conditional Access**: Can restrict access based on workflow state (e.g., maintenance screens locked after First Approval)
- **Feature Toggles**: System-wide switches for optional features
- **Changes take effect immediately** after saving

## Navigation

- **From:** User Management Tab, Role Management Tab
- **To:** User Management Tab, Role Management Tab

## Access Restrictions

- **Visible to:** Users with Administrator role only
- **Actions logged:** All page access modifications and feature toggle changes
