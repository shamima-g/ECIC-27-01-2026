/**
 * Epic 1, Story 2: Start Page - Batch Creation
 *
 * Tests the ability to create new monthly report batches from the Start Page.
 *
 * User Story:
 * As an Operations Lead
 * I want to create a new monthly report batch
 * So that I can initiate the reporting cycle for the current period
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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

import { monthlyGet, monthlyPost } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import HomePage from '@/app/page';

const mockGet = monthlyGet as ReturnType<typeof vitest.fn>;
const mockPost = monthlyPost as ReturnType<typeof vitest.fn>;

// Type definitions for mock data
interface MockBatch {
  ReportBatchId: number;
  ReportDate: string;
  WorkflowInstanceId: string;
  WorkflowStatusName: string;
  CreatedAt: string;
  FinishedAt: string | null;
  LastExecutedActivityName: string;
}

// Mock data factory
const createMockBatches = (batches: MockBatch[] = []) => ({
  MonthlyReportBatches: batches,
});

const createMockBatch = (overrides: Partial<MockBatch> = {}): MockBatch => ({
  ReportBatchId: 1,
  ReportDate: '2024-03-31',
  WorkflowInstanceId: 'wf-123',
  WorkflowStatusName: 'Data Preparation',
  CreatedAt: '2024-03-01T10:00:00Z',
  FinishedAt: null,
  LastExecutedActivityName: 'Initial',
  ...overrides,
});

describe('Epic 1, Story 2: Start Page - Batch Creation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Happy Path', () => {
    it('directly calls API when "Create New Batch" button is clicked (no modal)', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());
      mockPost.mockResolvedValue({ message: 'Success' });

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', {
        name: /Create New Batch/i,
      });
      await user.click(createButton);

      // API should be called directly (no modal)
      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/monthly-report-batch');
      });

      // No modal dialog should appear
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('displays success message after batch is created', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());
      mockPost.mockResolvedValue({
        message: 'Report batch created successfully',
      });

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );

      // Success message displayed
      await waitFor(() => {
        expect(
          screen.getByText(/batch created successfully/i),
        ).toBeInTheDocument();
      });
    });

    it('displays newly created batch in Current Batch section with "Data Preparation" status', async () => {
      const user = userEvent.setup();
      const newBatch = createMockBatch({
        ReportDate: '2024-04-30',
        WorkflowStatusName: 'Data Preparation',
      });

      mockGet
        .mockResolvedValueOnce(createMockBatches())
        .mockResolvedValueOnce(createMockBatches([newBatch]));
      mockPost.mockResolvedValue({ message: 'Success' });

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      // Create batch
      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );

      // Verify new batch is displayed
      await waitFor(() => {
        expect(screen.getByText('2024-04-30')).toBeInTheDocument();
        expect(screen.getByText('Data Preparation')).toBeInTheDocument();
      });
    });
  });

  describe('Business Rules', () => {
    it('enables Create button when there is no active batch', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        const createButton = screen.getByRole('button', {
          name: /Create New Batch/i,
        });
        expect(createButton).not.toBeDisabled();
      });
    });

    it('enables Create button when active batch has LastExecutedActivityName = "PendingComplete"', async () => {
      const completedBatch = createMockBatch({
        LastExecutedActivityName: 'PendingComplete',
        FinishedAt: null,
      });
      mockGet.mockResolvedValue(createMockBatches([completedBatch]));

      render(<HomePage />);

      await waitFor(() => {
        const createButton = screen.getByRole('button', {
          name: /Create New Batch/i,
        });
        expect(createButton).not.toBeDisabled();
      });
    });

    it('disables Create button when active batch is not in PendingComplete state', async () => {
      const activeBatch = createMockBatch({
        LastExecutedActivityName: 'DataPreparation',
        FinishedAt: null,
      });
      mockGet.mockResolvedValue(createMockBatches([activeBatch]));

      render(<HomePage />);

      await waitFor(() => {
        const createButton = screen.getByRole('button', {
          name: /Create New Batch/i,
        });
        expect(createButton).toBeDisabled();
      });

      // Should show message explaining why button is disabled
      expect(
        screen.getByText(
          /Cannot create new batch while current batch is in progress/i,
        ),
      ).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('shows error when API returns duplicate batch error', async () => {
      const user = userEvent.setup();
      // No active batch, so button should be enabled
      mockGet.mockResolvedValue(createMockBatches());
      mockPost.mockRejectedValue(
        new Error('Report batch for this date already exists'),
      );

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      // Click create button
      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );

      // Error message displayed
      await waitFor(() => {
        expect(
          screen.getByText(/Report batch for this date already exists/i),
        ).toBeInTheDocument();
      });
    });

    it('handles API failure and displays error details', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());
      mockPost.mockRejectedValue(new Error('Internal Server Error'));

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(
          /Internal Server Error/i,
        );
      });
    });
  });

  describe('API Integration', () => {
    it('calls POST /monthly-report-batch endpoint when creating batch', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());
      mockPost.mockResolvedValue({ message: 'Success' });

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/monthly-report-batch');
      });
    });

    it('refreshes batch list after successful creation', async () => {
      const user = userEvent.setup();
      const newBatch = createMockBatch({ ReportDate: '2024-04-30' });

      mockGet
        .mockResolvedValueOnce(createMockBatches())
        .mockResolvedValueOnce(createMockBatches([newBatch]));
      mockPost.mockResolvedValue({ message: 'Success' });

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );

      // Should have called GET to refresh
      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('UI State', () => {
    it('disables button while creating batch', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

      // Make the POST hang to test loading state
      let resolvePost: (value: unknown) => void;
      mockPost.mockImplementation(
        () =>
          new Promise((resolve) => {
            resolvePost = resolve;
          }),
      );

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      const createButton = screen.getByRole('button', {
        name: /Create New Batch/i,
      });
      await user.click(createButton);

      // Button should be disabled during creation
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Creating/i }),
        ).toBeDisabled();
      });

      // Resolve the promise to complete
      resolvePost!({ message: 'Success' });

      // Button should be re-enabled
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).not.toBeDisabled();
      });
    });
  });
});
