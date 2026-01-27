/**
 * Epic 1, Story 5: Start Page - Batch History
 *
 * Tests the batch history table showing previous report batches.
 *
 * User Story:
 * As an Operations Lead or Analyst
 * I want to view historical report batches
 * So that I can reference past reporting periods and their completion status
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi as vitest } from 'vitest';

// Mock the API client
vi.mock('@/lib/api/client', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
  monthlyGet: vi.fn(),
  monthlyPost: vi.fn(),
}));

import { monthlyGet } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import HomePage from '@/app/page';

const mockGet = monthlyGet as ReturnType<typeof vitest.fn>;

// Mock data factory
const createMockBatch = (overrides = {}) => ({
  ReportBatchId: 1,
  ReportDate: '2024-03-31',
  WorkflowInstanceId: 'wf-123',
  WorkflowStatusName: 'Complete',
  CreatedAt: '2024-03-01T10:00:00Z',
  FinishedAt: '2024-03-31T17:00:00Z',
  LastExecutedActivityName: 'Report Generated',
  ...overrides,
});

const createHistoricalBatches = () => ({
  MonthlyReportBatches: [
    createMockBatch({
      ReportBatchId: 3,
      ReportDate: '2024-03-31',
      WorkflowStatusName: 'Complete',
      FinishedAt: '2024-03-31T17:00:00Z',
    }),
    createMockBatch({
      ReportBatchId: 2,
      ReportDate: '2024-02-29',
      WorkflowStatusName: 'Complete',
      FinishedAt: '2024-02-29T16:30:00Z',
    }),
    createMockBatch({
      ReportBatchId: 1,
      ReportDate: '2024-01-31',
      WorkflowStatusName: 'Complete',
      FinishedAt: '2024-01-31T15:45:00Z',
    }),
  ],
});

const createMockApprovalLogs = () => ({
  ApproveLogs: [
    {
      Id: 1,
      ReportBatchId: 1,
      Type: 'Level 1',
      ApprovedBy: 'John Doe',
      ApprovedAt: '2024-03-20T14:00:00Z',
      Status: 'Approved',
    },
    {
      Id: 2,
      ReportBatchId: 1,
      Type: 'Level 2',
      ApprovedBy: 'Jane Smith',
      ApprovedAt: '2024-03-25T10:00:00Z',
      Status: 'Approved',
    },
    {
      Id: 3,
      ReportBatchId: 1,
      Type: 'Level 3',
      ApprovedBy: 'Bob Johnson',
      ApprovedAt: '2024-03-31T16:00:00Z',
      Status: 'Approved',
    },
  ],
});

describe('Epic 1, Story 5: Start Page - Batch History', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Batch History Table', () => {
    it('displays batch history section with table', async () => {
      mockGet.mockResolvedValue(createHistoricalBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /Batch History/i }),
        ).toBeInTheDocument();
        expect(screen.getByRole('table')).toBeInTheDocument();
      });
    });

    it('displays correct table columns', async () => {
      mockGet.mockResolvedValue(createHistoricalBatches());

      render(<HomePage />);

      await waitFor(() => {
        const table = screen.getByRole('table');
        within(table).getByRole('columnheader', { name: /Report Date/i });
        within(table).getByRole('columnheader', { name: /Status/i });
        within(table).getByRole('columnheader', { name: /Created/i });
        within(table).getByRole('columnheader', { name: /Finished/i });
        within(table).getByRole('columnheader', { name: /Last Activity/i });
      });
    });

    it('displays batches sorted by ReportDate descending (newest first)', async () => {
      mockGet.mockResolvedValue(createHistoricalBatches());

      render(<HomePage />);

      await waitFor(() => {
        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');

        // Skip header row, check data rows
        expect(within(rows[1]).getByText('2024-03-31')).toBeInTheDocument();
        expect(within(rows[2]).getByText('2024-02-29')).toBeInTheDocument();
        expect(within(rows[3]).getByText('2024-01-31')).toBeInTheDocument();
      });
    });

    it('displays WorkflowStatusName for complete batches', async () => {
      mockGet.mockResolvedValue(createHistoricalBatches());

      render(<HomePage />);

      await waitFor(() => {
        // Verify completed batch status is visible to the user in the table
        const table = screen.getByRole('table');
        expect(within(table).getAllByText('Complete').length).toBeGreaterThan(
          0,
        );
      });
    });

    it('displays WorkflowStatusName for in-progress batches', async () => {
      const batchesWithInProgress = {
        MonthlyReportBatches: [
          createMockBatch({
            ReportDate: '2024-04-30',
            WorkflowStatusName: 'First Approval',
            FinishedAt: null,
          }),
          ...createHistoricalBatches().MonthlyReportBatches,
        ],
      };

      mockGet.mockResolvedValue(batchesWithInProgress);

      render(<HomePage />);

      await waitFor(() => {
        // Verify in-progress batch status is visible to the user in the table
        const table = screen.getByRole('table');
        expect(within(table).getByText('First Approval')).toBeInTheDocument();
      });
    });
  });

  describe('Batch History Details', () => {
    it('expands row to show additional details when clicked', async () => {
      const user = userEvent.setup();
      // First call returns batches, subsequent calls return approval logs
      mockGet.mockResolvedValueOnce(createHistoricalBatches());
      mockGet.mockResolvedValue(createMockApprovalLogs());

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Click on a batch row
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      const firstDataRow = rows[1]; // Skip header

      await user.click(firstDataRow);

      // Details section should appear
      await waitFor(() => {
        expect(screen.getByText(/Approval Details/i)).toBeInTheDocument();
      });
    });

    it('displays approval information for completed batch', async () => {
      const user = userEvent.setup();
      // First call returns batches, subsequent calls return approval logs
      mockGet.mockResolvedValueOnce(createHistoricalBatches());
      mockGet.mockResolvedValue(createMockApprovalLogs());

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Expand first batch
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      await user.click(rows[1]);

      // Verify approval details displayed
      await waitFor(() => {
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument(); // L1 approver
        expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument(); // L2 approver
        expect(screen.getByText(/Bob Johnson/i)).toBeInTheDocument(); // L3 approver
      });
    });

    it('shows who approved at each level and when', async () => {
      const user = userEvent.setup();
      // First call returns batches, subsequent calls return approval logs
      mockGet.mockResolvedValueOnce(createHistoricalBatches());
      mockGet.mockResolvedValue(createMockApprovalLogs());

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Expand batch details
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      await user.click(rows[1]);

      await waitFor(() => {
        // L1 approval details
        expect(screen.getByText(/Level 1/i)).toBeInTheDocument();
        expect(screen.getByText(/John Doe/i)).toBeInTheDocument();

        // L2 approval details
        expect(screen.getByText(/Level 2/i)).toBeInTheDocument();
        expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();

        // L3 approval details
        expect(screen.getByText(/Level 3/i)).toBeInTheDocument();
        expect(screen.getByText(/Bob Johnson/i)).toBeInTheDocument();
      });
    });
  });

  describe('Pagination', () => {
    it('displays pagination controls when more than 10 batches exist', async () => {
      const manyBatches = {
        MonthlyReportBatches: Array.from({ length: 15 }, (_, i) =>
          createMockBatch({
            ReportBatchId: i + 1,
            ReportDate: `2024-${String(12 - i).padStart(2, '0')}-31`,
          }),
        ),
      };

      mockGet.mockResolvedValue(manyBatches);

      render(<HomePage />);

      await waitFor(() => {
        // Pagination controls should be visible
        expect(
          screen.getByRole('navigation', { name: /pagination/i }),
        ).toBeInTheDocument();
      });
    });

    it('shows next 10 batches when Next button is clicked', async () => {
      const user = userEvent.setup();
      // Generate valid dates (last day of each month going back from Dec 2023)
      const validDates = [
        '2023-12-31',
        '2023-11-30',
        '2023-10-31',
        '2023-09-30',
        '2023-08-31',
        '2023-07-31',
        '2023-06-30',
        '2023-05-31',
        '2023-04-30',
        '2023-03-31',
        '2023-02-28',
        '2023-01-31',
        '2022-12-31',
        '2022-11-30',
        '2022-10-31',
      ];
      const manyBatches = {
        MonthlyReportBatches: validDates.map((date, i) =>
          createMockBatch({
            ReportBatchId: i + 1,
            ReportDate: date,
          }),
        ),
      };

      mockGet.mockResolvedValue(manyBatches);

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // First page shows batches 1-10
      expect(screen.getByText('2023-12-31')).toBeInTheDocument();

      // Click Next
      const nextButton = screen.getByRole('button', { name: /next/i });
      await user.click(nextButton);

      // Second page shows remaining batches (indices 10-14)
      await waitFor(() => {
        // 11th batch (index 10) should now be visible
        expect(screen.getByText('2023-02-28')).toBeInTheDocument();
      });
    });

    it('disables Previous button on first page', async () => {
      const manyBatches = {
        MonthlyReportBatches: Array.from({ length: 15 }, (_, i) =>
          createMockBatch({
            ReportBatchId: i + 1,
            ReportDate: `2024-${String(12 - i).padStart(2, '0')}-31`,
          }),
        ),
      };

      mockGet.mockResolvedValue(manyBatches);

      render(<HomePage />);

      await waitFor(() => {
        const prevButton = screen.getByRole('button', { name: /previous/i });
        expect(prevButton).toBeDisabled();
      });
    });
  });

  describe('API Integration', () => {
    it('fetches batch history from /report-batches', async () => {
      mockGet.mockResolvedValue(createHistoricalBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('/report-batches');
      });
    });

    it('fetches approval logs when batch details are expanded', async () => {
      const user = userEvent.setup();
      const batchId = 1;
      // First call returns batches, subsequent calls return approval logs
      mockGet.mockResolvedValueOnce(createHistoricalBatches());
      mockGet.mockResolvedValue(createMockApprovalLogs());

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('table')).toBeInTheDocument();
      });

      // Expand batch
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      await user.click(rows[3]); // Third batch (ReportBatchId: 1)

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith(`/approve-logs/${batchId}`);
      });
    });

    it('handles empty batch history gracefully', async () => {
      mockGet.mockResolvedValue({ MonthlyReportBatches: [] });

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByText(/No batch history available/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('table has proper semantic structure', async () => {
      mockGet.mockResolvedValue(createHistoricalBatches());

      render(<HomePage />);

      await waitFor(() => {
        const table = screen.getByRole('table');
        expect(table).toBeInTheDocument();

        // Table should have headers
        const headers = within(table).getAllByRole('columnheader');
        expect(headers.length).toBeGreaterThan(0);
      });
    });

    it('expandable rows have proper ARIA attributes', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createHistoricalBatches());

      render(<HomePage />);

      await waitFor(() => {
        const table = screen.getByRole('table');
        const rows = within(table).getAllByRole('row');
        const firstDataRow = rows[1];

        // Row should be clickable/expandable
        expect(firstDataRow).toHaveAttribute('aria-expanded', 'false');
      });

      // Click to expand
      const table = screen.getByRole('table');
      const rows = within(table).getAllByRole('row');
      await user.click(rows[1]);

      await waitFor(() => {
        expect(rows[1]).toHaveAttribute('aria-expanded', 'true');
      });
    });

    it('pagination controls are keyboard accessible', async () => {
      const manyBatches = {
        MonthlyReportBatches: Array.from({ length: 15 }, (_, i) =>
          createMockBatch({
            ReportBatchId: i + 1,
            ReportDate: `2024-${String(12 - i).padStart(2, '0')}-31`,
          }),
        ),
      };

      mockGet.mockResolvedValue(manyBatches);

      render(<HomePage />);

      await waitFor(() => {
        const nextButton = screen.getByRole('button', { name: /next/i });
        nextButton.focus();
        expect(document.activeElement).toBe(nextButton);
      });
    });
  });
});
