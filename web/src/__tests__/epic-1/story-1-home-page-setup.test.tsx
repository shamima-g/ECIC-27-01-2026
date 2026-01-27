/**
 * Epic 1, Story 1: Home Page Setup
 *
 * Tests that the root URL displays the InvestInsight Start Page
 * instead of the template README content.
 *
 * User Story:
 * As a user visiting the application
 * I want to see a relevant home page for InvestInsight
 * So that I can immediately understand and access the application's portfolio reporting functionality
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

// Mock data factory for report batches
const createMockBatches = () => ({
  MonthlyReportBatches: [
    {
      ReportBatchId: 1,
      ReportDate: '2024-03-31',
      WorkflowInstanceId: 'wf-123',
      WorkflowStatusName: 'Data Preparation',
      CreatedAt: '2024-03-01T10:00:00Z',
      FinishedAt: null,
      LastExecutedActivityName: 'File Upload',
    },
  ],
});

describe('Epic 1, Story 1: Home Page Setup', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Core Requirements', () => {
    it('displays the InvestInsight Start Page when visiting root URL', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      // User should see the Start Page heading
      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /InvestInsight/i }),
        ).toBeInTheDocument();
      });
    });

    it('does NOT display template README content', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        // Should not see template-specific text
        expect(
          screen.queryByText(/This is a SaaS application template/i),
        ).not.toBeInTheDocument();
        expect(screen.queryByText(/Getting Started/i)).not.toBeInTheDocument();
        expect(
          screen.queryByText(/Features Overview/i),
        ).not.toBeInTheDocument();
      });
    });

    it('provides navigation to main features', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        // User can access main navigation links
        expect(
          screen.getByRole('link', { name: /File Uploads/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Data Confirmation/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Maintenance/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Approvals/i }),
        ).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('fetches report batches on page load', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith('/report-batches');
      });
    });

    it('displays loading state while fetching data', () => {
      mockGet.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<HomePage />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('handles API errors gracefully', async () => {
      mockGet.mockRejectedValue(new Error('Network error'));

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toHaveTextContent(/error/i);
      });
    });
  });

  describe('Accessibility', () => {
    it('has a proper page heading for screen readers', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        const heading = screen.getByRole('heading', { level: 1 });
        expect(heading).toBeInTheDocument();
      });
    });

    it('has semantic HTML structure with main landmark', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('main')).toBeInTheDocument();
      });
    });
  });
});
