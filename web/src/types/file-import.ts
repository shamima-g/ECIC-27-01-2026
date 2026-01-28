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
  FileNamePattern: string;
  StatusColor: 'Gray' | 'Yellow' | 'Red' | 'Green';
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
  FileNamePattern: string;
  StatusColor: 'Gray' | 'Yellow' | 'Red' | 'Green';
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

export type FileStatusColor = 'Gray' | 'Yellow' | 'Red' | 'Green';

/**
 * Get ARIA label for file status
 */
export function getStatusAriaLabel(
  statusColor: FileStatusColor,
  fileType: string,
): string {
  switch (statusColor) {
    case 'Gray':
      return `${fileType} - Not uploaded`;
    case 'Yellow':
      return `${fileType} - Processing`;
    case 'Red':
      return `${fileType} - Validation failed`;
    case 'Green':
      return `${fileType} - Complete`;
    default:
      return `${fileType} - Unknown status`;
  }
}

/**
 * Get CSS classes for status color
 */
export function getStatusColorClasses(statusColor: FileStatusColor): string {
  switch (statusColor) {
    case 'Gray':
      return 'bg-gray-200 text-gray-700';
    case 'Yellow':
      return 'bg-yellow-200 text-yellow-800';
    case 'Red':
      return 'bg-red-200 text-red-800';
    case 'Green':
      return 'bg-green-200 text-green-800';
    default:
      return 'bg-gray-200 text-gray-700';
  }
}
