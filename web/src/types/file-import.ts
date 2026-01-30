/**
 * Types for File Import API responses
 * Based on FileImporterAPIDefinition.yaml
 */

export interface PortfolioFile {
  FileLogId: number;
  FileSettingId: number;
  FileFormatId: number;
  FileTypeId: number;
  ReportBatchId: number;
  FileType: string;
  FileName: string;
  FilePath?: string;
  FileNamePattern: string;
  StatusColor: string; // Emoji-based status from API: ✅, ⏱️, ⚠️, ⏳, ‼️
  Message: string;
  Action: string;
  WorkflowInstanceId: string;
  WorkflowStatusId: number;
  StartDate: string;
  EndDate: string;
  InvalidReasons: string;
}

export interface Portfolio {
  PortfolioId: number;
  PortfolioName: string;
  Action: string;
  Files: PortfolioFile[];
}

export interface PortfolioFilesResponse {
  Portfolios: Portfolio[];
}

export interface OtherFile {
  FileLogId: number;
  FileSettingId: number;
  FileSource: string;
  FileFormat: string;
  FileFormatId: number;
  FileType: string;
  ReportBatchId: number;
  FileName: string;
  FilePath?: string;
  FileNamePattern: string;
  StatusColor: string; // Emoji-based status from API: ✅, ⏱️, ⚠️, ⏳, ‼️
  Message: string;
  Action: string;
  WorkflowInstanceId: string;
  WorkflowStatusName: string;
  StartDate: string;
  EndDate: string;
  InvalidReasons: string;
}

export interface OtherFilesResponse {
  Files: OtherFile[];
}

export interface FileDetails {
  FileLogId: number;
  FileSettingId: number;
  FileFormatId: number;
  FileTypeId?: number;
  ReportBatchId: number;
  FileType: string;
  FileName: string;
  FilePath?: string;
  FileNamePattern: string;
  StatusColor: string;
  Message: string;
  Action: string;
  WorkflowInstanceId: string;
  WorkflowStatusId?: number;
  WorkflowStatusName?: string;
  StartDate: string;
  EndDate: string;
  InvalidReasons: string;
}

export interface FileFault {
  Id: number;
  Exception: string;
  Message: string;
  FaultedActivityId: string;
  FaultedActivityName: string;
  Resuming: boolean;
}

export interface FileFaultsResponse {
  FileFault: FileFault[];
}

/**
 * File status values returned from the API
 * These are emoji-based status indicators
 */
export type FileStatusColor =
  | '✅' // Complete - green tick
  | '⏱️' // No file uploaded - gray
  | '⚠️' // Error in file - red/orange
  | '⏳' // File busy uploading - yellow
  | '‼️' // Missing mappings, requires action - red warning
  | string; // Allow other values for backwards compatibility

/**
 * Status display configuration
 */
export interface StatusConfig {
  label: string;
  ariaLabel: string;
  bgColor: string;
  textColor: string;
  icon: string;
  isAnimated?: boolean;
}

/**
 * Get status configuration for a given status color
 */
export function getStatusConfig(statusColor: FileStatusColor): StatusConfig {
  switch (statusColor) {
    case '✅':
      return {
        label: 'Complete',
        ariaLabel: 'Complete',
        bgColor: 'bg-green-500',
        textColor: 'text-white',
        icon: '✓',
        isAnimated: false,
      };
    case '⏱️':
      return {
        label: 'Not Uploaded',
        ariaLabel: 'Not uploaded',
        bgColor: 'bg-gray-300',
        textColor: 'text-gray-600',
        icon: '—',
        isAnimated: false,
      };
    case '⚠️':
      return {
        label: 'Error',
        ariaLabel: 'Error in file',
        bgColor: 'bg-orange-500',
        textColor: 'text-white',
        icon: '⚠',
        isAnimated: false,
      };
    case '⏳':
      return {
        label: 'Processing',
        ariaLabel: 'File busy uploading',
        bgColor: 'bg-yellow-400',
        textColor: 'text-yellow-900',
        icon: '',
        isAnimated: true,
      };
    case '‼️':
      return {
        label: 'Action Required',
        ariaLabel: 'Missing mappings, requires action',
        bgColor: 'bg-red-500',
        textColor: 'text-white',
        icon: '!',
        isAnimated: false,
      };
    // Legacy color name support
    case 'Green':
      return getStatusConfig('✅');
    case 'Gray':
      return getStatusConfig('⏱️');
    case 'Red':
      return getStatusConfig('⚠️');
    case 'Yellow':
      return getStatusConfig('⏳');
    default:
      // Default to "not uploaded" for unknown status
      return {
        label: 'Unknown',
        ariaLabel: 'Unknown status',
        bgColor: 'bg-gray-300',
        textColor: 'text-gray-600',
        icon: '?',
        isAnimated: false,
      };
  }
}

/**
 * Get ARIA label for file status
 */
export function getStatusAriaLabel(
  statusColor: FileStatusColor,
  fileType: string,
): string {
  const config = getStatusConfig(statusColor);
  return `${fileType} - ${config.ariaLabel}`;
}

/**
 * Get CSS classes for status color
 */
export function getStatusColorClasses(statusColor: FileStatusColor): string {
  const config = getStatusConfig(statusColor);
  return `${config.bgColor} ${config.textColor}`;
}
