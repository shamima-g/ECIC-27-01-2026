/**
 * Epic 2, Story 2: Other Imports Dashboard - List View
 *
 * Tests the non-portfolio files list display with status icons.
 *
 * User Story:
 * As an Operations Lead
 * I want to see non-portfolio files in a list format
 * So that I can quickly check the status of shared reference data files
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';
import { vi as vitest } from 'vitest';

// Mock the API client
vi.mock('@/lib/api/client', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
  fileImporterGet: vi.fn(),
  fileImporterPost: vi.fn(),
  fileImporterUpload: vi.fn(),
  fileImporterDel: vi.fn(),
  monthlyGet: vi.fn(),
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

import { fileImporterGet, monthlyGet } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import OtherImportsPage from '@/app/imports/other/page';

const mockFileImporterGet = fileImporterGet as ReturnType<typeof vitest.fn>;
const mockMonthlyGet = monthlyGet as ReturnType<typeof vitest.fn>;

// Type definitions based on FileImporterAPIDefinition.yaml
interface OtherFile {
  FileLogId: number;
  FileSettingId: number;
  FileSource: string; // 'Bloomberg' | 'Custodian'
  FileFormat: string;
  FileFormatId: number;
  FileType: string;
  ReportBatchId: number;
  FileName: string;
  FileNamePattern: string;
  StatusColor: string; // 'Gray' | 'Yellow' | 'Red' | 'Green'
  Message: string;
  Action: string;
  WorkflowInstanceId: string;
  WorkflowStatusName: string;
  StartDate: string;
  EndDate: string;
  InvalidReasons: string;
}

// Mock data factory with auto-incrementing FileLogId
let fileLogIdCounter = 0;

const createMockOtherFile = (overrides: Partial<OtherFile> = {}): OtherFile => {
  fileLogIdCounter += 1;
  return {
    FileLogId: fileLogIdCounter,
    FileSettingId: fileLogIdCounter,
    FileSource: 'Bloomberg',
    FileFormat: 'Zar',
    FileFormatId: 1,
    FileType: 'Monthly Index Files',
    ReportBatchId: 1,
    FileName: '202403_MonthlyIndex.xlsx',
    FileNamePattern: '*MonthlyIndex*.xlsx',
    StatusColor: 'Green',
    Message: 'File uploaded successfully',
    Action: 'View',
    WorkflowInstanceId: `wf-${fileLogIdCounter}`,
    WorkflowStatusName: 'Complete',
    StartDate: '2024-03-01T10:00:00Z',
    EndDate: '2024-03-01T10:05:00Z',
    InvalidReasons: '',
    ...overrides,
  };
};

const createMockOtherFilesResponse = (files: OtherFile[] = []) => ({
  Files: files,
});

describe('Epic 2, Story 2: Other Imports Dashboard - List View', () => {
  beforeEach(() => {
    // Use resetAllMocks to clear mock implementations (including mockResolvedValueOnce queue)
    vi.resetAllMocks();
    // Reset the FileLogId counter for consistent test behavior
    fileLogIdCounter = 0;
    // Mock monthlyGet for useWorkflowAccessControl hook - returns PrepareData state (unlocked)
    mockMonthlyGet.mockResolvedValue({
      MonthlyReportBatches: [
        {
          ReportBatchId: 1,
          ReportDate: '2024-03-01',
          LastExecutedActivityName: 'PrepareData',
          FinishedAt: null,
        },
      ],
    });
  });

  afterEach(() => {
    // Ensure fake timers are cleaned up between tests
    vi.useRealTimers();
  });

  describe('List Display', () => {
    it('displays all expected file types in list format', async () => {
      const files = [
        createMockOtherFile({
          FileType: 'Monthly Index Files',
          StatusColor: 'Green',
        }),
        createMockOtherFile({
          FileType: 'Bloomberg Credit Ratings',
          StatusColor: 'Gray',
          FileName: '',
          Message: 'File not uploaded',
        }),
        createMockOtherFile({
          FileType: 'Bloomberg Holdings',
          StatusColor: 'Red',
          Message: 'Validation failed',
        }),
        createMockOtherFile({
          FileType: 'Custodian Files',
          FileSource: 'Custodian',
          StatusColor: 'Yellow',
          Message: 'Processing',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
      });

      // Verify all expected file types
      expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
      expect(screen.getByText('Bloomberg Credit Ratings')).toBeInTheDocument();
      expect(screen.getByText('Bloomberg Holdings')).toBeInTheDocument();
      expect(screen.getByText('Custodian Files')).toBeInTheDocument();
    });

    it('displays file type name and status icon for each row', async () => {
      const files = [
        createMockOtherFile({
          FileType: 'Monthly Index Files',
          StatusColor: 'Green',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
      });

      // File type name displayed
      expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();

      // Status icon displayed
      expect(screen.getByLabelText(/complete|success/i)).toBeInTheDocument();
    });

    it('displays gray "Missing" status icon for files not uploaded', async () => {
      const files = [
        createMockOtherFile({
          FileType: 'Bloomberg Credit Ratings',
          StatusColor: 'Gray',
          FileName: '',
          Message: 'File not uploaded',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(
          screen.getByText('Bloomberg Credit Ratings'),
        ).toBeInTheDocument();
      });

      expect(
        screen.getByLabelText(/missing|not uploaded/i),
      ).toBeInTheDocument();
    });

    it('displays yellow "Busy" status icon with spinner for processing files', async () => {
      const files = [
        createMockOtherFile({
          FileType: 'Custodian Files',
          StatusColor: 'Yellow',
          Message: 'Processing',
          WorkflowStatusName: 'Processing',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Custodian Files')).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/processing|busy/i)).toBeInTheDocument();
    });

    it('displays red "Failed" status icon for validation failures', async () => {
      const files = [
        createMockOtherFile({
          FileType: 'Bloomberg Holdings',
          StatusColor: 'Red',
          Message: 'Validation failed',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Bloomberg Holdings')).toBeInTheDocument();
      });

      expect(
        screen.getByLabelText(/error in file|failed/i),
      ).toBeInTheDocument();
    });

    it('displays green "Complete" status icon for successfully uploaded files', async () => {
      const files = [
        createMockOtherFile({
          FileType: 'Monthly Index Files',
          StatusColor: 'Green',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
      });

      expect(screen.getByLabelText(/complete|success/i)).toBeInTheDocument();
    });
  });

  describe('Clickable Status Icons', () => {
    it('opens modal when status icon is clicked', async () => {
      const user = userEvent.setup();
      const files = [
        createMockOtherFile({
          FileType: 'Monthly Index Files',
          StatusColor: 'Green',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
      });

      // Click on status icon
      const statusIcon = screen.getByLabelText(/complete|success/i);
      await user.click(statusIcon);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Real-time Status Updates', () => {
    it('automatically updates status for files in "Busy" state', async () => {
      vi.useFakeTimers();

      const files = [
        createMockOtherFile({
          FileType: 'Custodian Files',
          StatusColor: 'Yellow',
          WorkflowStatusName: 'Processing',
        }),
      ];

      // First call returns busy status
      mockFileImporterGet.mockResolvedValueOnce(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByLabelText(/processing|busy/i)).toBeInTheDocument();
      });

      // Update mock to return complete status
      const updatedFiles = [
        createMockOtherFile({
          FileType: 'Custodian Files',
          StatusColor: 'Green',
          WorkflowStatusName: 'Complete',
        }),
      ];
      mockFileImporterGet.mockResolvedValueOnce(
        createMockOtherFilesResponse(updatedFiles),
      );

      // Advance timers to trigger polling (5 seconds) - use async version for proper promise resolution
      await vi.advanceTimersByTimeAsync(5000);

      // Status should update to complete
      await waitFor(() => {
        expect(screen.getByLabelText(/complete|success/i)).toBeInTheDocument();
      });
    });

    it('stops polling when no files are in "Busy" state', async () => {
      vi.useFakeTimers();

      const files = [
        createMockOtherFile({
          FileType: 'Monthly Index Files',
          StatusColor: 'Green',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
      });

      // Clear call count
      mockFileImporterGet.mockClear();

      // Advance timers by 10 seconds - use async version for consistency
      await vi.advanceTimersByTimeAsync(10000);

      // Should not poll when all files are complete
      expect(mockFileImporterGet).not.toHaveBeenCalled();
    });
  });

  describe('File Grouping by Source', () => {
    it('groups Bloomberg files together', async () => {
      const files = [
        createMockOtherFile({
          FileType: 'Monthly Index Files',
          FileSource: 'Bloomberg',
          StatusColor: 'Green',
        }),
        createMockOtherFile({
          FileType: 'Bloomberg Credit Ratings',
          FileSource: 'Bloomberg',
          StatusColor: 'Green',
        }),
        createMockOtherFile({
          FileType: 'Bloomberg Holdings',
          FileSource: 'Bloomberg',
          StatusColor: 'Green',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
      });

      // All Bloomberg files should be present
      expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
      expect(screen.getByText('Bloomberg Credit Ratings')).toBeInTheDocument();
      expect(screen.getByText('Bloomberg Holdings')).toBeInTheDocument();
    });

    it('groups Custodian files together', async () => {
      const files = [
        createMockOtherFile({
          FileType: 'Custodian Files',
          FileSource: 'Custodian',
          StatusColor: 'Green',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Custodian Files')).toBeInTheDocument();
      });

      expect(screen.getByText('Custodian Files')).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('displays loading indicator while fetching data', () => {
      mockFileImporterGet.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<OtherImportsPage />);

      expect(
        screen.getByRole('status', { name: /loading/i }),
      ).toBeInTheDocument();
    });

    it('displays error message when API call fails', async () => {
      mockFileImporterGet.mockRejectedValue(new Error('Network error'));

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('calls other-files endpoint with correct parameters', async () => {
      const files = [createMockOtherFile()];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(mockFileImporterGet).toHaveBeenCalledWith(
          expect.stringContaining('/other-files'),
          expect.objectContaining({
            ReportMonth: expect.any(String),
            ReportYear: expect.any(Number),
          }),
        );
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const files = [
        createMockOtherFile({
          FileType: 'Monthly Index Files',
          StatusColor: 'Green',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockOtherFilesResponse(files),
      );

      const { container } = render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
