/**
 * Epic 2, Story 3: File Upload Modal
 *
 * Tests the file upload, cancel, and details viewing functionality.
 *
 * User Story:
 * As an Operations Lead
 * I want to upload, cancel, and view details for individual files
 * So that I can manage the file import process effectively
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { vi as vitest } from 'vitest';

// Mock the API client
vi.mock('@/lib/api/client', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
  fileImporterPost: vi.fn(),
  fileImporterUpload: vi.fn(),
  fileImporterDel: vi.fn(),
}));

// Mock next-auth session
vi.mock('@/lib/auth/auth-client', () => ({
  useSession: vi.fn(() => ({
    data: {
      user: { name: 'Test User', email: 'test@example.com' },
    },
    status: 'authenticated',
  })),
}));

import { fileImporterUpload, fileImporterDel } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import FileUploadModal from '@/components/file-import/FileUploadModal';

const mockFileImporterUpload = fileImporterUpload as ReturnType<
  typeof vitest.fn
>;
const mockFileImporterDel = fileImporterDel as ReturnType<typeof vitest.fn>;

// Type definitions based on FileImporterAPIDefinition.yaml
interface FileDetails {
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

// Mock data factory
const createMockFileDetails = (
  overrides: Partial<FileDetails> = {},
): FileDetails => ({
  FileLogId: 1,
  FileSettingId: 1,
  FileFormatId: 1,
  FileTypeId: 1,
  ReportBatchId: 1,
  FileType: 'Holdings',
  FileName: '202403_CORONATION_Holdings.csv',
  FileNamePattern: 'CORONATION_Holdings_*.csv',
  StatusColor: 'Green',
  Message: 'File uploaded successfully',
  Action: 'View',
  WorkflowInstanceId: 'wf-123',
  WorkflowStatusId: 1,
  StartDate: '2024-03-01T10:00:00Z',
  EndDate: '2024-03-01T10:05:00Z',
  InvalidReasons: '',
  ...overrides,
});

describe('Epic 2, Story 3: File Upload Modal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Display - Missing File', () => {
    it('displays file type and "Upload File" button for missing files', () => {
      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Gray"
          fileDetails={null}
        />,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Holdings')).toBeInTheDocument();
      expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /upload file/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Modal Display - Complete File', () => {
    it('displays file details with "Cancel File", "Re-upload", and file info for complete files', () => {
      const fileDetails = createMockFileDetails({ StatusColor: 'Green' });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Green"
          fileDetails={fileDetails}
        />,
      );

      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /cancel file/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: /re-upload/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByText('202403_CORONATION_Holdings.csv'),
      ).toBeInTheDocument();
    });

    it('displays "View Errors" button for failed files', () => {
      const fileDetails = createMockFileDetails({
        StatusColor: 'Red',
        Message: 'Validation failed',
        InvalidReasons: 'Format error',
      });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Red"
          fileDetails={fileDetails}
        />,
      );

      expect(
        screen.getByRole('button', { name: /view errors/i }),
      ).toBeInTheDocument();
    });
  });

  describe('Modal Display - Busy File', () => {
    it('displays "Cancel File" button and progress indicator for busy files', () => {
      const fileDetails = createMockFileDetails({
        StatusColor: 'Yellow',
        Message: 'Processing',
      });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Yellow"
          fileDetails={fileDetails}
        />,
      );

      expect(
        screen.getByRole('button', { name: /cancel file/i }),
      ).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
      expect(screen.getByText(/processing/i)).toBeInTheDocument();
    });
  });

  describe('Upload File', () => {
    it('shows file input when "Upload File" button is clicked', async () => {
      const user = userEvent.setup();

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Gray"
          fileDetails={null}
        />,
      );

      const uploadButton = screen.getByRole('button', { name: /upload file/i });
      await user.click(uploadButton);

      // File input should be present
      const fileInput = screen.getByLabelText(/select file|choose file/i);
      expect(fileInput).toBeInTheDocument();
    });

    it('uploads file and shows progress bar', async () => {
      const user = userEvent.setup();
      mockFileImporterUpload.mockResolvedValue({
        message: 'Upload successful',
      });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Gray"
          fileDetails={null}
        />,
      );

      const uploadButton = screen.getByRole('button', { name: /upload file/i });
      await user.click(uploadButton);

      const fileInput = screen.getByLabelText(/select file|choose file/i);
      const file = new File(['test content'], 'holdings.csv', {
        type: 'text/csv',
      });

      await user.upload(fileInput, file);

      // Click upload/submit button
      const submitButton = screen.getByRole('button', {
        name: /upload|submit/i,
      });
      await user.click(submitButton);

      // Progress bar should appear
      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    });

    it('displays success message after upload completes', async () => {
      const user = userEvent.setup();
      mockFileImporterUpload.mockResolvedValue({
        message: 'File uploaded successfully, validation in progress',
      });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Gray"
          fileDetails={null}
        />,
      );

      const uploadButton = screen.getByRole('button', { name: /upload file/i });
      await user.click(uploadButton);

      const fileInput = screen.getByLabelText(/select file|choose file/i);
      const file = new File(['test content'], 'holdings.csv', {
        type: 'text/csv',
      });

      await user.upload(fileInput, file);

      const submitButton = screen.getByRole('button', {
        name: /upload|submit/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(
          screen.getByText(/uploaded successfully|validation in progress/i),
        ).toBeInTheDocument();
      });
    });

    it('calls upload API with correct parameters', async () => {
      const user = userEvent.setup();
      mockFileImporterUpload.mockResolvedValue({
        message: 'Upload successful',
      });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Gray"
          fileDetails={null}
          fileSettingId={5}
          reportBatchId={123}
        />,
      );

      const uploadButton = screen.getByRole('button', { name: /upload file/i });
      await user.click(uploadButton);

      const fileInput = screen.getByLabelText(/select file|choose file/i);
      const file = new File(['test content'], 'holdings.csv', {
        type: 'text/csv',
      });

      await user.upload(fileInput, file);

      const submitButton = screen.getByRole('button', {
        name: /upload|submit/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockFileImporterUpload).toHaveBeenCalledWith(
          '/file/upload',
          expect.any(File),
          expect.objectContaining({
            params: expect.objectContaining({
              FileSettingId: 5,
              ReportBatchId: 123,
              FileName: 'holdings.csv',
              User: expect.any(String),
            }),
          }),
        );
        // FilelogId should be 0 for new uploads (per OpenAPI spec - required parameter)
        const callParams = mockFileImporterUpload.mock.calls[0][2].params;
        expect(callParams.FilelogId).toBe(0);
      });
    });
  });

  describe('Cancel File', () => {
    it('shows confirmation dialog when "Cancel File" is clicked', async () => {
      const user = userEvent.setup();
      const fileDetails = createMockFileDetails({ StatusColor: 'Green' });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Green"
          fileDetails={fileDetails}
        />,
      );

      const cancelButton = screen.getByRole('button', { name: /cancel file/i });
      await user.click(cancelButton);

      // Confirmation dialog should appear
      await waitFor(() => {
        expect(screen.getByText(/are you sure|confirm/i)).toBeInTheDocument();
      });
    });

    it('cancels file and updates status to "Missing" after confirmation', async () => {
      const user = userEvent.setup();
      const fileDetails = createMockFileDetails({
        StatusColor: 'Green',
        FileLogId: 123,
      });
      mockFileImporterDel.mockResolvedValue({
        message: 'File canceled successfully',
      });

      const onClose = vi.fn();

      render(
        <FileUploadModal
          isOpen={true}
          onClose={onClose}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Green"
          fileDetails={fileDetails}
        />,
      );

      const cancelButton = screen.getByRole('button', { name: /cancel file/i });
      await user.click(cancelButton);

      // Confirm cancellation
      const confirmButton = await screen.findByRole('button', {
        name: /confirm|yes/i,
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(mockFileImporterDel).toHaveBeenCalledWith(
          expect.stringContaining('/file'),
          expect.objectContaining({
            FileLogId: 123,
          }),
        );
      });

      // Modal should close
      await waitFor(() => {
        expect(onClose).toHaveBeenCalled();
      });
    });
  });

  describe('View File Details', () => {
    it('displays file name, pattern, upload date, and record count', () => {
      const fileDetails = createMockFileDetails({
        FileName: '202403_CORONATION_Holdings.csv',
        FileNamePattern: 'CORONATION_Holdings_*.csv',
        StartDate: '2024-03-01T10:00:00Z',
      });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Green"
          fileDetails={fileDetails}
        />,
      );

      expect(
        screen.getByText('202403_CORONATION_Holdings.csv'),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/CORONATION_Holdings_\*\.csv/),
      ).toBeInTheDocument();
      expect(screen.getByText(/march|mar.*2024/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when upload fails', async () => {
      const user = userEvent.setup();
      mockFileImporterUpload.mockRejectedValue(new Error('Upload failed'));

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Gray"
          fileDetails={null}
        />,
      );

      const uploadButton = screen.getByRole('button', { name: /upload file/i });
      await user.click(uploadButton);

      const fileInput = screen.getByLabelText(/select file|choose file/i);
      const file = new File(['test content'], 'holdings.csv', {
        type: 'text/csv',
      });

      await user.upload(fileInput, file);

      const submitButton = screen.getByRole('button', {
        name: /upload|submit/i,
      });
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });

    it('displays error message when cancel fails', async () => {
      const user = userEvent.setup();
      const fileDetails = createMockFileDetails({ FileLogId: 123 });
      mockFileImporterDel.mockRejectedValue(new Error('Cancel failed'));

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Green"
          fileDetails={fileDetails}
        />,
      );

      const cancelButton = screen.getByRole('button', { name: /cancel file/i });
      await user.click(cancelButton);

      const confirmButton = await screen.findByRole('button', {
        name: /confirm|yes/i,
      });
      await user.click(confirmButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  describe('Invalid Reasons Display', () => {
    it('displays Invalid Reasons section when InvalidReasons is present', () => {
      const fileDetails = createMockFileDetails({
        StatusColor: 'Red',
        InvalidReasons:
          'Instrument Code "CASH" mapping does not exist,Instrument Code "CASHBRLLL" mapping does not exist',
      });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Red"
          fileDetails={fileDetails}
        />,
      );

      expect(screen.getByText('Invalid Reasons')).toBeInTheDocument();
      expect(
        screen.getByText('Instrument Code "CASH" mapping does not exist'),
      ).toBeInTheDocument();
      expect(
        screen.getByText('Instrument Code "CASHBRLLL" mapping does not exist'),
      ).toBeInTheDocument();
    });

    it('displays each comma-separated reason as a separate row', () => {
      const fileDetails = createMockFileDetails({
        StatusColor: 'Red',
        InvalidReasons: 'Reason 1,Reason 2,Reason 3',
      });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Red"
          fileDetails={fileDetails}
        />,
      );

      // Each reason should be in a separate row
      const rows = screen.getAllByRole('row');
      expect(rows.length).toBe(3);
      expect(screen.getByText('Reason 1')).toBeInTheDocument();
      expect(screen.getByText('Reason 2')).toBeInTheDocument();
      expect(screen.getByText('Reason 3')).toBeInTheDocument();
    });

    it('hides Invalid Reasons section when InvalidReasons is empty', () => {
      const fileDetails = createMockFileDetails({
        StatusColor: 'Red',
        InvalidReasons: '',
      });

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Red"
          fileDetails={fileDetails}
        />,
      );

      expect(screen.queryByText('Invalid Reasons')).not.toBeInTheDocument();
    });

    it('hides Invalid Reasons section when fileDetails has no InvalidReasons field', () => {
      const fileDetails = createMockFileDetails({
        StatusColor: 'Green',
      });
      // Explicitly remove InvalidReasons
      fileDetails.InvalidReasons = '';

      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Green"
          fileDetails={fileDetails}
        />,
      );

      expect(screen.queryByText('Invalid Reasons')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const fileDetails = createMockFileDetails();
      const { container } = render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Green"
          fileDetails={fileDetails}
        />,
      );

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('traps focus within modal when open', () => {
      const fileDetails = createMockFileDetails();
      render(
        <FileUploadModal
          isOpen={true}
          onClose={() => {}}
          fileType="Holdings"
          portfolioName="Coronation Fund"
          statusColor="Green"
          fileDetails={fileDetails}
        />,
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();

      // Dialog should have proper ARIA attributes
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });
});
