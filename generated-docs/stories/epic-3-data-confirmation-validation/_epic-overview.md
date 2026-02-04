# Epic 3: Data Confirmation & Validation

## Description

Data Confirmation provides a single consolidated view to verify that all required data is complete and valid before proceeding to approvals. The screen is organized into three tabs (File Checks, Main Data Checks, Other Checks) that provide comprehensive visibility into file upload status, portfolio data completeness, and reference data completeness. This epic implements a critical quality gate in the reporting workflow, guiding users to specific fixes when issues are detected while providing a "Confirm Data" action that advances the workflow to the approval phase.

## User Journey

Users navigate to the Data Confirmation screen to review the overall health of the data before submitting for approval. They can:
1. Review file upload completeness across all file sources (File Checks tab)
2. Verify portfolio manager, custodian, and Bloomberg data completeness (Main Data Checks tab)
3. Check reference data completeness for instruments, index prices, credit ratings, durations, and betas (Other Checks tab)
4. Refresh data in real-time to see the latest status
5. Navigate to appropriate maintenance screens when issues are identified
6. Confirm data when satisfied with completeness (or knowingly accept incomplete data with justification)

## Stories

1. **Data Confirmation Page Setup** - Basic page structure with tab navigation and shared components
   - File: `story-1-data-confirmation-page-setup.md`
   - Status: Pending

2. **File Checks Tab** - File upload summary table showing expected vs actual file counts
   - File: `story-2-file-checks-tab.md`
   - Status: Pending

3. **Main Data Checks Tab** - Portfolio manager, custodian, and Bloomberg data completeness grids
   - File: `story-3-main-data-checks-tab.md`
   - Status: Pending

4. **Other Checks Tab** - Reference data completeness summary with incomplete counts
   - File: `story-4-other-checks-tab.md`
   - Status: Pending

5. **Confirm Data Workflow** - Submit data confirmation approval to advance workflow
   - File: `story-5-confirm-data-workflow.md`
   - Status: Pending

## API Endpoints Used

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/check-file-completeness` | Retrieve file completeness check data |
| GET | `/check-main-data-completeness` | Retrieve main data completeness check data |
| GET | `/check-other-data-completeness` | Retrieve other data completeness check data |
| POST | `/approve-logs/{ReportBatchId}` | Submit data confirmation approval |

## Key Features

- **Informational Design**: All tabs are read-only, guiding users to fix issues elsewhere
- **Real-Time Refresh**: Refresh button on each tab updates status from API
- **Visual Indicators**: Green (✓) for complete, red (✗) for incomplete
- **Always-Available Confirmation**: "Confirm Data" button visible on all tabs (user decides if data is acceptable)
- **Guided Navigation**: Help text directs users to appropriate maintenance screens

## Technical Notes

- All three tabs should be implemented as client components (`"use client"`) due to interactive state management
- Status indicators should be color-coded (green/red) and accessible (use proper ARIA labels)
- Refresh functionality should provide loading feedback during API calls
- Tab state should persist when switching between tabs (don't refetch unnecessarily)
- The "Confirm Data" button should always be enabled (business rule: user decides if data is acceptable)
