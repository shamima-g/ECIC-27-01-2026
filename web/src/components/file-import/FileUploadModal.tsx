'use client';

/**
 * FileUploadModal - Modal for uploading, canceling, and viewing file details
 *
 * Features:
 * - Upload new files with progress indicator
 * - Cancel/remove uploaded files with confirmation
 * - View file details (name, pattern, date, etc.)
 * - Re-upload files
 * - Export/download uploaded files
 * - View validation errors (for failed files)
 */

import React, { useState, useRef } from 'react';
import { flushSync } from 'react-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  fileImporterGet,
  fileImporterPost,
  fileImporterDel,
} from '@/lib/api/client';
import type { FileDetails } from '@/types/file-import';
import FileValidationErrors from './FileValidationErrors';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileType: string;
  portfolioName?: string;
  statusColor: string;
  fileDetails: FileDetails | null;
  fileSettingId?: number;
  reportBatchId?: number;
  fileLogId?: number;
  fileFormatId?: number;
  readOnly?: boolean;
  onSuccess?: () => void;
}

export function FileUploadModal({
  isOpen,
  onClose,
  fileType,
  portfolioName,
  statusColor,
  fileDetails,
  fileSettingId,
  reportBatchId,
  fileLogId,
  fileFormatId,
  readOnly = false,
  onSuccess,
}: FileUploadModalProps) {
  const [showFileInput, setShowFileInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmCancel, setShowConfirmCancel] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Use fileDetails status if available (fetched from API), otherwise use prop
  // Normalize status color to handle case variations from API
  const rawStatusColor = fileDetails?.StatusColor || statusColor;
  const effectiveStatusColor = rawStatusColor?.toLowerCase() || 'gray';
  const isBusy = effectiveStatusColor === 'yellow';
  const isFailed = effectiveStatusColor === 'red';
  const isComplete = effectiveStatusColor === 'green';
  // isMissing is the default fallback when no other status matches (handles unknown/invalid status values)
  const isMissing = !isComplete && !isFailed && !isBusy;

  const handleUploadClick = () => {
    setShowFileInput(true);
    setError(null);
    setSuccessMessage(null);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!selectedFile) return;

    // Use flushSync to ensure the uploading state renders before the API call
    // This is necessary because mocked API calls may resolve synchronously
    flushSync(() => {
      setIsUploading(true);
      setError(null);
      setUploadProgress(0);
    });

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      await fileImporterPost('/file/upload', formData, {
        params: {
          FileSettingId: fileSettingId,
          ReportBatchId: reportBatchId,
          FileName: selectedFile.name,
        },
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      // Use flushSync to ensure progress bar at 100% is rendered before showing success
      flushSync(() => {
        setIsUploading(false);
      });

      setSuccessMessage('File uploaded successfully, validation in progress');
      setShowFileInput(false);
      setSelectedFile(null);
      onSuccess?.();
    } catch (err) {
      clearInterval(progressInterval);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setIsUploading(false);
    }
  };

  const handleCancelFileClick = () => {
    setShowConfirmCancel(true);
    setError(null);
  };

  const handleConfirmCancel = async () => {
    try {
      setIsDeleting(true);
      setError(null);

      await fileImporterDel('/file', {
        FileLogId: fileDetails?.FileLogId || fileLogId,
      });

      setShowConfirmCancel(false);
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Cancel failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExportFile = async () => {
    try {
      setError(null);

      const blob = await fileImporterGet<Blob>('/file', {
        FilePath: fileDetails?.FileName || '',
      });

      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileDetails?.FileName || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const formatDate = (dateStr: string | null | undefined) => {
    if (!dateStr) return '-';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-modal="true">
        <DialogHeader>
          <DialogTitle>{fileType}</DialogTitle>
          {portfolioName && (
            <DialogDescription>{portfolioName}</DialogDescription>
          )}
        </DialogHeader>

        <div className="space-y-4">
          {/* File Status Display - Prominent status indicator */}
          <div className="border-b pb-3">
            <div className="flex items-center gap-2">
              <span className="font-medium">File Status:</span>
              {isComplete && (
                <span className="text-green-600 font-medium flex items-center gap-1">
                  Complete
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
              {isFailed && (
                <span className="text-red-600 font-medium flex items-center gap-1">
                  Failed
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </span>
              )}
              {isBusy && (
                <span className="text-yellow-600 font-medium">
                  Processing...
                </span>
              )}
              {isMissing && (
                <span className="text-gray-500 font-medium">Not Uploaded</span>
              )}
            </div>
          </div>

          {/* Progress indicator for busy files */}
          {isBusy && (
            <div className="space-y-2">
              <Progress value={50} role="progressbar" />
            </div>
          )}

          {/* Error display */}
          {error && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 p-3 rounded"
            >
              Error: {error}
            </div>
          )}

          {/* Success message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded">
              {successMessage}
            </div>
          )}

          {/* File details section for complete/failed files */}
          {fileDetails && (isComplete || isFailed) && (
            <div className="border rounded p-3 bg-gray-50 space-y-2 text-sm">
              <h4 className="font-medium text-gray-900 border-b pb-1 mb-2">
                File Details
              </h4>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="font-medium text-gray-600">Filename:</span>
                </div>
                <div>{fileDetails.FileName || '-'}</div>

                <div>
                  <span className="font-medium text-gray-600">Pattern:</span>
                </div>
                <div>{fileDetails.FileNamePattern || '-'}</div>

                <div>
                  <span className="font-medium text-gray-600">
                    Upload Date:
                  </span>
                </div>
                <div>{formatDate(fileDetails.StartDate)}</div>

                <div>
                  <span className="font-medium text-gray-600">Validation:</span>
                </div>
                <div>
                  {isComplete && <span className="text-green-600">Passed</span>}
                  {isFailed && <span className="text-red-600">Failed</span>}
                </div>
              </div>
              {fileDetails.Message && (
                <div className="mt-2 pt-2 border-t">
                  <span className="font-medium text-gray-600">Message:</span>{' '}
                  <span className="text-gray-700">{fileDetails.Message}</span>
                </div>
              )}
            </div>
          )}

          {/* Confirm cancel dialog */}
          {showConfirmCancel && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
              <p className="mb-4" data-testid="confirm-message">
                Are you sure you want to cancel this file?
              </p>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleConfirmCancel}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Canceling...' : 'Yes'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setShowConfirmCancel(false)}
                  disabled={isDeleting}
                >
                  No
                </Button>
              </div>
            </div>
          )}

          {/* Upload progress bar - shown outside conditional so it persists during upload */}
          {(isUploading || uploadProgress > 0) && (
            <Progress value={uploadProgress} role="progressbar" />
          )}

          {/* File input for upload */}
          {showFileInput && !readOnly && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-input">Select File</Label>
                <Input
                  id="file-input"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  aria-label="Select file"
                />
              </div>

              {selectedFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {selectedFile.name}
                </p>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={handleUploadSubmit}
                  disabled={!selectedFile || isUploading}
                >
                  {isUploading ? 'Uploading...' : 'Upload'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowFileInput(false);
                    setSelectedFile(null);
                  }}
                  disabled={isUploading}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Action buttons */}
          {!showFileInput && !showConfirmCancel && (
            <div className="flex flex-wrap gap-2">
              {/* Missing file - show Upload button */}
              {isMissing && !readOnly && (
                <Button onClick={handleUploadClick}>Upload File</Button>
              )}

              {/* Complete/Failed file - show Cancel, Re-upload buttons */}
              {(isComplete || isFailed) && !readOnly && (
                <>
                  <Button variant="destructive" onClick={handleCancelFileClick}>
                    Cancel File
                  </Button>
                  <Button variant="outline" onClick={handleUploadClick}>
                    Re-upload
                  </Button>
                </>
              )}

              {/* Busy file - show Cancel button */}
              {isBusy && !readOnly && (
                <Button variant="destructive" onClick={handleCancelFileClick}>
                  Cancel File
                </Button>
              )}

              {/* Complete file - show Export button */}
              {(isComplete || isFailed) && fileDetails && (
                <Button variant="outline" onClick={handleExportFile}>
                  Export File
                </Button>
              )}
            </div>
          )}

          {/* Validation errors section */}
          {isFailed && fileDetails && (
            <FileValidationErrors
              fileLogId={fileDetails.FileLogId}
              fileSettingId={fileDetails.FileSettingId || fileSettingId}
              fileFormatId={fileDetails.FileFormatId || fileFormatId}
              statusColor={effectiveStatusColor}
              hasErrors={true}
              disabled={readOnly}
              onRetrySuccess={onSuccess}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default FileUploadModal;
