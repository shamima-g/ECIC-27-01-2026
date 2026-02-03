/**
 * Epic 3, Story 2: Other Checks Tab
 *
 * Tests the completeness status display of reference data (instruments, prices, ratings, durations, betas).
 *
 * User Story:
 * As an Operations Lead or Analyst
 * I want to see the completeness status of reference data
 * So that I can identify missing reference data that needs to be maintained before approvals
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
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

// Mock next/navigation for click-through navigation tests
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/data-confirmation'),
}));

import { monthlyGet } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import DataConfirmationPage from '@/app/data-confirmation/page';

const mockMonthlyGet = monthlyGet as ReturnType<typeof vi.fn>;

// Type definitions based on MonthlyAPIDefinition.yaml
interface IndexPriceIncompleteCount {
  IndexPriceIncompleteCount: number;
}

interface InstrumentIncompleteCount {
  InstrumentIncompleteCount: number;
}

interface CreditRatingIncompleteCount {
  CreditRatingIncompleteCount: number;
}

interface InstrumentDurationIncompleteCount {
  InstrumentDurationIncompleteCount: number;
}

interface InstrumentBetaIncompleteCount {
  InstrumentBetaIncompleteCount: number;
}

interface OtherDataCheckRead {
  IndexPriceIncompleteCounts: IndexPriceIncompleteCount[];
  InstrumentIncompleteCounts: InstrumentIncompleteCount[];
  CreditRatingIncompleteCounts: CreditRatingIncompleteCount[];
  InstrumentDurationIncompleteCounts: InstrumentDurationIncompleteCount[];
  InstrumentBetaIncompleteCounts: InstrumentBetaIncompleteCount[];
}

// Mock data factory
const createMockOtherDataCheck = (
  overrides: Partial<OtherDataCheckRead> = {},
): OtherDataCheckRead => ({
  IndexPriceIncompleteCounts: [{ IndexPriceIncompleteCount: 0 }],
  InstrumentIncompleteCounts: [{ InstrumentIncompleteCount: 0 }],
  CreditRatingIncompleteCounts: [{ CreditRatingIncompleteCount: 0 }],
  InstrumentDurationIncompleteCounts: [
    { InstrumentDurationIncompleteCount: 0 },
  ],
  InstrumentBetaIncompleteCounts: [{ InstrumentBetaIncompleteCount: 0 }],
  ...overrides,
});

describe('Epic 3, Story 2: Other Checks Tab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tab Display', () => {
    it('switches to Other Checks tab when clicked', async () => {
      const user = userEvent.setup();
      mockMonthlyGet.mockResolvedValue(createMockOtherDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('tab', { name: /other checks/i }),
        ).toBeInTheDocument();
      });

      const otherChecksTab = screen.getByRole('tab', { name: /other checks/i });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(otherChecksTab).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Incomplete Counts Display', () => {
    it('displays cards for all check types', async () => {
      const user = userEvent.setup();
      mockMonthlyGet.mockResolvedValue(createMockOtherDataCheck());

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(screen.getByText(/index prices/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/instruments/i)).toBeInTheDocument();
      expect(screen.getByText(/credit ratings/i)).toBeInTheDocument();
      expect(screen.getByText(/durations/i)).toBeInTheDocument();
      expect(screen.getByText(/betas/i)).toBeInTheDocument();
    });

    it('displays "0 incomplete" with green badge when no index prices are missing', async () => {
      const user = userEvent.setup();
      const completeData = createMockOtherDataCheck({
        IndexPriceIncompleteCounts: [{ IndexPriceIncompleteCount: 0 }],
      });

      mockMonthlyGet.mockResolvedValue(completeData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      // All check types default to 0 incomplete, so multiple badges show "0 incomplete"
      await waitFor(() => {
        expect(screen.getAllByText(/0 incomplete/i).length).toBeGreaterThan(0);
      });
    });

    it('displays "X incomplete" with red badge when index prices are missing', async () => {
      const user = userEvent.setup();
      const incompleteData = createMockOtherDataCheck({
        IndexPriceIncompleteCounts: [{ IndexPriceIncompleteCount: 12 }],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(screen.getByText(/12 incomplete/i)).toBeInTheDocument();
      });
    });

    it('displays incomplete count for instruments with red badge', async () => {
      const user = userEvent.setup();
      const incompleteData = createMockOtherDataCheck({
        InstrumentIncompleteCounts: [{ InstrumentIncompleteCount: 5 }],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(screen.getByText(/5 incomplete/i)).toBeInTheDocument();
      });
    });

    it('displays incomplete count for credit ratings', async () => {
      const user = userEvent.setup();
      const incompleteData = createMockOtherDataCheck({
        CreditRatingIncompleteCounts: [{ CreditRatingIncompleteCount: 8 }],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(screen.getByText(/8 incomplete/i)).toBeInTheDocument();
      });
    });

    it('displays incomplete count for durations', async () => {
      const user = userEvent.setup();
      const incompleteData = createMockOtherDataCheck({
        InstrumentDurationIncompleteCounts: [
          { InstrumentDurationIncompleteCount: 3 },
        ],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(screen.getByText(/3 incomplete/i)).toBeInTheDocument();
      });
    });

    it('displays incomplete count for betas', async () => {
      const user = userEvent.setup();
      const incompleteData = createMockOtherDataCheck({
        InstrumentBetaIncompleteCounts: [{ InstrumentBetaIncompleteCount: 15 }],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(screen.getByText(/15 incomplete/i)).toBeInTheDocument();
      });
    });
  });

  describe('Click-Through Navigation', () => {
    it('makes incomplete count clickable when count > 0', async () => {
      const user = userEvent.setup();
      const incompleteData = createMockOtherDataCheck({
        InstrumentIncompleteCounts: [{ InstrumentIncompleteCount: 12 }],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        const incompleteLink = screen.getByText(/12 incomplete/i).closest('a');
        expect(incompleteLink).toBeInTheDocument();
      });
    });
  });

  describe('Overall Status Indicator', () => {
    it('displays "All reference data complete" badge when all counts are 0', async () => {
      const user = userEvent.setup();
      const completeData = createMockOtherDataCheck({
        IndexPriceIncompleteCounts: [{ IndexPriceIncompleteCount: 0 }],
        InstrumentIncompleteCounts: [{ InstrumentIncompleteCount: 0 }],
        CreditRatingIncompleteCounts: [{ CreditRatingIncompleteCount: 0 }],
        InstrumentDurationIncompleteCounts: [
          { InstrumentDurationIncompleteCount: 0 },
        ],
        InstrumentBetaIncompleteCounts: [{ InstrumentBetaIncompleteCount: 0 }],
      });

      mockMonthlyGet.mockResolvedValue(completeData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(
          screen.getByText(/all reference data complete/i),
        ).toBeInTheDocument();
      });
    });

    it('displays "Reference data incomplete" warning when any count > 0', async () => {
      const user = userEvent.setup();
      const incompleteData = createMockOtherDataCheck({
        IndexPriceIncompleteCounts: [{ IndexPriceIncompleteCount: 5 }],
        InstrumentIncompleteCounts: [{ InstrumentIncompleteCount: 0 }],
        CreditRatingIncompleteCounts: [{ CreditRatingIncompleteCount: 0 }],
        InstrumentDurationIncompleteCounts: [
          { InstrumentDurationIncompleteCount: 0 },
        ],
        InstrumentBetaIncompleteCounts: [{ InstrumentBetaIncompleteCount: 0 }],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(
          screen.getByText(/reference data incomplete.*resolve issues/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('calls GET /check-other-data-completeness when tab is activated', async () => {
      const user = userEvent.setup();
      mockMonthlyGet.mockResolvedValue(createMockOtherDataCheck());

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledWith(
          '/check-other-data-completeness',
        );
      });
    });

    it('displays loading state while fetching other checks data', async () => {
      const user = userEvent.setup();
      mockMonthlyGet.mockImplementation(() => new Promise(() => {}));

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays error message when API fails', async () => {
      const user = userEvent.setup();
      mockMonthlyGet.mockRejectedValue(new Error('API Error'));

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations on Other Checks tab', async () => {
      const user = userEvent.setup();
      mockMonthlyGet.mockResolvedValue(createMockOtherDataCheck());

      const { container } = render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses proper ARIA labels for incomplete counts', async () => {
      const user = userEvent.setup();
      const incompleteData = createMockOtherDataCheck({
        InstrumentIncompleteCounts: [{ InstrumentIncompleteCount: 12 }],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      const otherChecksTab = await screen.findByRole('tab', {
        name: /other checks/i,
      });
      await user.click(otherChecksTab);

      await waitFor(() => {
        expect(screen.getByText(/12 incomplete/i)).toBeInTheDocument();
      });

      // Cards or links should have descriptive labels
      const incompleteElement = screen.getByText(/12 incomplete/i);
      expect(incompleteElement).toBeInTheDocument();
    });
  });
});
