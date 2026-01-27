# Screen: Administration - User Management

## Purpose

Create, update, deactivate users and assign roles with full audit trail. Central management for all system users and their access rights.

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
|  [Add New User]  [View User Activity]  [Export Users]                       |
|                                                                              |
|  Search: [____________] Filter by: [Role ▼] [Status ▼] [Search]  [Clear]   |
|                                                                              |
|  User Management                                                             |
|  +------------------------------------------------------------------------+  |
|  | User | Username    | Full Name  | Email         | Roles        | ... |  |
|  | Id   |             |            |               |              |     |  |
|  |------|-------------|------------|---------------|--------------|-----|  |
|  | 1    | opslead     | John Smith | john@org.com  | Ops Lead     | [↓] |  |
|  |      |             |            |               |              |     |  |
|  |------|-------------|------------|---------------|--------------|-----|  |
|  | 2    | analyst1    | Jane Doe   | jane@org.com  | Analyst      | [↓] |  |
|  |      |             |            |               |              |     |  |
|  |------|-------------|------------|---------------|--------------|-----|  |
|  | 3    | l1approver  | Bob Wilson | bob@org.com   | L1 Approver  | [↓] |  |
|  |      |             |            |               |              |     |  |
|  |------|-------------|------------|---------------|--------------|-----|  |
|  | 4    | l2approver  | Mary Jones | mary@org.com  | L2 Approver  | [↓] |  |
|  |      |             |            |               |              |     |  |
|  |------|-------------|------------|---------------|--------------|-----|  |
|  | 5    | l3approver  | David Lee  | david@org.com | L3 Approver, | [↓] |  |
|  |      |             |            |               | Admin        |     |  |
|  |------|-------------|------------|---------------|--------------|-----|  |
|  | 6    | analyst2    | Sarah Chen | sarah@org.com | Analyst      | [↓] |  |
|  |      |             |            |               |              |     |  |
|  +------------------------------------------------------------------------+  |
|  | ...  | ...         | ...        | ...           | ...          | ... |  |
|  +------------------------------------------------------------------------+  |
|                                                                              |
|  Showing 1-25 of 34 users                                 [< 1 2 3 4 5 >]  |
|                                                                              |
+------------------------------------------------------------------------------+

Expanded Row View (when [↓] clicked):
+------------------------------------------------------------------------------+
|  +------------------------------------------------------------------------+  |
|  | User Id: 1  | Username: opslead                                      |  |
|  |------------------------------------------------------------------------|  |
|  |                                                                        |  |
|  | User Details:                                                          |  |
|  | ───────────────────────────────────────────────────────────────────   |  |
|  | Full Name: John Smith                                                  |  |
|  | Email: john@org.com                                                    |  |
|  | Status: Active                                                         |  |
|  | Created: 2025-06-15 by Admin                                           |  |
|  | Last Login: 2026-01-27 08:15:00                                        |  |
|  |                                                                        |  |
|  | Assigned Roles:                                                        |  |
|  | - Operations Lead                                                      |  |
|  |   (File uploads, data maintenance, workflow management)                |  |
|  |                                                                        |  |
|  | Accessible Pages:                                                      |  |
|  | - Start Page, File Uploads, Data Confirmation, All Maintenance Screens |  |
|  | - Process Logs, Report Comments                                        |  |
|  |                                                                        |  |
|  | Recent Activity:                                                       |  |
|  | - 2026-01-27 16:00: Submitted batch for L1 approval                    |  |
|  | - 2026-01-27 14:30: Updated durations for 3 instruments                |  |
|  | - 2026-01-27 11:45: Uploaded portfolio files via SFTP                  |  |
|  |                                                                        |  |
|  | [Edit User]  [Manage Roles]  [Deactivate]  [View Audit Trail][Close ↑]|  |
|  +------------------------------------------------------------------------+  |
+------------------------------------------------------------------------------+

Add/Edit User Modal (when "Add New User" or "Edit User" clicked):
+------------------------------------------------------------------------------+
|    ┌────────────────────────────────────────────────────────────────┐       |
|    │  Add New User                                           [X]    │       |
|    ├────────────────────────────────────────────────────────────────┤       |
|    │                                                                 │       |
|    │  Username: [___________________________]                       │       |
|    │  (Required, unique, lowercase, no spaces)                      │       |
|    │                                                                 │       |
|    │  Full Name: [___________________________]                      │       |
|    │                                                                 │       |
|    │  Email: [___________________________]                          │       |
|    │  (Required, must be valid email address)                       │       |
|    │                                                                 │       |
|    │  Password: [___________________________]                       │       |
|    │  (Minimum 8 characters, must include uppercase, number, symbol)│       |
|    │                                                                 │       |
|    │  Confirm Password: [___________________________]               │       |
|    │                                                                 │       |
|    │  Status: ( ) Active  ( ) Inactive                              │       |
|    │                                                                 │       |
|    │  Assign Roles:                                                 │       |
|    │  [ ] Operations Lead                                           │       |
|    │  [ ] Analyst                                                   │       |
|    │  [ ] L1 Approver                                               │       |
|    │  [ ] L2 Approver                                               │       |
|    │  [ ] L3 Approver                                               │       |
|    │  [ ] Administrator                                             │       |
|    │  [ ] Read-Only                                                 │       |
|    │                                                                 │       |
|    │                               [Cancel]      [Save]             │       |
|    └────────────────────────────────────────────────────────────────┘       |
+------------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| User Management Tab | Tab | Active tab showing user management |
| Add New User | Button | Opens modal to create new user |
| View User Activity | Button | Shows recent user activity logs |
| Export Users | Button | Exports user list to Excel |
| Search Input | Text Input | Search by username, name, or email |
| Filter Dropdowns | Dropdown | Filter by role or status |
| Users Grid | Table | Displays all users with key details |
| Expand Row | Button | Shows detailed user information and activity |
| Edit User | Button | Opens edit modal for user |
| Manage Roles | Button | Opens role assignment interface |
| Deactivate | Button | Deactivates user account (soft delete) |
| View Audit Trail | Button | Shows user change history |
| Username Input | Text Input | Username field (required, unique) |
| Full Name Input | Text Input | User's full name |
| Email Input | Text Input | Email address (required) |
| Password Input | Password Input | Password field with strength requirements |
| Status Radio | Radio Buttons | Active or Inactive status |
| Role Checkboxes | Checkboxes | Multiple role assignment |
| Save Button | Button | Saves user changes |
| Pagination | Navigation | Page through users list |

## User Actions

- **View Users**: See all system users and their details
- **Search/Filter**: Find users by username, role, or status
- **Add User**: Create new user account with role assignment
- **Edit User**: Modify user details and roles
- **Deactivate User**: Disable user account (maintains audit history)
- **View Activity**: See recent user actions and logins
- **View Audit Trail**: Access complete user change history
- **Export Users**: Download user list for external review

## Navigation

- **From:** Start Page (Admin access), Administration menu
- **To:** Role Management Tab, Page Access Tab, User Activity Logs, Audit Trail View

## Access Restrictions

- **Visible to:** Users with Administrator role only
- **Actions logged:** All user creation, modification, and deactivation actions
