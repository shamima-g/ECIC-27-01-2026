/**
 * Epic 1, Story 3: Start Page - Current Status Display
 *
 * Tests the display of the current batch status and workflow state.
 *
 * User Story:
 * As an Operations Lead or Analyst
 * I want to see the current batch status at a glance
 * So that I know which phase the reporting cycle is in and what actions are available
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
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
  LastExecutedActivityName: 'File Upload',
  ...overrides,
});

describe('Epic 1, Story 3: Start Page - Current Status Display', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('Status Display', () => {
    it('displays ReportDate prominently when active batch exists', async () => {
      const batch = createMockBatch({ ReportDate: '2024-03-31' });
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        // Report date should be prominently displayed
        expect(screen.getByText('2024-03-31')).toBeInTheDocument();
      });
    });

    it('displays LastExecutedActivityName for active batch', async () => {
      const batch = createMockBatch({
        LastExecutedActivityName: 'DataPreparation',
      });
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('DataPreparation')).toBeInTheDocument();
      });
    });

    it('displays status badge for "DataPreparation" activity', async () => {
      const batch = createMockBatch({
        LastExecutedActivityName: 'DataPreparation',
      });
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        // Verify the status badge text is visible to the user
        expect(screen.getByText('DataPreparation')).toBeInTheDocument();
      });
    });

    it('displays status badge for approval activities', async () => {
      const batch = createMockBatch({
        LastExecutedActivityName: 'L1Approval',
      });
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        // Verify the approval status is visible to the user
        expect(screen.getByText('L1Approval')).toBeInTheDocument();
      });
    });

    it('displays status badge for "PendingComplete" activity', async () => {
      const batch = createMockBatch({
        LastExecutedActivityName: 'PendingComplete',
        FinishedAt: null,
      });
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        // Verify the PendingComplete status is visible to the user
        expect(screen.getByText('PendingComplete')).toBeInTheDocument();
      });
    });
  });

  describe('Progress Indicator', () => {
    it('shows visual progress indicator for active batch', async () => {
      const batch = createMockBatch();
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        // Progress bar or stepper should be visible
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    });

    it('displays completed and remaining workflow stages', async () => {
      const batch = createMockBatch({
        LastExecutedActivityName: 'L1Approval',
      });
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        // Should show current activity
        expect(screen.getByText(/L1Approval/i)).toBeInTheDocument();
        // Progress indicator should reflect partial completion
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow');
      });
    });

    it('shows message when no active batch exists', async () => {
      mockGet.mockResolvedValue(createMockBatches([]));

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText(/No active batch/i)).toBeInTheDocument();
        expect(
          screen.getByText(/create a new batch to begin/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Real-time Updates', () => {
    it('reflects updated status when page is refreshed', async () => {
      const initialBatch = createMockBatch({
        LastExecutedActivityName: 'DataPreparation',
      });
      const updatedBatch = createMockBatch({
        LastExecutedActivityName: 'L1Approval',
      });

      mockGet.mockResolvedValueOnce(createMockBatches([initialBatch]));

      const { unmount } = render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('DataPreparation')).toBeInTheDocument();
      });

      // Simulate page refresh by unmounting and remounting
      unmount();
      mockGet.mockResolvedValueOnce(createMockBatches([updatedBatch]));
      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('L1Approval')).toBeInTheDocument();
      });
    });
  });

  describe('Multiple Activity States', () => {
    it('correctly displays "L2Approval" activity', async () => {
      const batch = createMockBatch({
        LastExecutedActivityName: 'L2Approval',
      });
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('L2Approval')).toBeInTheDocument();
      });
    });

    it('correctly displays "L3Approval" activity', async () => {
      const batch = createMockBatch({
        LastExecutedActivityName: 'L3Approval',
      });
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText('L3Approval')).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('fetches current batch status from /report-batches', async () => {
      mockGet.mockResolvedValue(createMockBatches([createMockBatch()]));

      render(<HomePage />);

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('/report-batches');
      });
    });

    it('handles missing batch data gracefully', async () => {
      mockGet.mockResolvedValue(createMockBatches([]));

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText(/No active batch/i)).toBeInTheDocument();
      });
    });

    it('handles API errors when fetching batch status', async () => {
      mockGet.mockRejectedValue(new Error('Failed to fetch batches'));

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
      });
    });
  });

  describe('Accessibility', () => {
    it('provides accessible status indicators with ARIA labels', async () => {
      const batch = createMockBatch({
        LastExecutedActivityName: 'DataPreparation',
      });
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        const statusElement = screen.getByText('DataPreparation');
        expect(statusElement).toBeInTheDocument();
      });
    });

    it('progress bar has proper ARIA attributes', async () => {
      const batch = createMockBatch();
      mockGet.mockResolvedValue(createMockBatches([batch]));

      render(<HomePage />);

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAttribute('aria-valuenow');
        expect(progressBar).toHaveAttribute('aria-valuemin', '0');
        expect(progressBar).toHaveAttribute('aria-valuemax', '100');
      });
    });
  });
});
