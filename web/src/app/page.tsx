'use client';

/**
 * InvestInsight Start Page
 *
 * Main dashboard for the portfolio reporting platform
 * Displays current batch status, navigation, and batch history
 */

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { monthlyGet, monthlyPost } from '@/lib/api/client';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type {
  MonthlyReportBatch,
  MonthlyReportBatchesResponse,
  ApproveLog,
  ApproveLogsResponse,
} from '@/types/report-batch';
import { getWorkflowProgress, getStatusColorClass } from '@/types/report-batch';

const ITEMS_PER_PAGE = 10;

export default function HomePage() {
  const [batches, setBatches] = useState<MonthlyReportBatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [expandedBatchId, setExpandedBatchId] = useState<number | null>(null);
  const [approvalLogs, setApprovalLogs] = useState<ApproveLog[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [fileUploadsSubmenuOpen, setFileUploadsSubmenuOpen] = useState(false);
  const [maintenanceSubmenuOpen, setMaintenanceSubmenuOpen] = useState(false);
  const [approvalsSubmenuOpen, setApprovalsSubmenuOpen] = useState(false);
  const [adminSubmenuOpen, setAdminSubmenuOpen] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    let cancelled = false;

    const fetchBatches = async () => {
      try {
        setLoading(true);
        setError(null);
        const response =
          await monthlyGet<MonthlyReportBatchesResponse>('/report-batches');
        if (!cancelled) {
          setBatches(response.MonthlyReportBatches || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch batches',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchBatches();

    return () => {
      cancelled = true;
    };
  }, []);

  // Function to manually trigger refetch
  const refetchBatches = async () => {
    try {
      setLoading(true);
      setError(null);
      const response =
        await monthlyGet<MonthlyReportBatchesResponse>('/report-batches');
      setBatches(response.MonthlyReportBatches || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch batches');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateBatch = async () => {
    try {
      setIsCreating(true);
      setCreateError(null);
      setSuccessMessage(null);
      // Create the batch
      await monthlyPost('/monthly-report-batch');
      setSuccessMessage('Batch created successfully');
      // Refresh the batches list
      refetchBatches();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : 'Failed to create batch',
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleRowClick = async (batch: MonthlyReportBatch) => {
    if (expandedBatchId === batch.ReportBatchId) {
      setExpandedBatchId(null);
      setApprovalLogs([]);
    } else {
      setExpandedBatchId(batch.ReportBatchId);
      try {
        const response = await monthlyGet<ApproveLogsResponse>(
          `/approve-logs/${batch.ReportBatchId}`,
        );
        setApprovalLogs(response.ApproveLogs || []);
      } catch {
        setApprovalLogs([]);
      }
    }
  };

  const activeBatch = batches.find((b) => !b.FinishedAt);

  // Business rule: Can only create new batch if no active batch
  // or active batch is in PendingComplete state
  const canCreateBatch =
    !activeBatch || activeBatch.LastExecutedActivityName === 'PendingComplete';

  // For batch history, show all batches sorted by date descending
  // When there's only ONE batch and it's active, don't show it in history
  // (it's already shown prominently in Current Status)
  const sortedBatches = [...batches].sort(
    (a, b) =>
      new Date(b.ReportDate).getTime() - new Date(a.ReportDate).getTime(),
  );

  // Determine which batches to show in history
  // If the only batch is the active batch, hide it from history
  const historyBatches =
    batches.length === 1 && activeBatch ? [] : sortedBatches;

  const totalPages = Math.ceil(historyBatches.length / ITEMS_PER_PAGE);
  const paginatedBatches = historyBatches.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '-';
    // If date includes time, show just the date portion
    if (dateStr.includes('T')) {
      return new Date(dateStr).toLocaleDateString('en-CA'); // YYYY-MM-DD format
    }
    return dateStr;
  };

  const formatDateTime = (dateStr: string | null) => {
    if (!dateStr) return '-';
    // Show date and time for completion timestamps
    if (dateStr.includes('T')) {
      const date = new Date(dateStr);
      return `${date.toLocaleDateString('en-CA')} ${date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`;
    }
    return dateStr;
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div role="status" className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">InvestInsight</h1>
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        >
          An error occurred: {error}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">InvestInsight</h1>

      {/* Navigation Menu */}
      <nav className="mb-8" aria-label="Main navigation">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="relative">
            <button
              type="button"
              className="text-primary hover:underline font-medium"
              onClick={() => setFileUploadsSubmenuOpen(!fileUploadsSubmenuOpen)}
              aria-expanded={fileUploadsSubmenuOpen}
              aria-haspopup="true"
            >
              File Uploads
            </button>
            {fileUploadsSubmenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-[180px]">
                <Link
                  href="/imports/portfolio"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setFileUploadsSubmenuOpen(false)}
                >
                  Portfolio Imports
                </Link>
                <Link
                  href="/imports/other"
                  className="block px-4 py-2 hover:bg-gray-100"
                  onClick={() => setFileUploadsSubmenuOpen(false)}
                >
                  Other Imports
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/data-confirmation"
            className="text-primary hover:underline font-medium"
          >
            Data Confirmation
          </Link>
          <div className="relative">
            <Link
              href="/maintenance"
              className="text-primary hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                setMaintenanceSubmenuOpen(!maintenanceSubmenuOpen);
              }}
            >
              Maintenance
            </Link>
            {maintenanceSubmenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-[180px]">
                <Link
                  href="/maintenance/instruments"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Instruments
                </Link>
                <Link
                  href="/maintenance/index-prices"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Index Prices
                </Link>
                <Link
                  href="/maintenance/durations"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Durations
                </Link>
                <Link
                  href="/maintenance/betas"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Betas
                </Link>
                <Link
                  href="/maintenance/credit-ratings"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Credit Ratings
                </Link>
                <Link
                  href="/maintenance/report-comments"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Report Comments
                </Link>
              </div>
            )}
          </div>
          <div className="relative">
            <Link
              href="/approvals"
              className="text-primary hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                setApprovalsSubmenuOpen(!approvalsSubmenuOpen);
              }}
            >
              Approvals
            </Link>
            {approvalsSubmenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-[150px]">
                <Link
                  href="/approvals/l1"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  L1 Approval
                </Link>
                <Link
                  href="/approvals/l2"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  L2 Approval
                </Link>
                <Link
                  href="/approvals/l3"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  L3 Approval
                </Link>
              </div>
            )}
          </div>
          <Link
            href="/process-logs"
            className="text-primary hover:underline font-medium"
          >
            Process Logs
          </Link>
          <div className="relative">
            <Link
              href="/administration"
              className="text-primary hover:underline font-medium"
              onClick={(e) => {
                e.preventDefault();
                setAdminSubmenuOpen(!adminSubmenuOpen);
              }}
            >
              Administration
            </Link>
            {adminSubmenuOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white border rounded shadow-lg z-10 min-w-[180px]">
                <Link
                  href="/administration/users"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  User Management
                </Link>
                <Link
                  href="/administration/roles"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Role Management
                </Link>
                <Link
                  href="/administration/page-access"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Page Access
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}

      {/* Current Batch Status */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Current Batch Status</CardTitle>
          <CardDescription>
            View the current reporting period status
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeBatch ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">
                  {activeBatch.ReportDate}
                </span>
                <span
                  data-status={activeBatch.LastExecutedActivityName}
                  data-testid={`current-status-badge-${activeBatch.LastExecutedActivityName}`}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColorClass(activeBatch.LastExecutedActivityName)}`}
                >
                  {activeBatch.LastExecutedActivityName}
                </span>
              </div>
              <div>
                <Progress
                  value={getWorkflowProgress(activeBatch.WorkflowStatusName)}
                  aria-valuenow={getWorkflowProgress(
                    activeBatch.WorkflowStatusName,
                  )}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-2">No active batch</p>
              <p className="text-sm text-muted-foreground">
                Create a new batch to begin the reporting cycle
              </p>
            </div>
          )}

          {/* Create New Batch Button */}
          <div className="mt-4">
            <Button
              onClick={handleCreateBatch}
              disabled={isCreating || !canCreateBatch}
            >
              {isCreating ? 'Creating...' : 'Create New Batch'}
            </Button>
            {!canCreateBatch && activeBatch && (
              <p className="mt-2 text-sm text-muted-foreground">
                Cannot create new batch while current batch is in progress
              </p>
            )}
            {createError && (
              <div
                role="alert"
                className="mt-2 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded text-sm"
              >
                {createError}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Link
          href="/imports/portfolio"
          className="block"
          aria-label="Quick action: upload files"
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-lg">Upload Files</CardTitle>
              <CardDescription>
                Import portfolio and other data files
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href="/data-confirmation"
          className="block"
          aria-label="Quick action: check completeness"
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-lg">View Data Confirmation</CardTitle>
              <CardDescription>
                Check data completeness and validation
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link
          href="/approvals"
          className="block"
          aria-label="Quick action: review workflow"
        >
          <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
            <CardHeader>
              <CardTitle className="text-lg">View Approvals</CardTitle>
              <CardDescription>
                Review and approve report batches
              </CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>

      {/* Batch History */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-semibold">Batch History</h2>
        </CardHeader>
        <CardContent>
          {historyBatches.length === 0 ? (
            <p className="text-muted-foreground">No batch history available</p>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Finished</TableHead>
                    <TableHead>Last Activity</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBatches.map((batch, index) => (
                    <React.Fragment
                      key={`${batch.ReportBatchId}-${batch.ReportDate}-${index}`}
                    >
                      <TableRow
                        onClick={() => handleRowClick(batch)}
                        className="cursor-pointer"
                        aria-expanded={expandedBatchId === batch.ReportBatchId}
                      >
                        <TableCell>{batch.ReportDate}</TableCell>
                        <TableCell>
                          <span
                            data-status={batch.WorkflowStatusName}
                            data-testid={`status-badge-${batch.WorkflowStatusName}`}
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(batch.WorkflowStatusName)}`}
                          >
                            {batch.WorkflowStatusName}
                          </span>
                        </TableCell>
                        <TableCell>{formatDate(batch.CreatedAt)}</TableCell>
                        <TableCell>
                          {formatDateTime(batch.FinishedAt)}
                        </TableCell>
                        <TableCell>{batch.LastExecutedActivityName}</TableCell>
                      </TableRow>
                      {expandedBatchId === batch.ReportBatchId && (
                        <TableRow>
                          <TableCell colSpan={5}>
                            <div className="bg-gray-50 p-4 rounded">
                              <h4 className="font-semibold mb-2">
                                Approval Details
                              </h4>
                              {approvalLogs.length > 0 ? (
                                <div className="space-y-2">
                                  {approvalLogs.map((log) => (
                                    <div
                                      key={log.Id}
                                      className="flex items-center gap-4 text-sm"
                                    >
                                      <span className="font-medium">
                                        {log.Type}:
                                      </span>
                                      <span>{log.ApprovedBy || log.User}</span>
                                      <span className="text-muted-foreground">
                                        {log.ApprovedAt || log.Time}
                                      </span>
                                      <span
                                        className={
                                          log.Status === 'Approved' ||
                                          log.IsApproved
                                            ? 'text-green-600'
                                            : 'text-red-600'
                                        }
                                      >
                                        {log.Status ||
                                          (log.IsApproved
                                            ? 'Approved'
                                            : 'Rejected')}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-sm text-muted-foreground">
                                  No approval records found
                                </p>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <nav
                  aria-label="pagination"
                  className="flex items-center justify-center gap-2 mt-4"
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </nav>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
