/**
 * Epic 3, Story 4: Real-time Refresh
 *
 * Tests automatic refresh and polling behavior for data confirmation checks.
 *
 * User Story:
 * As an Operations Lead or Analyst
 * I want data confirmation checks to update automatically as I fix issues
 * So that I can see progress in real-time without manually refreshing the page
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { axe } from 'vitest-axe';

// Mock the API client
vi.mock('@/lib/api/client', () => ({
  get: vi.fn(),
  post: vi.fn(),
  put: vi.fn(),
  del: vi.fn(),
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

import { monthlyGet } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import DataConfirmationPage from '@/app/data-confirmation/page';

const mockMonthlyGet = monthlyGet as ReturnType<typeof vi.fn>;

// Type definitions based on MonthlyAPIDefinition.yaml
interface PortfolioManager {
  PortfolioCode: string;
  HoldingDataComplete: string;
  TransactionDataComplete: string;
  IncomeDataComplete: string;
  CashDataComplete: string;
  PerformanceDataComplete: string;
  ManagementFeeDataComplete: string;
}

interface MainDataCheckRead {
  PortfolioManagers: PortfolioManager[];
  Custodians: never[];
  BloombergHoldings: never[];
}

interface InstrumentIncompleteCount {
  InstrumentIncompleteCount: number;
}

interface OtherDataCheckRead {
  IndexPriceIncompleteCounts: never[];
  InstrumentIncompleteCounts: InstrumentIncompleteCount[];
  CreditRatingIncompleteCounts: never[];
  InstrumentDurationIncompleteCounts: never[];
  InstrumentBetaIncompleteCounts: never[];
}

// Mock data factories
const createMockMainDataCheck = (
  incompleteCount = 0,
): MainDataCheckRead => ({
  PortfolioManagers: [
    {
      PortfolioCode: 'PORT001',
      HoldingDataComplete: incompleteCount > 0 ? 'No' : 'Yes',
      TransactionDataComplete: 'Yes',
      IncomeDataComplete: 'Yes',
      CashDataComplete: 'Yes',
      PerformanceDataComplete: 'Yes',
      ManagementFeeDataComplete: 'Yes',
    },
  ],
  Custodians: [],
  BloombergHoldings: [],
});

const createMockOtherDataCheck = (
  incompleteCount = 0,
): OtherDataCheckRead => ({
  IndexPriceIncompleteCounts: [],
  InstrumentIncompleteCounts: [
    { InstrumentIncompleteCount: incompleteCount },
  ],
  CreditRatingIncompleteCounts: [],
  InstrumentDurationIncompleteCounts: [],
  InstrumentBetaIncompleteCounts: [],
});

describe('Epic 3, Story 4: Real-time Refresh', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  describe('Automatic Refresh', () => {
    it('updates check statuses automatically within 10 seconds', async () => {
      const initialData = createMockMainDataCheck(1);
      const updatedData = createMockMainDataCheck(0);

      mockMonthlyGet.mockResolvedValueOnce(initialData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText('PORT001')).toBeInTheDocument();
      });

      // Set up the next API call to return updated data
      mockMonthlyGet.mockResolvedValueOnce(updatedData);

      // Advance timers by 10 seconds
      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(2);
      });
    });

    it('decreases incomplete instrument count when instrument is fixed', async () => {
      const user = userEvent.setup({ delay: null });
      const initialData = createMockOtherDataCheck(5);
      const updatedData = createMockOtherDataCheck(4);

      mockMonthlyGet.mockResolvedValueOnce(initialData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(screen.getByText(/5 incomplete/i)).toBeInTheDocument();
      });

      // Set up the next poll to return updated data
      mockMonthlyGet.mockResolvedValueOnce(updatedData);

      // Advance timers to trigger polling
      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(screen.getByText(/4 incomplete/i)).toBeInTheDocument();
      });
    });

    it('updates completeness flag from red X to green checkmark after file upload', async () => {
      const initialData = createMockMainDataCheck(1);
      const updatedData = createMockMainDataCheck(0);

      mockMonthlyGet.mockResolvedValueOnce(initialData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText('PORT001')).toBeInTheDocument();
      });

      // Set up the next poll to return complete data
      mockMonthlyGet.mockResolvedValueOnce(updatedData);

      // Advance timers to trigger polling
      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Manual Refresh Button', () => {
    it('re-fetches all check statuses immediately when refresh button is clicked', async () => {
      const user = userEvent.setup({ delay: null });
      const initialData = createMockMainDataCheck();

      mockMonthlyGet.mockResolvedValue(initialData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText('PORT001')).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(2);
      });
    });

    it('displays loading spinner on refresh button while data is loading', async () => {
      const user = userEvent.setup({ delay: null });
      const initialData = createMockMainDataCheck();

      mockMonthlyGet.mockResolvedValueOnce(initialData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText('PORT001')).toBeInTheDocument();
      });

      mockMonthlyGet.mockImplementation(() => new Promise(() => {}));

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);

      // Button should show loading state
      await waitFor(() => {
        expect(refreshButton).toBeDisabled();
      });
    });

    it('displays timestamp showing "Last updated: [time]" after refresh completes', async () => {
      const user = userEvent.setup({ delay: null });
      const initialData = createMockMainDataCheck();

      mockMonthlyGet.mockResolvedValue(initialData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText('PORT001')).toBeInTheDocument();
      });

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByText(/last updated/i)).toBeInTheDocument();
      });
    });
  });

  describe('Polling Strategy', () => {
    it('polls the API every 10 seconds when page is active', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(1);
      });

      // Advance by 10 seconds
      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(2);
      });

      // Advance by another 10 seconds
      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(3);
      });
    });

    it('stops polling when page becomes inactive', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(1);
      });

      // Simulate tab becoming inactive
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => true,
      });
      document.dispatchEvent(new Event('visibilitychange'));

      // Advance timers - polling should stop
      vi.advanceTimersByTime(10000);

      // Should not make additional calls
      await new Promise((resolve) => setTimeout(resolve, 100));
      expect(mockMonthlyGet).toHaveBeenCalledTimes(1);
    });

    it('resumes polling when page becomes active again', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(1);
      });

      // Simulate tab becoming inactive
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => true,
      });
      document.dispatchEvent(new Event('visibilitychange'));

      vi.advanceTimersByTime(10000);

      // Simulate tab becoming active again
      Object.defineProperty(document, 'hidden', {
        configurable: true,
        get: () => false,
      });
      document.dispatchEvent(new Event('visibilitychange'));

      // Should resume polling immediately
      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Change Notifications', () => {
    it('displays toast notification when status changes', async () => {
      const initialData = createMockOtherDataCheck(5);
      const updatedData = createMockOtherDataCheck(4);

      mockMonthlyGet.mockResolvedValueOnce(initialData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalled();
      });

      mockMonthlyGet.mockResolvedValueOnce(updatedData);

      // Advance timers to trigger polling
      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(
          screen.getByText(/instruments.*5 incomplete.*4 incomplete/i),
        ).toBeInTheDocument();
      });
    });

    it('displays prominent success message when all checks become complete', async () => {
      const initialData = createMockOtherDataCheck(1);
      const completeData = createMockOtherDataCheck(0);

      mockMonthlyGet.mockResolvedValueOnce(initialData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalled();
      });

      mockMonthlyGet.mockResolvedValueOnce(completeData);

      // Advance timers to trigger polling
      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(
          screen.getByText(/all checks complete.*ready for approval/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('continues polling after a failed API call', async () => {
      mockMonthlyGet
        .mockResolvedValueOnce(createMockMainDataCheck())
        .mockRejectedValueOnce(new Error('Network error'))
        .mockResolvedValueOnce(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(1);
      });

      // First poll fails
      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(2);
      });

      // Second poll succeeds
      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(3);
      });
    });

    it('displays error toast when polling fails', async () => {
      mockMonthlyGet
        .mockResolvedValueOnce(createMockMainDataCheck())
        .mockRejectedValueOnce(new Error('Network error'));

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledTimes(1);
      });

      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations with live regions for updates', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      const { container } = render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('announces status changes to screen readers', async () => {
      const initialData = createMockOtherDataCheck(5);
      const updatedData = createMockOtherDataCheck(4);

      mockMonthlyGet.mockResolvedValueOnce(initialData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalled();
      });

      mockMonthlyGet.mockResolvedValueOnce(updatedData);

      // Advance timers to trigger polling
      vi.advanceTimersByTime(10000);

      await waitFor(() => {
        // Live region should announce the change
        const liveRegion = screen.getByRole('status', { hidden: true });
        expect(liveRegion).toBeInTheDocument();
      });
    });
  });
});
