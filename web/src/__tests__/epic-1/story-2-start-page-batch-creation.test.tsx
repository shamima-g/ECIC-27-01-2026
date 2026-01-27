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
}));

import { get, post } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import HomePage from '@/app/page';

const mockGet = get as ReturnType<typeof vitest.fn>;
const mockPost = post as ReturnType<typeof vitest.fn>;

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
    it('opens create batch modal when "Create New Batch" button is clicked', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

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

      // Modal should open with report date input
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByLabelText(/Report Date/i)).toBeInTheDocument();
    });

    it('creates a new batch when user submits valid date', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());
      mockPost.mockResolvedValueOnce({
        message: 'Report batch created successfully',
      });
      mockGet.mockResolvedValueOnce(
        createMockBatches([createMockBatch({ ReportDate: '2024-04-30' })]),
      );

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      // Open modal
      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );

      // Enter report date
      const dateInput = screen.getByLabelText(/Report Date/i);
      await user.clear(dateInput);
      await user.type(dateInput, '2024-04-30');

      // Submit form
      const submitButton = screen.getByRole('button', { name: /Create/i });
      await user.click(submitButton);

      // Verify API calls
      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith('/monthly-report-batch');
        expect(mockPost).toHaveBeenCalledWith('/monthly-runs/2024-04-30');
      });

      // Success message displayed
      expect(
        screen.getByText(/batch created successfully/i),
      ).toBeInTheDocument();
    });

    it('displays newly created batch in Current Batch section with "Data Preparation" status', async () => {
      const user = userEvent.setup();
      const newBatch = createMockBatch({
        ReportDate: '2024-04-30',
        WorkflowStatusName: 'Data Preparation',
      });

      mockGet.mockResolvedValue(createMockBatches());
      mockPost.mockResolvedValue({ message: 'Success' });
      mockGet.mockResolvedValue(createMockBatches([newBatch]));

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
      await user.type(screen.getByLabelText(/Report Date/i), '2024-04-30');
      await user.click(screen.getByRole('button', { name: /Create/i }));

      // Verify new batch is displayed
      await waitFor(() => {
        expect(screen.getByText('2024-04-30')).toBeInTheDocument();
        expect(screen.getByText('Data Preparation')).toBeInTheDocument();
      });
    });
  });

  describe('Validation', () => {
    it('shows error when creating batch with duplicate report date', async () => {
      const user = userEvent.setup();
      const existingBatch = createMockBatch({ ReportDate: '2024-03-31' });

      mockGet.mockResolvedValue(createMockBatches([existingBatch]));
      mockPost.mockRejectedValue(
        new Error('Report batch for this date already exists'),
      );

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      // Open modal and try to create duplicate
      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );
      await user.type(screen.getByLabelText(/Report Date/i), '2024-03-31');
      await user.click(screen.getByRole('button', { name: /Create/i }));

      // Error message displayed
      await waitFor(() => {
        expect(
          screen.getByText(/Report batch for this date already exists/i),
        ).toBeInTheDocument();
      });
    });

    it('closes modal without creating batch when Cancel is clicked', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      // Open modal
      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );
      expect(screen.getByRole('dialog')).toBeInTheDocument();

      // Click Cancel
      const cancelButton = screen.getByRole('button', { name: /Cancel/i });
      await user.click(cancelButton);

      // Modal should close
      await waitFor(() => {
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
      });

      // No API calls made
      expect(mockPost).not.toHaveBeenCalled();
    });
  });

  describe('API Integration', () => {
    it('calls correct API endpoints when creating batch', async () => {
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
      await user.type(screen.getByLabelText(/Report Date/i), '2024-04-30');
      await user.click(screen.getByRole('button', { name: /Create/i }));

      await waitFor(() => {
        // Should create batch then start monthly process
        expect(mockPost).toHaveBeenCalledWith('/monthly-report-batch');
        expect(mockPost).toHaveBeenCalledWith('/monthly-runs/2024-04-30');
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
      await user.type(screen.getByLabelText(/Report Date/i), '2024-04-30');
      await user.click(screen.getByRole('button', { name: /Create/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
      });
    });
  });

  describe('Accessibility', () => {
    it('provides accessible form labels in modal', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );

      // Form should have accessible labels
      expect(screen.getByLabelText(/Report Date/i)).toBeInTheDocument();
    });

    it('modal has proper ARIA attributes', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /Create New Batch/i }),
        ).toBeInTheDocument();
      });

      await user.click(
        screen.getByRole('button', { name: /Create New Batch/i }),
      );

      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveAttribute('aria-modal', 'true');
    });
  });
});
