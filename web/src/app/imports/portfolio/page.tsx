'use client';

/**
 * Portfolio Imports Dashboard - Matrix View
 *
 * Displays portfolio files in a grid with:
 * - Portfolios as rows
 * - File types as columns
 * - Color-coded status icons for each cell
 */

import React, { useEffect, useState } from 'react';
import { fileImporterGet } from '@/lib/api/client';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusIcon } from '@/components/file-import/StatusIcon';
import { FileUploadModal } from '@/components/file-import/FileUploadModal';
import { useWorkflowAccessControl } from '@/hooks/useWorkflowAccessControl';
import type {
  Portfolio,
  PortfolioFile,
  PortfolioFilesResponse,
  FileDetails,
  FileStatusColor,
} from '@/types/file-import';

const FILE_TYPE_COLUMNS = [
  'Holdings',
  'Transactions',
  'Instrument Static',
  'Income',
  'Cash',
  'Performance',
  'Management Fees',
];

function getReportMonthYear(reportDate?: string): {
  month: string;
  year: number;
} {
  const date = reportDate ? new Date(reportDate) : new Date();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return {
    month: monthNames[date.getMonth()],
    year: date.getFullYear(),
  };
}

export default function PortfolioImportsPage() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    portfolio: Portfolio;
    file: PortfolioFile;
  } | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);

  // Use the workflow access control hook - provides batch and lock state
  const {
    isLocked,
    isLoading: accessLoading,
    error: accessError,
    currentBatch,
  } = useWorkflowAccessControl();

  // Fetch portfolios - trigger when access check completes
  useEffect(() => {
    // Wait for access control to finish loading
    if (accessLoading) return;

    let cancelled = false;

    const fetchPortfolios = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use batch date if available, otherwise use fallback
        const { month: reportMonth, year: reportYear } = getReportMonthYear(
          currentBatch?.ReportDate,
        );

        const response = await fileImporterGet<PortfolioFilesResponse>(
          '/portfolio-files',
          {
            ReportMonth: reportMonth,
            ReportYear: reportYear,
          },
        );

        if (!cancelled) {
          setPortfolios(response.Portfolios || []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch portfolios',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPortfolios();

    return () => {
      cancelled = true;
    };
  }, [accessLoading, currentBatch]);

  const handleStatusClick = async (
    portfolio: Portfolio,
    file: PortfolioFile,
  ) => {
    setSelectedFile({ portfolio, file });

    // If we have complete file data from the portfolios response, use it
    if (file.FileName) {
      setFileDetails({
        FileLogId: file.FileLogId,
        FileSettingId: file.FileSettingId,
        FileFormatId: file.FileFormatId,
        FileTypeId: file.FileTypeId,
        ReportBatchId: file.ReportBatchId,
        FileType: file.FileType,
        FileName: file.FileName,
        FileNamePattern: file.FileNamePattern,
        StatusColor: file.StatusColor,
        Message: file.Message,
        Action: file.Action,
        WorkflowInstanceId: file.WorkflowInstanceId,
        WorkflowStatusId: file.WorkflowStatusId,
        StartDate: file.StartDate,
        EndDate: file.EndDate,
        InvalidReasons: file.InvalidReasons,
      });
    } else {
      // Fetch file details from API when we don't have them locally
      try {
        const { month: reportMonth, year: reportYear } = getReportMonthYear(
          currentBatch?.ReportDate,
        );
        const response = await fileImporterGet<{ FileDetails: FileDetails }>(
          '/portfolio-file',
          {
            ReportMonth: reportMonth,
            ReportYear: reportYear,
            PortfolioId: portfolio.PortfolioId,
            FileTypeId: file.FileTypeId,
          },
        );
        if (response?.FileDetails) {
          setFileDetails(response.FileDetails);
        } else {
          setFileDetails(null);
        }
      } catch {
        setFileDetails(null);
      }
    }
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    setFileDetails(null);
  };

  const handleUploadSuccess = () => {
    const { month: reportMonth, year: reportYear } = getReportMonthYear(
      currentBatch?.ReportDate,
    );

    fileImporterGet<PortfolioFilesResponse>('/portfolio-files', {
      ReportMonth: reportMonth,
      ReportYear: reportYear,
    }).then((response) => {
      setPortfolios(response.Portfolios || []);
    });

    handleModalClose();
  };

  const getFileForType = (
    portfolio: Portfolio,
    fileType: string,
  ): PortfolioFile | null => {
    return portfolio.Files.find((f) => f.FileType === fileType) || null;
  };

  if (loading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div
          role="status"
          aria-label="Loading"
          className="flex items-center justify-center h-64"
        >
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <span className="ml-2">Loading...</span>
        </div>
      </main>
    );
  }

  if (error || accessError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Portfolio Imports</h1>
        <div
          role="alert"
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
        >
          An error occurred: {error || accessError}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Portfolio Imports</h1>

      {/* Lock message during approval phases */}
      {isLocked && (
        <div
          role="alert"
          aria-label="Locked"
          className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded mb-6"
        >
          File uploads are locked during approval. You can view file details but
          cannot upload or cancel files.
        </div>
      )}

      {/* Portfolio Files Matrix */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="sticky left-0 bg-white z-10 min-w-[200px]">
                Portfolio
              </TableHead>
              {FILE_TYPE_COLUMNS.map((fileType) => (
                <TableHead key={fileType} className="text-center">
                  {fileType}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody role="presentation">
            {portfolios.map((portfolio) => (
              <TableRow key={portfolio.PortfolioId}>
                <TableCell className="sticky left-0 bg-white font-medium">
                  {portfolio.PortfolioName}
                </TableCell>
                {FILE_TYPE_COLUMNS.map((fileType) => {
                  const file = getFileForType(portfolio, fileType);
                  // Use API status value directly, fallback to ⏱️ (not uploaded) for missing files
                  const statusColor = (file?.StatusColor ||
                    '⏱️') as FileStatusColor;

                  return (
                    <TableCell key={fileType} className="text-center">
                      <StatusIcon
                        statusColor={statusColor}
                        fileType={fileType}
                        onClick={() => {
                          const fileObj: PortfolioFile = file || {
                            FileLogId: 0,
                            FileSettingId: 0,
                            FileFormatId: 0,
                            FileTypeId: 0,
                            ReportBatchId: currentBatch?.ReportBatchId || 0,
                            FileType: fileType,
                            FileName: '',
                            FileNamePattern: '',
                            StatusColor: '⏱️',
                            Message: 'File not uploaded',
                            Action: '',
                            WorkflowInstanceId: '',
                            WorkflowStatusId: 0,
                            StartDate: '',
                            EndDate: '',
                            InvalidReasons: '',
                          };
                          handleStatusClick(portfolio, fileObj);
                        }}
                        readOnly={isLocked}
                      />
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* File Upload Modal */}
      {selectedFile && (
        <FileUploadModal
          isOpen={!!selectedFile}
          onClose={handleModalClose}
          fileType={selectedFile.file.FileType}
          portfolioName={selectedFile.portfolio.PortfolioName}
          statusColor={selectedFile.file.StatusColor}
          fileDetails={fileDetails}
          fileSettingId={selectedFile.file.FileSettingId}
          reportBatchId={selectedFile.file.ReportBatchId}
          fileLogId={selectedFile.file.FileLogId}
          fileFormatId={selectedFile.file.FileFormatId}
          readOnly={isLocked}
          onSuccess={handleUploadSuccess}
        />
      )}
    </main>
  );
}
