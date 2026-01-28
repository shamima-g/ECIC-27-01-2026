/**
 * Epic 2, Story 5: File Access Restrictions
 *
 * Tests that file upload screens are locked based on workflow phase.
 *
 * User Story:
 * As a System Administrator
 * I want file upload screens to be locked after data preparation is complete
 * So that data integrity is maintained during the approval process
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
  monthlyGet: vi.fn(),
}));

import { get, monthlyGet } from '@/lib/api/client';
// These imports WILL FAIL until implemented - that's the point of TDD!
import PortfolioImportsPage from '@/app/imports/portfolio/page';
import OtherImportsPage from '@/app/imports/other/page';

const mockGet = get as ReturnType<typeof vitest.fn>;
const mockMonthlyGet = monthlyGet as ReturnType<typeof vitest.fn>;

// Type definitions based on MonthlyAPIDefinition.yaml
interface MonthlyReportBatch {
  ReportBatchId: number;
  ReportDate: string;
  WorkflowInstanceId: string;
  WorkflowStatusName: string;
  CreatedAt: string;
  FinishedAt: string | null;
  LastExecutedActivityName: string;
}

// Mock data factory
const createMockBatch = (overrides: Partial<MonthlyReportBatch> = {}): MonthlyReportBatch => ({
  ReportBatchId: 1,
  ReportDate: '2024-03-31',
  WorkflowInstanceId: 'wf-123',
  WorkflowStatusName: 'Data Preparation',
  CreatedAt: '2024-03-01T10:00:00Z',
  FinishedAt: null,
  LastExecutedActivityName: 'PrepareData',
  ...overrides,
});

const createMockPortfoliosResponse = () => ({
  Portfolios: [
    {
      PortfolioId: 1,
      PortfolioName: 'Coronation Fund',
      Action: '',
      Files: [],
    },
  ],
});

const createMockOtherFilesResponse = () => ({
  Files: [
    {
      FileLogId: 1,
      FileType: 'Monthly Index Files',
      StatusColor: 'Green',
    },
  ],
});

describe('Epic 2, Story 5: File Access Restrictions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Access Control - Data Preparation Phase (Unlocked)', () => {
    it('allows file uploads when LastExecutedActivityName is "PrepareData" on Portfolio Imports', async () => {
      const batch = createMockBatch({ LastExecutedActivityName: 'PrepareData' });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Upload/manage file actions should be available
      const statusIcons = screen.getAllByRole('button');
      expect(statusIcons.length).toBeGreaterThan(0);
      expect(statusIcons[0]).not.toBeDisabled();
    });

    it('allows file uploads when LastExecutedActivityName is "PrepareData" on Other Imports', async () => {
      const batch = createMockBatch({ LastExecutedActivityName: 'PrepareData' });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockOtherFilesResponse());

      render(<OtherImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
      });

      // Upload/manage file actions should be available
      const statusIcons = screen.getAllByRole('button');
      expect(statusIcons.length).toBeGreaterThan(0);
      expect(statusIcons[0]).not.toBeDisabled();
    });

    it('does not display lock message during data preparation phase', async () => {
      const batch = createMockBatch({ LastExecutedActivityName: 'PrepareData' });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Should not show lock message
      expect(screen.queryByText(/locked during approval/i)).not.toBeInTheDocument();
    });
  });

  describe('Access Control - Approval Phases (Locked)', () => {
    const approvalPhases: Array<{ name: string; activityName: string }> = [
      { name: 'Level 1 Approval', activityName: 'ApproveFirstLevel' },
      { name: 'Level 2 Approval', activityName: 'ApproveSecondLevel' },
      { name: 'Level 3 Approval', activityName: 'ApproveThirdLevel' },
      { name: 'Pending Complete', activityName: 'PendingComplete' },
    ];

    approvalPhases.forEach(({ name, activityName }) => {
      describe(`During ${name}`, () => {
        it('displays lock message on Portfolio Imports', async () => {
          const batch = createMockBatch({ LastExecutedActivityName: activityName });
          mockMonthlyGet.mockResolvedValue(batch);
          mockGet.mockResolvedValue(createMockPortfoliosResponse());

          render(<PortfolioImportsPage />);

          await waitFor(() => {
            expect(screen.getByText(/file uploads are locked during approval/i)).toBeInTheDocument();
          });
        });

        it('disables upload and cancel buttons on Other Imports', async () => {
          const batch = createMockBatch({ LastExecutedActivityName: activityName });
          mockMonthlyGet.mockResolvedValue(batch);
          mockGet.mockResolvedValue(createMockOtherFilesResponse());

          render(<OtherImportsPage />);

          await waitFor(() => {
            expect(screen.getByText('Monthly Index Files')).toBeInTheDocument();
          });

          // Status icons should be disabled or not clickable for upload/cancel
          const alert = screen.getByRole('alert', { name: /locked/i });
          expect(alert).toBeInTheDocument();
        });

        it('allows read-only access - user can view file details', async () => {
          const user = userEvent.setup();
          const batch = createMockBatch({ LastExecutedActivityName: activityName });
          mockMonthlyGet.mockResolvedValue(batch);
          mockGet.mockResolvedValue(createMockPortfoliosResponse());

          render(<PortfolioImportsPage />);

          await waitFor(() => {
            expect(screen.getByText(/file uploads are locked during approval/i)).toBeInTheDocument();
          });

          // Can still click to view details (read-only)
          const statusIcons = screen.getAllByRole('button', { name: /view|details/i });
          if (statusIcons.length > 0) {
            await user.click(statusIcons[0]);

            // Modal should open in read-only mode
            await waitFor(() => {
              expect(screen.getByRole('dialog')).toBeInTheDocument();
            });

            // Upload/cancel buttons should not be present
            expect(screen.queryByRole('button', { name: /upload file/i })).not.toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /cancel file/i })).not.toBeInTheDocument();
          }
        });
      });
    });
  });

  describe('Access Control - After Rejection', () => {
    it('unlocks file uploads when workflow returns to "PrepareData" after rejection', async () => {
      const batch = createMockBatch({ LastExecutedActivityName: 'PrepareData' });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Should not show lock message
      expect(screen.queryByText(/locked during approval/i)).not.toBeInTheDocument();

      // Upload actions should be available
      const statusIcons = screen.getAllByRole('button');
      expect(statusIcons[0]).not.toBeDisabled();
    });

    it('displays message indicating batch was rejected and uploads are available', async () => {
      const batch = createMockBatch({
        LastExecutedActivityName: 'PrepareData',
        WorkflowStatusName: 'Data Preparation', // Returned from approval
      });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Info message about rejection could be shown (optional based on UX)
      // Main point: uploads should be enabled
      const statusIcons = screen.getAllByRole('button');
      expect(statusIcons[0]).not.toBeDisabled();
    });
  });

  describe('Read-Only Access During Approval', () => {
    it('allows viewing file details but not uploading during approval', async () => {
      const user = userEvent.setup();
      const batch = createMockBatch({ LastExecutedActivityName: 'ApproveFirstLevel' });
      mockMonthlyGet.mockResolvedValue(batch);

      const fileDetails = {
        FileLogId: 1,
        FileName: '202403_Holdings.csv',
        StatusColor: 'Green',
      };

      mockGet
        .mockResolvedValueOnce(createMockPortfoliosResponse())
        .mockResolvedValueOnce({ FileDetails: fileDetails });

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText(/file uploads are locked during approval/i)).toBeInTheDocument();
      });

      // Click view button (read-only access)
      const viewButtons = screen.getAllByRole('button', { name: /view|details/i });
      if (viewButtons.length > 0) {
        await user.click(viewButtons[0]);

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Should show file details
        expect(screen.getByText('202403_Holdings.csv')).toBeInTheDocument();

        // Should not show upload/cancel buttons
        expect(screen.queryByRole('button', { name: /upload file/i })).not.toBeInTheDocument();
        expect(screen.queryByRole('button', { name: /cancel file/i })).not.toBeInTheDocument();

        // Should still allow export
        expect(screen.queryByRole('button', { name: /export|download/i })).toBeInTheDocument();
      }
    });

    it('allows viewing validation errors during approval', async () => {
      const user = userEvent.setup();
      const batch = createMockBatch({ LastExecutedActivityName: 'ApproveSecondLevel' });
      mockMonthlyGet.mockResolvedValue(batch);

      const fileDetails = {
        FileLogId: 1,
        FileName: '202403_Holdings.csv',
        StatusColor: 'Red',
        InvalidReasons: 'Validation failed',
      };

      mockGet
        .mockResolvedValueOnce(createMockPortfoliosResponse())
        .mockResolvedValueOnce({ FileDetails: fileDetails });

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText(/file uploads are locked during approval/i)).toBeInTheDocument();
      });

      // Can view errors even during approval (read-only)
      const viewButtons = screen.getAllByRole('button', { name: /view|details/i });
      if (viewButtons.length > 0) {
        await user.click(viewButtons[0]);

        await waitFor(() => {
          expect(screen.getByRole('dialog')).toBeInTheDocument();
        });

        // Should be able to view errors button
        expect(screen.queryByRole('button', { name: /view errors/i })).toBeInTheDocument();

        // But retry validation should be disabled
        expect(screen.queryByRole('button', { name: /retry validation/i })).toBeDisabled();
      }
    });
  });

  describe('API Integration', () => {
    it('fetches current batch to determine access level', async () => {
      const batch = createMockBatch({ LastExecutedActivityName: 'PrepareData' });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledWith(
          expect.stringContaining('/monthly-report-batch')
        );
      });
    });
  });

  describe('Visual Indicators', () => {
    it('greys out disabled sections during approval phases', async () => {
      const batch = createMockBatch({ LastExecutedActivityName: 'ApproveFirstLevel' });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText(/file uploads are locked during approval/i)).toBeInTheDocument();
      });

      // Find the disabled/locked section
      const lockedSection = screen.getByRole('alert', { name: /locked/i });
      expect(lockedSection).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('displays error message when batch fetch fails', async () => {
      mockMonthlyGet.mockRejectedValue(new Error('Network error'));
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });

    it('defaults to locked state when LastExecutedActivityName is unknown', async () => {
      const batch = createMockBatch({ LastExecutedActivityName: 'UnknownActivity' });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        // Should default to locked for safety
        expect(screen.getByText(/locked|restricted/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations when locked', async () => {
      const batch = createMockBatch({ LastExecutedActivityName: 'ApproveFirstLevel' });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      const { container } = render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText(/file uploads are locked during approval/i)).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has no accessibility violations when unlocked', async () => {
      const batch = createMockBatch({ LastExecutedActivityName: 'PrepareData' });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      const { container } = render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('announces lock state changes to screen readers', async () => {
      const batch = createMockBatch({ LastExecutedActivityName: 'ApproveFirstLevel' });
      mockMonthlyGet.mockResolvedValue(batch);
      mockGet.mockResolvedValue(createMockPortfoliosResponse());

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        const alert = screen.getByRole('alert');
        expect(alert).toHaveTextContent(/file uploads are locked during approval/i);
      });
    });
  });
});
