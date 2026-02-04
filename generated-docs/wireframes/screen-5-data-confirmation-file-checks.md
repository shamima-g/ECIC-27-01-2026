# Screen: Data Confirmation - File Checks Tab

## Purpose

Displays a summary of file upload status by showing counts of files per category (AssetManager, Bloomberg, Custodian) to confirm how many files are required and how many have been imported.

## Wireframe

```
+-------------------------------------------------------------------------+
|  InvestInsight - Data Confirmation                                     |
+-------------------------------------------------------------------------+
|                                                                         |
|  Data Confirmation & Validation                                        |
|  ─────────────────────────────────────────────────────────────────────  |
|                                                                         |
|  [ File Checks ]  [ Main Data Checks ]  [ Other Checks ]               |
|  ═══════════════                                                        |
|                                                                         |
|  File Upload Summary                                    [Refresh Icon] |
|                                                                         |
|  +-------------------------------------------------------------------+  |
|  | File Source    | Expected File Count | Actual File Count | Status|  |
|  +-------------------------------------------------------------------+  |
|  | AssetManager   |         12          |        12         |  ✓    |  |
|  | Bloomberg      |          5          |         5         |  ✓    |  |
|  | Custodian      |          8          |         7         |  ✗    |  |
|  +-------------------------------------------------------------------+  |
|                                                                         |
|  Legend:  ✓ Complete   ✗ Incomplete                                    |
|                                                                         |
|                                                                         |
|                                                                         |
|                                                                         |
|                                                                         |
|                                                                         |
|                                                                         |
|                                                                         |
|                                            [Confirm Data Button]       |
|                                                                         |
+-------------------------------------------------------------------------+
```

## Elements

| Element | Type | Description |
|---------|------|-------------|
| Tab Navigation | Tabs Component | Three tabs: File Checks (active), Main Data Checks, Other Checks |
| Refresh Icon | Button | Refreshes the file check data from the API |
| File Summary Table | Table | Displays file source, expected count, actual count, and status |
| Status Indicator | Badge/Icon | Visual indicator showing complete (✓) or incomplete (✗) status |
| Legend | Static Text | Explains status indicators |
| Confirm Data Button | Primary Button | Always visible; confirms data and moves to approval phase |

## User Actions

- **View File Status**: See at-a-glance summary of file upload completeness
- **Refresh Data**: Click refresh icon to update file check status in real-time
- **Navigate Tabs**: Click Main Data Checks or Other Checks tabs to view other validation screens
- **Confirm Data**: Click "Confirm Data" button to submit approval and advance workflow (calls POST `/approve-logs/{ReportBatchId}`)
- **Identify Issues**: Red ✗ indicators show which file sources have missing files

## Data Displayed

### File Summary Table Columns:
- **File Source**: Category of file (AssetManager, Bloomberg, Custodian)
- **Expected File Count**: Number of files required for this reporting batch
- **Actual File Count**: Number of files successfully uploaded
- **Status**: Visual indicator (✓ green for complete, ✗ red for incomplete)

### Status Logic:
- ✓ (Complete): Actual File Count = Expected File Count
- ✗ (Incomplete): Actual File Count < Expected File Count

## Navigation

- **From**: Home/Start Page, or directly from navigation menu
- **To**:
  - Main Data Checks tab (tab navigation)
  - Other Checks tab (tab navigation)
  - File Upload screens (user navigates manually to fix issues)
  - Approval screens (after clicking Confirm Data)

## API Integration

### API Endpoints Used:
- **GET** `/check-file-completeness` - Retrieves file completeness check data
- **POST** `/approve-logs/{ReportBatchId}` - Confirms data (triggered by Confirm Data button)

### Response Structure (GET `/check-file-completeness`):
```typescript
{
  FileSource: string;           // "AssetManager" | "Bloomberg" | "Custodian"
  ExpectedFileCount: number;    // Expected number of files
  ActualFileCount: number;      // Actual number of uploaded files
}[]
```

## Behavior Notes

- This screen is **informational only** - users cannot fix issues directly here
- User must navigate to File Upload screens to resolve missing files
- Status updates automatically when data is modified elsewhere
- Confirm Data button is always enabled (user decides if data is acceptable)
- Refresh icon triggers real-time API call to update displayed data
