# Feature: InvestInsight Portfolio Reporting Platform

## Summary

InvestInsight is a comprehensive portfolio reporting and data stewardship platform designed to help investment teams prepare accurate weekly and monthly reports from multiple data sources. The system provides robust data governance capabilities including multi-level approvals, comments, and full audit trails for all key changes.

## Epics

1. **Epic 1: Foundation & Start Page** - Home page, navigation, batch management, and workflow state display
   - Status: Pending
   - Directory: `epic-1-foundation-start-page/`

2. **Epic 2: File Import Management** - Portfolio and other file uploads with validation and status tracking
   - Status: Pending
   - Directory: `epic-2-file-import-management/`

3. **Epic 3: Data Confirmation & Validation** - Multi-tab completeness checks with drill-down navigation
   - Status: Pending
   - Directory: `epic-3-data-confirmation-validation/`

4. **Epic 4: Instruments & Index Prices Maintenance** - Core reference data maintenance screens
   - Status: Pending
   - Directory: `epic-4-instruments-index-prices/`

5. **Epic 5: Risk Data Maintenance** - Duration, YTM, Beta, Credit Rating management screens
   - Status: Pending
   - Directory: `epic-5-risk-data-maintenance/`

6. **Epic 6: Report Comments** - Commentary capture for reporting periods
   - Status: Pending
   - Directory: `epic-6-report-comments/`

7. **Epic 7: Multi-Level Approvals** - Three-level approval workflow (L1, L2, L3)
   - Status: Pending
   - Directory: `epic-7-multi-level-approvals/`

8. **Epic 8: Process Logs & Administration** - Logs, user management, role management, page access
   - Status: Pending
   - Directory: `epic-8-process-logs-administration/`

9. **Epic 9: Reference Data Management** - CRUD screens for countries, currencies, portfolios, indexes, asset managers, benchmarks
   - Status: Pending
   - Directory: `epic-9-reference-data-management/`

## API Specifications

The backend APIs are defined in three OpenAPI specifications:

- `documentation/MonthlyAPIDefinition.yaml` - Monthly process, approvals, data checks, index prices, report comments
- `documentation/FileImporterAPIDefinition.yaml` - File uploads, validations, instruments, durations, betas, credit ratings
- `documentation/DataMaintenanceAPIDefinition.yaml` - Reference data (countries, currencies, portfolios, etc.)

## Wireframes

25 wireframes are available in `generated-docs/wireframes/` covering all screens and workflows.
