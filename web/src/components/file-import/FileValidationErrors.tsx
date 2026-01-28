'use client';

/**
 * FileValidationErrors - Component for viewing and managing validation errors
 *
 * Features:
 * - View errors button that expands to show error list
 * - Paginated error display (10 per page)
 * - Export errors to Excel
 * - Retry validation
 */

import React, { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { fileImporterGet, fileImporterPost } from '@/lib/api/client';
import type { FileFault, FileFaultsResponse } from '@/types/file-import';

interface FileValidationErrorsProps {
  fileLogId: number;
  fileSettingId?: number;
  fileFormatId?: number;
  statusColor: string;
  hasErrors: boolean;
  disabled?: boolean;
  onRetrySuccess?: () => void;
}

const ERRORS_PER_PAGE = 10;

export function FileValidationErrors({
  fileLogId,
  fileSettingId,
  fileFormatId,
  statusColor,
  hasErrors,
  disabled = false,
  onRetrySuccess,
}: FileValidationErrorsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [faults, setFaults] = useState<FileFault[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRetrying, setIsRetrying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchFaults = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fileImporterGet<FileFaultsResponse>(
        '/file/faults',
        {
          FileLogId: fileLogId,
        },
      );

      setFaults(response.FileFault || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch errors');
    } finally {
      setIsLoading(false);
    }
  }, [fileLogId]);

  const handleViewErrors = async () => {
    if (!isExpanded) {
      await fetchFaults();
    }
    setIsExpanded(!isExpanded);
  };

  const handleRetryValidation = async () => {
    try {
      setIsRetrying(true);
      setError(null);
      setSuccessMessage(null);

      const postResponse = await fileImporterPost<{ message?: string }>(
        '/file',
        null,
        {
          params: {
            FileLogId: fileLogId,
            FileSettingId: fileSettingId,
            FileFormatId: fileFormatId,
          },
        },
      );

      // Check if POST response indicates success
      if (postResponse?.message?.toLowerCase().includes('successful')) {
        setSuccessMessage('Validation successful');
        onRetrySuccess?.();
        return;
      }

      // Re-fetch faults to see if validation succeeded
      const response = await fileImporterGet<FileFaultsResponse>(
        '/file/faults',
        {
          FileLogId: fileLogId,
        },
      );

      if ((response.FileFault || []).length === 0) {
        setSuccessMessage('Validation successful');
        onRetrySuccess?.();
      } else {
        setFaults(response.FileFault || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Retry failed');
    } finally {
      setIsRetrying(false);
    }
  };

  const handleExportToExcel = () => {
    // Create CSV content
    const headers = ['Activity', 'Message', 'Exception'];
    const rows = faults.map((fault) => [
      fault.FaultedActivityName,
      fault.Message,
      fault.Exception,
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) =>
        row.map((cell) => `"${(cell || '').replace(/"/g, '""')}"`).join(','),
      ),
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `validation_errors_${fileLogId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (!hasErrors && statusColor?.toLowerCase() !== 'red') {
    return null;
  }

  const totalPages = Math.ceil(faults.length / ERRORS_PER_PAGE);
  const paginatedFaults = faults.slice(
    (currentPage - 1) * ERRORS_PER_PAGE,
    currentPage * ERRORS_PER_PAGE,
  );

  return (
    <div className="mt-4 space-y-4">
      {/* Action buttons - always visible */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleViewErrors}
          aria-expanded={isExpanded}
        >
          {isExpanded ? 'Close' : 'View Errors'}
        </Button>

        <Button
          variant="outline"
          onClick={handleRetryValidation}
          disabled={disabled || isRetrying || !fileSettingId || !fileFormatId}
        >
          {isRetrying ? (
            <>
              <span
                role="progressbar"
                aria-label="Validating"
                className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"
              />
              Validating...
            </>
          ) : (
            'Retry Validation'
          )}
        </Button>
      </div>

      {/* Expandable error details section */}
      {isExpanded && (
        <div className="space-y-4">
          {isLoading && (
            <div className="flex items-center gap-2">
              <span className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              <span>Loading errors...</span>
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 p-3 rounded"
            >
              Error: {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded">
              {successMessage}
            </div>
          )}

          {!isLoading && !error && faults.length > 0 && (
            <>
              <div
                role="alert"
                className="bg-red-50 border border-red-200 text-red-700 p-3 rounded"
              >
                {faults.length} validation error{faults.length !== 1 ? 's' : ''}{' '}
                found
              </div>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Exception</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedFaults.map((fault) => (
                    <TableRow key={fault.Id}>
                      <TableCell className="font-medium">
                        {fault.FaultedActivityName}
                      </TableCell>
                      <TableCell>{fault.Message}</TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {fault.Exception}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
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
                    aria-label="Next page"
                  >
                    Next
                  </Button>
                </div>
              )}

              {/* Export button */}
              <Button variant="outline" onClick={handleExportToExcel}>
                Export Errors to Excel
              </Button>
            </>
          )}

          {!isLoading && !error && faults.length === 0 && (
            <p className="text-muted-foreground">No validation errors found</p>
          )}
        </div>
      )}
    </div>
  );
}

export default FileValidationErrors;
