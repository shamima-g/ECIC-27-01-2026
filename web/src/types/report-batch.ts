/**
 * Types for Report Batch API responses
 * Based on MonthlyAPIDefinition.yaml
 */

export interface MonthlyReportBatch {
  ReportBatchId: number;
  ReportDate: string;
  WorkflowInstanceId: string;
  WorkflowStatusName: string;
  CreatedAt: string;
  FinishedAt: string | null;
  LastExecutedActivityName: string;
}

export interface MonthlyReportBatchesResponse {
  MonthlyReportBatches: MonthlyReportBatch[];
}

export interface ApproveLog {
  Id: number;
  ReportBatchId: number;
  ReportDate?: string;
  Type: string;
  IsApproved?: boolean;
  User?: string;
  ApprovedBy?: string;
  ApprovedAt?: string;
  Time?: string;
  Status?: string;
  RejectReason?: string;
}

export interface ApproveLogsResponse {
  ApproveLogs: ApproveLog[];
}

export type WorkflowStatus =
  | 'Data Preparation'
  | 'First Approval'
  | 'Second Approval'
  | 'Third Approval'
  | 'Complete';

export const WORKFLOW_STAGES: WorkflowStatus[] = [
  'Data Preparation',
  'First Approval',
  'Second Approval',
  'Third Approval',
  'Complete',
];

export function getWorkflowProgress(status: string): number {
  const index = WORKFLOW_STAGES.indexOf(status as WorkflowStatus);
  if (index === -1) return 0;
  // Calculate percentage based on stage (0-100)
  return Math.round(((index + 1) / WORKFLOW_STAGES.length) * 100);
}

export function getStatusColorClass(status: string): string {
  switch (status) {
    case 'Data Preparation':
      return 'bg-blue-100 text-blue-800';
    case 'First Approval':
    case 'Second Approval':
    case 'Third Approval':
      return 'bg-yellow-100 text-yellow-800';
    case 'Complete':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
