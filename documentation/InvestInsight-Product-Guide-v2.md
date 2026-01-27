**InvestInsight Product Guide**

**Overview**

InvestInsight is a comprehensive portfolio reporting and data stewardship platform designed to help investment teams prepare accurate weekly and monthly reports from multiple data sources. The system provides robust data governance capabilities including multi-level approvals, comments, and full audit trails for all key changes.

The application consists of **five primary functional areas**:

- **Home & Start Page**
- **Data Intake & File Management**
- **Data Confirmation & Validation**
- **Data Maintenance Screens**
- **Approvals & Workflow Management**

**Who Uses InvestInsight**

| Role | Responsibilities |
|------|------------------|
| Investment Operations | Drives weekly cashflow reconciliation and report preparation |
| Portfolio Managers/Analysts | Reviews data, adds comments, and initiates corrections |
| Approvers (L1 → L3) | Verify packs and sign off before publishing |
| Administrators | Manages users, roles, and page access |

**Key Outcomes**

- Accurate weekly/monthly portfolio packs published on time
- Transparent data lineage: who changed what, when, and why
- Faster corrections via focused maintenance screens for instruments, prices, durations, betas, and ratings

---

**Monthly Process Workflow**

**Purpose**

The Monthly Process Workflow orchestrates the end-to-end monthly reporting cycle, managing state transitions and ensuring proper sequencing of data preparation, validation, and multi-level approvals.

**Workflow States**

The workflow progresses through the following sequential states:

```
Start → Create Report Batch → Prepare Data → Run Calculations → [Calculations Successful?]
                                                                        │
                    ┌───────────────────────────────────────────────────┘
                    ▼
              [If Yes] → Publish Draft Reports → Approve First Level → [First Level Approved?]
                                                                                │
                                         ┌──────────────────────────────────────┘
                                         ▼
                                   [If Yes] → Approve Second Level → [Second Level Approved?]
                                                                              │
                                              ┌───────────────────────────────┘
                                              ▼
                                        [If Yes] → Approve Third Level → [Third Level Approved?]
                                                                                  │
                                               ┌──────────────────────────────────┘
                                               ▼
                                         [If Yes] → Publish Final Reports → Pending Complete → Complete → End
                                               │
                                         [If No at any level] → Clear Calculations → (loops back to Prepare Data)
```

**State Descriptions**

| State | Description | Access Restrictions |
|-------|-------------|---------------------|
| Create Report Batch | Initial state when a new reporting period is created | Full access to all screens |
| Data Preparation | All file uploads, data maintenance, and data confirmation checks are performed | File uploads and maintenance screens accessible |
| First Approval | Initial review of data completeness and key checks | File uploads and maintenance screens become **inaccessible** |
| Second Approval | Portfolio-level confirmation and risk checks | Remains restricted |
| Final Approval | Final sign-off; if rejected, must provide a reason | Remains restricted |
| Complete | Batch is finalized and reports are ready for distribution | Read-only |

**Rejection Behavior**

- Rejecting at **any approval level** returns the workflow to the Data Preparation phase
- Clear Calculations is executed before returning to Data Preparation
- Rejection reasons are required for L3 rejections and captured in audit logs

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/monthly-runs/{ReportDate}` | Start the monthly process for a given date |
| POST | `/approve-logs/{ReportBatchId}` | Submit approval/rejection for a report batch |
| GET | `/approve-logs/{ReportBatchId}` | Retrieve approval/rejection log for a report batch |
| GET | `/approve-logs/{ReportBatchId}/{Type}` | Retrieve specific approval log by type |
| GET | `/report-batches` | Get all monthly report batches |
| GET | `/process-logs` | Get all monthly process logs |

**Approval Log Data Structure**

| Field | Type | Description |
|-------|------|-------------|
| ReportBatchId | Integer | Identifier for the report batch |
| Type | String | Approval type: "Data Preparation", "Level 1", "Level 2", "Level 3" |
| Status | String | Approval status |
| Username | String | User who performed the action |
| Date | String | Date of the action |
| Time | String | Time of the action |
| RejectReason | String | Reason for rejection (if applicable) |

---

**Screen 1: Start Page**

**Purpose**

The Start Page serves as the high-level entry point for users to kick off new report batches and monitor the current status of active reporting cycles. It provides an at-a-glance view of the system's operational state.

**Functional Requirements**

- **Create New Batch**: Button to initiate a new weekly or monthly report batch
- **Current Status Display**: Shows the active batch's workflow state and progress
- **Quick Navigation**: Links to Data Confirmation and key maintenance screens
- **Batch History**: Access to historical batches and their completion status

**Behaviour**

- When a new batch is created, the system sets up required tasks and transitions to Data Preparation phase
- The current batch status updates dynamically based on workflow transitions
- Users can view but not modify completed batches

---

**Screen 2: File Uploads (Portfolio Imports & Other Imports)**

**Purpose**

The File Uploads screens allow users to bring portfolio data and other required files into the application via SFTP or manual file uploads. The screens are organized into two dashboards: Portfolio Imports for portfolio-specific data files, and Other Imports for shared reference data files.

---

**Portfolio Imports Dashboard**

**Purpose**

To provide a matrix view of all portfolio files, organized by portfolio and file type, enabling quick identification of file upload status and management actions.

**Dashboard Layout**

The Portfolio Imports Dashboard displays a **grid matrix** structure:

- **Rows**: One row per portfolio (e.g., Sanlam, Portfolio A, Portfolio B, etc.)
- **Columns**: One column per file type required for each portfolio

**File Type Columns:**

| Column | Description |
|--------|-------------|
| Holdings | Portfolio holdings data file |
| Transactions | Transaction history file |
| Instrument Static | Static instrument data file |
| Income | Income data file |
| Cash | Cash position data file |
| Performance | Performance data file |
| Management Fees | Management fee data file |

**Status Icons**

Each cell in the matrix displays a **clickable status icon** indicating the current state of that specific file:

| Icon Status | Description |
|-------------|-------------|
| Missing | File has not been uploaded yet |
| Busy | File is currently being processed/validated |
| Failed | File upload or validation has failed |
| Complete | File has been successfully uploaded and validated |

**Icon Click Behaviour**

Clicking on any status icon opens a **popup modal** with the following functionality:

- **View Status**: Displays current file status and details
- **Upload File**: Allows user to upload/replace the file
- **Cancel File**: Cancel an in-progress or uploaded file
- **View Errors**: If the file has failed, displays detailed error records and validation issues

---

**Other Imports Dashboard**

**Purpose**

To manage non-portfolio-specific files such as index data, Bloomberg feeds, and custodian files in a simplified single-column format.

**Dashboard Layout**

The Other Imports Dashboard displays a **simple list** structure:

- **Rows**: One row per file type/source
- **Column**: Single clickable status icon per row

**File Types:**

| Row | Description |
|-----|-------------|
| Monthly Index Files | Index price data files for the reporting period |
| Bloomberg Credit Ratings | Credit rating data from Bloomberg |
| Bloomberg Holdings | Holdings data from Bloomberg |
| Custodian Files | Custodian data files (holdings, transactions, cash, fees) |

**Status Icons**

Each row displays a **clickable status icon** with the same states as the Portfolio Imports Dashboard:

| Icon Status | Description |
|-------------|-------------|
| Missing | File has not been uploaded yet |
| Busy | File is currently being processed/validated |
| Failed | File upload or validation has failed |
| Complete | File has been successfully uploaded and validated |

**Icon Click Behaviour**

Clicking on any status icon opens a **popup modal** with identical functionality to the Portfolio Imports Dashboard:

- **View Status**: Displays current file status and details
- **Upload File**: Allows user to upload/replace the file
- **Cancel File**: Cancel an in-progress or uploaded file
- **View Errors**: If the file has failed, displays detailed error records and validation issues

---

**Shared Functional Requirements**

- **SFTP Import**: Trigger automatic import of files from configured SFTP folder
- **Manual Upload**: Upload files directly through the popup interface
- **Re-import**: Re-import all files for a given portfolio
- **Export**: Export uploaded file data
- **Retry Validation**: Re-run validation on a file after corrections

**File Fault Viewing**

Within the popup modal for each file:
- Faults are displayed with error codes and descriptions
- Validation errors and data quality issues are clearly identified
- Users can retry validation after making corrections to source files

**Access Restrictions**

- **Data Preparation Phase**: Full access to upload, cancel, and modify files
- **After First Approval**: File upload screens become **inaccessible** until a rejection returns the workflow to Data Preparation phase

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolio-files` | Get list of all portfolio files (matrix data) |
| GET | `/portfolio-file` | Get file details by FileType and PortfolioId |
| GET | `/other-files` | Get list of all other files |
| GET | `/other-file` | Get file details by FileType |
| POST | `/file/upload` | Upload a file |
| DELETE | `/file` | Cancel a file by FileLogId |
| POST | `/file` (RetryValidation) | Retry validation for a file |
| GET | `/file/faults` | Get all faults of uploaded files |
| POST | `/file-reimport/{PortfolioId}` | Reimport all files for a portfolio |
| POST | `/sftp-import` | Import files from SFTP folder |
| GET | `/file` (Export) | Export uploaded file |

---

**Screen 3: Data Confirmation**

**Purpose**

Data Confirmation provides a single consolidated view to verify that all required data is complete and valid before proceeding to approvals. It guides users to specific fixes when issues are detected.

**Screen Components**

**Tab Structure**

The Data Confirmation screen is organized into tabs:

1. **Main File Checks Tab** - Verifies portfolio and custodian data completeness
2. **Other Checks Tab** - Validates reference data (instruments, prices, ratings, durations, betas)
3. **Portfolio Re-imports Tab** - Manages re-import status for portfolios

**Main File Checks Grid**

**Portfolio Manager Data:**

| Field | Type | Description |
|-------|------|-------------|
| PortfolioCode | String | Portfolio identifier |
| HoldingDataComplete | String | Holding data status |
| TransactionDataComplete | String | Transaction data status |
| IncomeDataComplete | String | Income data status |
| CashDataComplete | String | Cash data status |
| PerformanceDataComplete | String | Performance data status |
| ManagementFeeDataComplete | String | Management fee data status |

**Custodian Data:**

| Field | Type | Description |
|-------|------|-------------|
| PortfolioCode | String | Portfolio identifier |
| CustodianHoldingDataComplete | String | Custodian holding status |
| CustodianTransactionDataComplete | String | Custodian transaction status |
| CustodianCashDataComplete | String | Custodian cash status |
| CustodianFeeDataComplete | String | Custodian fee status |

**Bloomberg Holdings:**

| Field | Type | Description |
|-------|------|-------------|
| PortfolioCode | String | Portfolio identifier |
| BloombergHoldingDataComplete | String | Bloomberg holding status |

**Other Checks Summary**

| Check Type | Description |
|------------|-------------|
| Index Price Incomplete Count | Number of missing index prices |
| Instrument Incomplete Count | Number of incomplete instruments |
| Credit Rating Incomplete Count | Number of missing credit ratings |
| Instrument Duration Incomplete Count | Number of missing duration entries |
| Instrument Beta Incomplete Count | Number of missing beta entries |

**Functional Requirements**

- **Status Indicators**: Visual indicators (green/red) showing completion status
- **Direct Navigation**: Click-through to specific maintenance screens to resolve issues
- **Refresh**: Real-time refresh of check statuses
- **Export**: Export check results for external review

**Behaviour**

- All tabs must show "green" (complete) status before proceeding to approvals
- Clicking on an incomplete item navigates to the appropriate fix screen
- Check results update automatically when data is modified

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/check-file-completeness` | Get file completeness checks |
| GET | `/check-main-data-completeness` | Get main data completeness checks |
| GET | `/check-other-data-completeness` | Get other data completeness checks |

---

**Screen 4: Instruments Maintenance**

**Purpose**

The Instruments screen allows users to create, update, and manage instrument master data with full audit trail support.

**Main Grid**

Displays all instruments in the system.

**Grid Fields:**

| Field | Type | Description |
|-------|------|-------------|
| Id | Integer | Unique instrument identifier |
| InstrumentCode | String | Instrument code |
| ISIN | String | International Securities Identification Number |
| InstrumentName | String | Descriptive name |
| InstrumentType | String | Type classification |
| AssetClassTreeId | Integer | Asset class hierarchy reference |
| CurrencyId | Integer | Currency reference |
| CountryId | Integer | Country of issue reference |
| IssuerId | Integer | Issuer reference |
| MaturityDate | String | Maturity date (if applicable) |
| Status | String | Instrument status |
| LastChangedUser | String | User who last modified |
| LastChangedDate | String | Date of last modification |

**Functional Requirements**

- **Add New Instrument**: Create new instrument master record
- **Edit Instrument**: Modify existing instrument attributes
- **Delete Instrument**: Remove instrument (soft delete with audit)
- **View History**: Access full audit trail for an instrument
- **Export ISINs**: Export ISINs for incomplete instruments to Excel
- **Search/Filter**: Filter by code, name, type, status

**Audit Trail View**

Each instrument maintains a complete audit history showing:
- Previous and current values for each field
- User who made the change
- Timestamp of the change

**Access Restrictions**

- **Data Preparation Phase**: Full CRUD access
- **After First Approval**: Read-only until rejection

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/instruments` | Get all instruments |
| POST | `/instruments` | Create new instrument |
| GET | `/instruments/{Id}` | Get instrument by ID |
| PUT | `/instruments/{Id}` | Update instrument |
| DELETE | `/instruments/{Id}` | Delete instrument |
| GET | `/instruments-audit-trail/{InstrumentId}` | Get instrument audit trail |
| GET | `/instruments-full-audit-trail` | Get full instruments audit trail |
| GET | `/instruments-assetclassid` | Get AssetClassTreeId by InstrumentId |
| GET | `/isin/export` | Export incomplete ISINs to Excel |

---

**Screen 5: Index Prices Maintenance**

**Purpose**

The Index Prices screen enables users to upload, update, and view index price data with full history tracking.

**Main Grid**

Displays all index prices for the current reporting batch.

**Grid Fields:**

| Field | Type | Description |
|-------|------|-------------|
| Id | Integer | Unique price record identifier |
| ReportBatchId | Integer | Associated report batch |
| ReportDate | String | Price date |
| ReportBatchType | String | Batch type (Weekly/Monthly) |
| IndexId | Integer | Index reference |
| IndexCode | String | Index code |
| IndexBloombergTicker | String | Bloomberg ticker |
| Price | Double | Price value |
| Status | String | Price status |

**Functional Requirements**

- **Add Price**: Enter new index price for current batch
- **Update Price**: Modify existing price entry
- **Delete Price**: Remove price entry
- **Upload Prices**: Bulk upload price file
- **View History**: Access price history for a specific index
- **Quick Pop-up**: Rapid view to resolve price gaps

**Price History View**

For each index, users can view:
- Historical prices across reporting periods
- Price trends and changes
- Associated audit information

**Write Operations Data Structure**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ReportBatchId | Integer | Yes | Report batch reference |
| IndexId | Integer | Yes | Index reference |
| Price | Double | Yes | Price value |
| LastChangedUser | String | No | User making the change |

**Access Restrictions**

- **Data Preparation Phase**: Full CRUD access
- **After First Approval**: Read-only until rejection

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/index-prices` | Get all index prices |
| POST | `/index-prices` | Create new index price |
| GET | `/index-prices/{Id}` | Get index price by ID |
| PUT | `/index-prices/{Id}` | Update index price |
| DELETE | `/index-prices/{Id}` | Delete index price |
| GET | `/index-prices-history/{Id}` | Get price history for an index |

---

**Screen 6: Durations & YTM Maintenance**

**Purpose**

The Durations & YTM screen allows maintenance of instrument duration and yield-to-maturity data with comprehensive audit tracking.

**Main Grid**

Displays all duration entries for the current reporting batch.

**Grid Fields:**

| Field | Type | Description |
|-------|------|-------------|
| Id | Integer | Unique duration record identifier |
| InstrumentId | Integer | Associated instrument |
| InstrumentCode | String | Instrument code |
| ISIN | String | ISIN |
| Duration | Double | Duration value |
| YTM | Double | Yield to maturity |
| ReportBatchId | Integer | Report batch reference |
| Status | String | Entry status |
| LastChangedUser | String | User who last modified |

**Outstanding Durations Grid**

Shows instruments missing duration data for the current batch:
- InstrumentId
- InstrumentCode
- ISIN
- InstrumentName

**Functional Requirements**

- **Add Duration Entry**: Create new duration/YTM record
- **Edit Duration**: Modify existing duration values
- **Delete Duration**: Remove duration entry
- **View Outstanding**: See instruments missing duration data
- **View Audit Trail**: Access full audit history

**Access Restrictions**

- **Data Preparation Phase**: Full CRUD access
- **After First Approval**: Read-only until rejection

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/instrument-duration` | Get all instrument durations for current batch |
| POST | `/instrument-duration` | Create new duration entry |
| GET | `/instrument-duration/{Id}` | Get duration by ID |
| PUT | `/instrument-duration/{Id}` | Update duration entry |
| DELETE | `/instrument-duration/{Id}` | Delete duration entry |
| GET | `/instrument-duration-outstanding` | Get instruments missing duration |
| GET | `/instrument-duration-audit-trail/{Id}` | Get duration audit trail |
| GET | `/instrument-duration-full-audit-trail` | Get full duration audit trail |

---

**Screen 7: Instrument Betas Maintenance**

**Purpose**

The Instrument Betas screen enables maintenance of instrument beta values with full audit capabilities.

**Main Grid**

Displays all beta entries for the current reporting batch.

**Grid Fields:**

| Field | Type | Description |
|-------|------|-------------|
| Id | Integer | Unique beta record identifier |
| InstrumentId | Integer | Associated instrument |
| InstrumentCode | String | Instrument code |
| ISIN | String | ISIN |
| Beta | Double | Beta value |
| ReportBatchId | Integer | Report batch reference |
| Status | String | Entry status |
| LastChangedUser | String | User who last modified |

**Outstanding Betas Grid**

Shows instruments missing beta data for the current batch.

**Functional Requirements**

- **Add Beta Entry**: Create new beta record
- **Edit Beta**: Modify existing beta value
- **Delete Beta**: Remove beta entry
- **View Outstanding**: See instruments missing beta data
- **View Audit Trail**: Access full audit history

**Access Restrictions**

- **Data Preparation Phase**: Full CRUD access
- **After First Approval**: Read-only until rejection

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/instrument-beta` | Get all instrument betas for current batch |
| POST | `/instrument-beta` | Create new beta entry |
| GET | `/instrument-beta/{Id}` | Get beta by ID |
| PUT | `/instrument-beta/{Id}` | Update beta entry |
| DELETE | `/instrument-beta/{Id}` | Delete beta entry |
| GET | `/instrument-beta-outstanding` | Get instruments missing beta |
| GET | `/instrument-beta-audit-trail/{Id}` | Get beta audit trail |
| GET | `/instrument-beta-full-audit-trail` | Get full beta audit trail |

---

**Screen 8: Credit Ratings Maintenance**

**Purpose**

The Credit Ratings screen allows users to manage credit rating data for instruments and view rating changes across portfolios.

**Main Grid**

Displays all credit ratings for instruments.

**Grid Fields:**

| Field | Type | Description |
|-------|------|-------------|
| Id | Integer | Unique rating record identifier |
| InstrumentId | Integer | Associated instrument |
| InstrumentCode | String | Instrument code |
| ISIN | String | ISIN |
| Country | String | Country |
| RatingAgencyId | Integer | Rating agency reference |
| RatingScaleId | Integer | Rating scale reference |
| NationalRating | String | National scale rating |
| InternationalRating | String | International scale rating |
| FinalRatingNational | String | Final national rating |
| FinalRatingInternational | String | Final international rating |
| EffectiveDate | String | Rating effective date |
| LastChangedUser | String | User who last modified |

**Rating Changes View**

Displays changes in credit ratings:

| Field | Type | Description |
|-------|------|-------------|
| ReportDate | String | Report date |
| InstrumentCode | String | Instrument code |
| ISIN | String | ISIN |
| Country | String | Country |
| FinalRatingNational | String | Current national rating |
| PreviousFinalRatingNational | String | Previous national rating |
| FinalRatingInternational | String | Current international rating |
| PreviousFinalRatingInternational | String | Previous international rating |

**Functional Requirements**

- **Add Rating**: Create new credit rating
- **Edit Rating**: Modify existing rating
- **Delete Rating**: Remove rating entry
- **View History**: Access rating history for an instrument
- **View Changes**: See rating changes across the portfolio
- **Retry Decision Flow**: Re-run credit rating decision flow

**Access Restrictions**

- **Data Preparation Phase**: Full CRUD access
- **After First Approval**: Read-only until rejection

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/credit-ratings` | Get all credit ratings |
| POST | `/credit-ratings` | Create new credit rating |
| GET | `/credit-ratings/{Id}` | Get credit rating by ID |
| PUT | `/credit-ratings/{Id}` | Update credit rating |
| DELETE | `/credit-ratings/{Id}` | Delete credit rating |
| GET | `/credit-rating-audit-trail/{Id}` | Get rating audit trail |
| GET | `/credit-rating-full-audit-trail` | Get full rating audit trail |
| GET | `/credit-ratings-history/{InstrumentId}` | Get rating history for instrument |
| POST | `/credit-ratings-decision-flow/{ReportBatchId}` | Retry credit rating decision flow |

---

**Screen 9: Report Comments**

**Purpose**

The Report Comments screen allows users to capture commentary tied to specific reports within a reporting period.

**Main Grid**

Displays all report comments for the current batch.

**Grid Fields:**

| Field | Type | Description |
|-------|------|-------------|
| Id | Integer | Unique comment identifier |
| ReportBatchId | Integer | Report batch reference |
| ReportDate | String | Report date |
| ReportListId | String | Report reference |
| ReportListName | String | Report name |
| Comment | String | Commentary text |
| LastChangedUser | String | User who last modified |

**Functional Requirements**

- **Add Comment**: Create new report comment
- **Edit Comment**: Modify existing comment
- **Delete Comment**: Remove comment
- **Link to Report**: Associate comment with specific report

**Write Operations Data Structure**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| ReportBatchId | Integer | Yes | Report batch reference |
| ReportListId | String | Yes | Report reference |
| Comment | String | Yes | Commentary text |
| LastChangedUser | String | Yes | User making the change |

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/report-comments` | Get all report comments |
| POST | `/report-comments` | Create new comment |
| GET | `/report-comments/{Id}` | Get comment by ID |
| PUT | `/report-comments/{Id}` | Update comment |
| DELETE | `/report-comments/{Id}` | Delete comment |

---

**Screen 10: Approvals (L1, L2, L3)**

**Purpose**

The Approvals screens provide sequential sign-off capabilities with three levels of review. Rejection at any level returns the workflow to the Data Preparation phase with reasons captured.

**Approval Levels**

| Level | Purpose | Reviewer Focus |
|-------|---------|----------------|
| Level 1 | Initial review | Data completeness and key checks |
| Level 2 | Portfolio confirmation | Portfolio-level confirmation and risk checks |
| Level 3 | Final sign-off | Complete review; rejection requires reason |

**Screen Components**

**Approval Dashboard**

Each approval level displays:
- Current batch status
- Data check summary
- Report comments
- Previous approval history

**Approval Actions**

| Action | Description |
|--------|-------------|
| Approve | Advance to next workflow stage |
| Reject | Return to Data Preparation phase; reason required for L3 |

**Functional Requirements**

- **Review Data Checks**: View all data confirmation results
- **Review Comments**: See all report comments
- **Approve**: Sign off and advance workflow
- **Reject with Reason**: Return to Data Preparation with mandatory reason

**Behaviour**

- Approving at each level advances to the next stage
- Rejecting at **any level** returns to Data Preparation phase
- L3 rejection **requires** a reason to be entered
- All approval/rejection actions are logged with timestamp and user

---

**Screen 11: Process Logs**

**Purpose**

The Process Logs screens provide evidence for operations teams and support debugging of workflow issues.

**Log Types**

**File Process Logs**

Tracks each file's journey through the system:
- Upload timestamp
- Validation status
- Faults encountered
- Processing completion

**Monthly Process Logs**

Records end-to-end workflow execution:

| Field | Type | Description |
|-------|------|-------------|
| ReportBatchId | Integer | Report batch reference |
| ReportDate | String | Report date |
| EventName | String | Workflow event name |
| ExecutedAt | String | Execution timestamp |
| LastExecutedActivityName | String | Last activity executed |

**Calculation Logs**

Tracks calculation execution:

| Field | Type | Description |
|-------|------|-------------|
| CalculationLogId | Integer | Log identifier |
| CalculationName | String | Calculation name |
| CalculationStatus | String | Execution status |
| StartTime | String | Start timestamp |
| EndTime | String | End timestamp |
| ViewErrors | String | Link to error details |

**Calculation Log Errors**

| Field | Type | Description |
|-------|------|-------------|
| CalculationLogErrorId | Integer | Error identifier |
| CalculationName | String | Calculation name |
| CalculationStatus | String | Status |
| StartTime | String | Start timestamp |
| EndTime | String | End timestamp |
| ErrorPrefix | String | Error category |
| FullError | String | Complete error message |

**API Endpoints**

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/process-logs` | Get file process logs |
| GET | `/calculation-logs` | Get calculation logs |
| GET | `/calculation-log-errors` | Get calculation log errors |

---

**Screen 12: Administration**

**Purpose**

The Administration screens enable management of users, roles, and page access with all state-changing actions protected by audit trails.

**Functional Areas**

**User Management**
- Create, update, deactivate users
- Assign roles to users
- View user activity

**Role Management**
- Define roles with specific permissions
- Assign page access to roles
- Configure approval authorities

**Page Access**
- Control which roles can access which screens
- Configure read-only vs. full access
- Manage feature toggles

---

**Reference Data Maintenance**

**Purpose**

Several reference data screens support the core functionality with full CRUD operations and audit trails.

**Available Reference Data Screens**

| Screen | API Endpoint | Description |
|--------|--------------|-------------|
| Countries | `/countries` | Manage country reference data |
| Currencies | `/currencies` | Manage currency reference data |
| Asset Managers | `/asset-managers` | Manage asset manager records |
| Portfolios | `/portfolios` | Manage portfolio definitions |
| Indexes | `/indexes` | Manage index master data |
| Benchmarks | `/benchmarks` | Manage benchmark definitions |
| Credit Rating Scales | `/credit-rating-scales` | Manage rating scale definitions |
| Transforms | `/transforms` | Manage data transform configurations |
| Management Fee Rates | `/management-fee-rates` | Manage fee rate schedules |
| Custody Fee Rates | `/custody-fee-rates` | Manage custody fee schedules |
| File Settings | `/file-settings` | Configure file import settings |
| Report List | `/report-list` | Manage report definitions |

**All reference data screens support:**
- Full CRUD operations (Create, Read, Update, Delete)
- Audit trail per record
- Full table audit trail view
- Search and filter capabilities

---

**Quality & Governance Features**

| Feature | Description |
|---------|-------------|
| Full Audit Trails | Dedicated views for every master data entity showing all changes |
| History Views | Quick comparisons across dates/versions |
| Guided Checks | Data Confirmation funnels users to what matters |
| Rejection Reasons | Enforced rationale for L3 rejections; aids traceability |
| State-Based Access | Screens locked after approval to prevent unauthorized changes |

---

**Glossary**

| Term | Definition |
|------|------------|
| Batch | A discrete reporting period (typically weekly or monthly) |
| Data Confirmation | Guided verification steps to ensure readiness for approval |
| L1/L2/L3 | Staged approvals with increasing scrutiny at each level |
| Maintenance Screens | Focused areas to correct or enrich data |
| Workflow Instance | A specific execution of the monthly reporting workflow |
| ISIN | International Securities Identification Number |
| YTM | Yield to Maturity |
| Beta | A measure of an asset's volatility relative to the market |
| Duration | A measure of interest rate sensitivity |

---

**Role-Based Journeys**

**Operations Lead:**
1. Start new batch → 
2. Trigger/verify imports → 
3. Work Data Confirmation → 
4. Assign fixes → 
5. Nudge L1

**Analyst:**
1. Investigate Data Confirmation issues → 
2. Update instruments/prices/durations/betas/ratings → 
3. Add report comments

**Approver (L1/L2/L3):**
1. Open Approvals → 
2. Review data checks & comments → 
3. Approve or Reject with reason

**Administrator:**
1. Manage users/roles → 
2. Adjust page access → 
3. Support audit inquiries

---

**Getting Started (New Teammate)**

1. **Skim Start Page** and Data Confirmation to understand the current week's health
2. **Click into Index Prices** and Instruments to see how edits and audits look
3. **Open Approvals** to understand the stages and what reviewers check
4. **Review the Monthly Process Workflow** diagram to understand state transitions

---

**Technical Notes**

- Reports are generated in Power BI and sit externally to this system
- This system is a **data preparation and approval system** for those external reports
- The Publish/Complete phase is a backend function only
- Weekly flow (Cashflow Capture) is handled separately and currently excluded from this guide
