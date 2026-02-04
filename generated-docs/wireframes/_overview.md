# Wireframes: InvestInsight Portfolio Reporting Platform

## Summary

This document provides a comprehensive set of wireframes for the InvestInsight platform, a portfolio reporting and data stewardship application. The platform consists of 28 screens organized into five primary functional areas: Home & Start, Data Intake, Data Confirmation, Data Maintenance, and Approvals & Workflow.

**Key Design Principles:**
- Consistent ASCII-based wireframes for clarity
- Role-based access control throughout
- Workflow-state-based screen restrictions (maintenance screens locked after first approval)
- Comprehensive audit trails on all data changes
- Multi-level approval workflow (L1 → L2 → L3)

---

## Screens

| #   | Screen | Description   | File |
| --- | ------ | ------------- | ---- |
| 1 | Start Page | High-level entry point to create batches and monitor status | `screen-1-start-page.md` |
| 2 | Portfolio Imports Dashboard | Matrix view of portfolio files with clickable status icons | `screen-2-portfolio-imports.md` |
| 3 | Other Imports Dashboard | List view of non-portfolio files with status icons | `screen-3-other-imports.md` |
| 4 | File Upload Modal | Popup for file management, upload, and error viewing | `screen-4-file-upload-modal.md` |
| 5 | Data Confirmation - File Checks | Shows file upload status summary with expected vs actual file counts | `screen-5-data-confirmation-file-checks.md` |
| 6 | Data Confirmation - Main Data Checks | Verifies portfolio manager data, custodian data, and Bloomberg holdings completeness | `screen-6-data-confirmation-main-checks.md` |
| 7 | Data Confirmation - Other Checks | Validates reference data completeness (index prices, instruments, ratings, durations, betas) | `screen-7-data-confirmation-other-checks.md` |
| 8 | Instruments Maintenance | CRUD operations for instrument master data | `screen-8-instruments-maintenance.md` |
| 9 | Index Prices Maintenance | Manage index prices with history and quick pop-up entry | `screen-9-index-prices-maintenance.md` |
| 10 | Durations & YTM Maintenance | Maintain duration/YTM data with outstanding list | `screen-10-durations-maintenance.md` |
| 11 | Instrument Betas Maintenance | Maintain beta values with outstanding list | `screen-11-betas-maintenance.md` |
| 12 | Credit Ratings Maintenance | Manage credit ratings with changes view | `screen-12-credit-ratings-maintenance.md` |
| 13 | Report Comments | Capture commentary tied to specific reports | `screen-13-report-comments.md` |
| 14 | Level 1 Approval | Initial data completeness review with approve/reject | `screen-14-level-1-approval.md` |
| 15 | Level 2 Approval | Portfolio confirmation with approve/reject | `screen-15-level-2-approval.md` |
| 16 | Level 3 Approval | Final sign-off with mandatory rejection reason | `screen-16-level-3-approval.md` |
| 17 | Process Logs - File Process | Tracks file upload and validation journey | `screen-17-process-logs-file.md` |
| 18 | Process Logs - Monthly Process | Records workflow execution events | `screen-18-process-logs-monthly.md` |
| 19 | Process Logs - Calculation Logs | Tracks calculation execution with error details | `screen-19-process-logs-calculation.md` |
| 20 | Administration - User Management | Create, update, deactivate users and assign roles | `screen-20-admin-user-management.md` |
| 21 | Administration - Role Management | Define roles with permissions and page access | `screen-21-admin-role-management.md` |
| 22 | Administration - Page Access | Control role-based screen access and feature toggles | `screen-22-admin-page-access.md` |
| 23 | Reference Data - Countries | Manage country reference data | `screen-23-reference-countries.md` |
| 24-28 | Reference Data (Consolidated) | Currencies, Portfolios, Indexes, Asset Managers, Benchmarks | `screen-24-28-reference-data-consolidated.md` |

---

## Screen Flow

```
Start Page
    ├─→ Create New Batch
    ├─→ File Uploads
    │   ├─→ Portfolio Imports Dashboard
    │   │   └─→ File Upload Modal
    │   └─→ Other Imports Dashboard
    │       └─→ File Upload Modal
    ├─→ Data Confirmation
    │   ├─→ File Checks Tab
    │   ├─→ Main Data Checks Tab
    │   └─→ Other Checks Tab
    │       └─→ Maintenance Screens (to fix issues)
    ├─→ Data Maintenance
    │   ├─→ Instruments Maintenance
    │   ├─→ Index Prices Maintenance
    │   ├─→ Durations & YTM Maintenance
    │   ├─→ Instrument Betas Maintenance
    │   ├─→ Credit Ratings Maintenance
    │   └─→ Report Comments
    ├─→ Approvals
    │   ├─→ Level 1 Approval
    │   │   ├─→ Approve → Level 2 Approval
    │   │   └─→ Reject → Data Preparation (clear calcs)
    │   ├─→ Level 2 Approval
    │   │   ├─→ Approve → Level 3 Approval
    │   │   └─→ Reject → Data Preparation (clear calcs)
    │   └─→ Level 3 Approval
    │       ├─→ Approve → Publish Final Reports → Complete
    │       └─→ Reject (reason required) → Data Preparation (clear calcs)
    ├─→ Process Logs
    │   ├─→ File Process Logs
    │   ├─→ Monthly Process Logs
    │   └─→ Calculation Logs
    ├─→ Administration (Admin only)
    │   ├─→ User Management
    │   ├─→ Role Management
    │   └─→ Page Access
    └─→ Reference Data
        ├─→ Countries
        ├─→ Currencies
        ├─→ Portfolios
        ├─→ Indexes
        ├─→ Asset Managers
        └─→ Benchmarks
```

---

## Epic 3: Data Confirmation & Validation Details

### Overview
The Data Confirmation & Validation feature provides a consolidated view for users to verify that all required data is complete and valid before proceeding to the approval workflow. The screen uses a tabbed interface to organize different types of validation checks.

### Tab Structure
1. **File Checks Tab** - Shows file upload status summary with expected vs actual file counts by source
2. **Main Data Checks Tab** - Verifies portfolio manager data, custodian data, and Bloomberg holdings completeness
3. **Other Checks Tab** - Validates reference data completeness (index prices, instruments, ratings, durations, betas)

### Shared Components
- **Tab Navigation**: All three tabs share the same page with consistent tab navigation at the top
- **Confirm Data Button**: Always visible and enabled on all tabs, positioned at bottom-right
- **Refresh Icon**: Each tab has a refresh button to update check statuses in real-time
- **Status Indicators**: Consistent use of ✓ (green) for complete and ✗ (red) for incomplete
- **Legend**: Each tab includes a legend explaining the status indicators

### Data Flow
1. User navigates to Data Confirmation screen
2. Page loads with File Checks tab active by default
3. Each tab fetches its data from respective API endpoint on load
4. User can click refresh icon to update data without page reload
5. User can switch between tabs to review different validation types
6. User clicks Confirm Data when ready to proceed (regardless of completeness status)
7. System advances workflow to First Approval (L1) phase

### Informational Nature
- All three tabs are **read-only/informational** - no direct editing
- Users must navigate to other screens to fix identified issues:
  - File Checks issues → File Upload screens
  - Main Data Checks issues → File Upload screens
  - Other Checks issues → Maintenance screens (Instruments, Index Prices, Ratings, Durations, Betas)
- Guidance text on Other Checks tab helps users understand where to go

---

## Design Notes

### Common Patterns

1. **Data Grid Pattern**: Used throughout for list views
   - Expandable rows for details
   - Search/filter capabilities
   - Pagination for large datasets
   - Action buttons in expanded view

2. **Modal Pattern**: Used for CRUD operations
   - Add/Edit forms in modals
   - Validation feedback
   - Cancel/Save actions

3. **Status Indicators**: Consistent across screens
   - ✓ Green for complete/success
   - ✗ Red for failed/missing
   - ⏳ Yellow for processing
   - ○ Gray for not started

4. **Tabbed Navigation**: Used for related content
   - Data Confirmation (3 tabs)
   - Maintenance Screens (Current/Outstanding/Audit)
   - Process Logs (3 types)
   - Administration (3 areas)

### Role-Based Access

| Role | Primary Screens | Key Capabilities |
|------|-----------------|------------------|
| Operations Lead | File Uploads, Data Maintenance, Start Page | Upload files, maintain data, create batches, submit for approval |
| Analyst | Data Maintenance, Report Comments | Edit instruments/prices/durations/betas/ratings, add comments |
| L1 Approver | Level 1 Approval | Initial data completeness review |
| L2 Approver | Level 2 Approval | Portfolio confirmation and risk checks |
| L3 Approver | Level 3 Approval | Final sign-off with mandatory rejection reasons |
| Administrator | All Administration Screens | User/role/page access management |
| Read-Only | All screens (view only) | View data without edit capabilities |

### Workflow State Restrictions

| Workflow State | File Uploads | Maintenance Screens | Approvals | Process Logs |
|----------------|--------------|---------------------|-----------|--------------|
| Data Preparation | ✓ Full Access | ✓ Full Access | ✗ No Access | ✓ Read-Only |
| First Approval | ✗ Locked | ✗ Locked | ✓ L1 Only | ✓ Read-Only |
| Second Approval | ✗ Locked | ✗ Locked | ✓ L2 Only | ✓ Read-Only |
| Third Approval | ✗ Locked | ✗ Locked | ✓ L3 Only | ✓ Read-Only |
| Complete | ✗ Locked | ✗ Locked | ✗ No Access | ✓ Read-Only |

**Note**: Rejection at any approval level returns workflow to Data Preparation and unlocks file uploads and maintenance screens.

### Component Patterns to Use

Based on the Shadcn UI component library:

- **Data Grids**: Use `<Table>` with expandable rows
- **Modals**: Use `<Dialog>` for add/edit forms
- **Forms**: Use `<Form>` with `<Input>`, `<Select>`, `<Textarea>` components
- **Buttons**: Use `<Button>` with variants (default, destructive, outline, ghost)
- **Tabs**: Use `<Tabs>` for tabbed navigation
- **Status Badges**: Use `<Badge>` with variants (success, warning, destructive, secondary)
- **Dropdowns**: Use `<Select>` for filter dropdowns
- **Cards**: Use `<Card>` for dashboard panels
- **Progress**: Use `<Progress>` for workflow state indicators
- **Alerts**: Use `<Alert>` for validation messages and notifications

### Responsive Considerations

- **Desktop-first**: Primary use case is desktop workstations
- **Minimum width**: 1280px recommended for data grids
- **Tablet support**: Simplified views for 768px+ with stacked layouts
- **Mobile**: Read-only views only; full editing requires desktop
- **Data Confirmation specific**:
  - Tables should be scrollable horizontally on smaller screens
  - Tab labels may stack or use dropdown on mobile devices
  - Confirm Data button remains fixed and accessible at all screen sizes
  - Status indicators should remain visible in table cells even when condensed

### Accessibility

- **Keyboard navigation**: All interactive elements accessible via keyboard
- **Screen reader support**: Use proper ARIA labels and roles
- **Color contrast**: Ensure WCAG AA compliance for status indicators
- **Focus indicators**: Clear focus states for all interactive elements
- **Data Confirmation specific**:
  - Tab navigation should support keyboard navigation (arrow keys, tab key)
  - Status indicators should include aria-labels ("Complete" / "Incomplete")
  - Tables should have proper table headers and role attributes
  - Confirm Data button should be keyboard accessible and have clear focus state

---

## Next Steps for Implementation

1. **Review wireframes** with stakeholders for approval
2. **Create detailed component library** based on Shadcn UI patterns
3. **Develop API integration layer** based on OpenAPI specification
4. **Implement authentication/authorization** based on role definitions
5. **Build core workflows** starting with Data Preparation phase
6. **Implement approval workflows** with state transition logic
7. **Add audit trail tracking** for all data modifications
8. **Develop reporting integration** with Power BI (external to this system)

---

## References

- **Product Specification**: `documentation/InvestInsight-Product-Guide-v2.md`
- **API Specification**: `documentation/MonthlyAPIDefinition.yaml`, `documentation/FileImporterAPIDefinition.yaml`, `documentation/DataMaintenanceAPIDefinition.yaml`
- **Component Library**: Shadcn UI via MCP server
- **Tech Stack**: Next.js 16 + React 19 + TypeScript 5 + Tailwind CSS 4
