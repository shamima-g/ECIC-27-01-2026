'use client';

/**
 * Other Imports Dashboard - List View
 *
 * Displays non-portfolio files in a list format:
 * - Monthly Index Files
 * - Bloomberg Credit Ratings
 * - Bloomberg Holdings
 * - Custodian Files
 *
 * Features:
 * - Color-coded status icons
 * - Auto-refresh for processing files (polling every 5 seconds)
 * - Grouped by file source
 */

import React, { useEffect, useState, useCallback } from 'react';
import { fileImporterGet } from '@/lib/api/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusIcon } from '@/components/file-import/StatusIcon';
import { FileUploadModal } from '@/components/file-import/FileUploadModal';
import { useWorkflowAccessControl } from '@/hooks/useWorkflowAccessControl';
import type {
  OtherFile,
  OtherFilesResponse,
  FileDetails,
  FileStatusColor,
} from '@/types/file-import';

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

export default function OtherImportsPage() {
  const [files, setFiles] = useState<OtherFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<OtherFile | null>(null);
  const [fileDetails, setFileDetails] = useState<FileDetails | null>(null);

  // Use the workflow access control hook - provides batch and lock state
  const {
    isLocked,
    isLoading: accessLoading,
    error: accessError,
    currentBatch,
  } = useWorkflowAccessControl();

  // Fetch files function
  const fetchFiles = useCallback(async () => {
    const { month: reportMonth, year: reportYear } = getReportMonthYear(
      currentBatch?.ReportDate,
    );

    const response = await fileImporterGet<OtherFilesResponse>('/other-files', {
      ReportMonth: reportMonth,
      ReportYear: reportYear,
    });

    setFiles(response.Files || []);
    return response.Files || [];
  }, [currentBatch?.ReportDate]);

  // Initial fetch - trigger when access check completes
  useEffect(() => {
    // Wait for access control to finish loading
    if (accessLoading) return;

    let cancelled = false;

    const loadFiles = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchFiles();
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : 'Failed to fetch files',
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadFiles();

    return () => {
      cancelled = true;
    };
  }, [accessLoading, fetchFiles]);

  // Polling for busy files
  // Handle both emoji (⏳) and legacy (Yellow) status values
  useEffect(() => {
    const hasBusyFiles = files.some(
      (f) => f.StatusColor === '⏳' || f.StatusColor === 'Yellow',
    );

    if (!hasBusyFiles) return;

    // Use non-async callback for better fake timer compatibility in tests
    const intervalId = setInterval(() => {
      fetchFiles().catch(() => {
        // Silently ignore polling errors
      });
    }, 5000);

    return () => clearInterval(intervalId);
  }, [files, fetchFiles]);

  const handleStatusClick = (file: OtherFile) => {
    setSelectedFile(file);
    // Handle both emoji (⏱️) and legacy (Gray) status values for "not uploaded"
    const isNotUploaded =
      file.StatusColor === '⏱️' || file.StatusColor === 'Gray';
    if (!isNotUploaded) {
      setFileDetails({
        FileLogId: file.FileLogId,
        FileSettingId: file.FileSettingId,
        FileFormatId: file.FileFormatId,
        ReportBatchId: file.ReportBatchId,
        FileType: file.FileType,
        FileName: file.FileName,
        FileNamePattern: file.FileNamePattern,
        StatusColor: file.StatusColor,
        Message: file.Message,
        Action: file.Action,
        WorkflowInstanceId: file.WorkflowInstanceId,
        WorkflowStatusName: file.WorkflowStatusName,
        StartDate: file.StartDate,
        EndDate: file.EndDate,
        InvalidReasons: file.InvalidReasons,
      });
    } else {
      setFileDetails(null);
    }
  };

  const handleModalClose = () => {
    setSelectedFile(null);
    setFileDetails(null);
  };

  const handleUploadSuccess = async () => {
    try {
      await fetchFiles();
    } catch {
      // Silently ignore refresh errors
    }
    handleModalClose();
  };

  // Group files by source
  const groupedFiles = files.reduce<Record<string, OtherFile[]>>(
    (acc, file) => {
      const source = file.FileSource || 'Other';
      if (!acc[source]) {
        acc[source] = [];
      }
      acc[source].push(file);
      return acc;
    },
    {},
  );

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
        <h1 className="text-3xl font-bold mb-6">Other Imports</h1>
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
      <h1 className="text-3xl font-bold mb-6">Other Imports</h1>

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

      {/* Files grouped by source */}
      <div className="space-y-6">
        {Object.entries(groupedFiles).map(([source, sourceFiles]) => (
          <Card key={source}>
            <CardHeader>
              <CardTitle className="text-lg">{source}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sourceFiles.map((file) => (
                  <div
                    key={`${file.FileLogId}-${file.FileType}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
                  >
                    <span className="font-medium">{file.FileType}</span>
                    <StatusIcon
                      statusColor={file.StatusColor as FileStatusColor}
                      fileType={file.FileType}
                      onClick={() => handleStatusClick(file)}
                      readOnly={isLocked}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Show all files if no grouping */}
        {Object.keys(groupedFiles).length === 0 && files.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Files</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {files.map((file) => (
                  <div
                    key={`${file.FileLogId}-${file.FileType}`}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100"
                  >
                    <span className="font-medium">{file.FileType}</span>
                    <StatusIcon
                      statusColor={file.StatusColor as FileStatusColor}
                      fileType={file.FileType}
                      onClick={() => handleStatusClick(file)}
                      readOnly={isLocked}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* File Upload Modal */}
      {selectedFile && (
        <FileUploadModal
          isOpen={!!selectedFile}
          onClose={handleModalClose}
          fileType={selectedFile.FileType}
          statusColor={selectedFile.StatusColor}
          fileDetails={fileDetails}
          fileSettingId={selectedFile.FileSettingId}
          reportBatchId={selectedFile.ReportBatchId}
          fileLogId={selectedFile.FileLogId}
          fileFormatId={selectedFile.FileFormatId}
          readOnly={isLocked}
          onSuccess={handleUploadSuccess}
        />
      )}
    </main>
  );
}
