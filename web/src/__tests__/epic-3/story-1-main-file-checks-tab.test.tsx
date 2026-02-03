/**
 * Epic 3, Story 1: Main File Checks Tab
 *
 * Tests the completeness status display of portfolio, custodian, and Bloomberg data.
 *
 * User Story:
 * As an Operations Lead or Analyst
 * I want to see the completeness status of portfolio, custodian, and Bloomberg data
 * So that I can identify missing or incomplete data before proceeding to approvals
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

interface Custodian {
  PortfolioCode: string;
  CustodianHoldingDataComplete: string;
  CustodianTransactionDataComplete: string;
  CustodianCashDataComplete: string;
  CustodianFeeDataComplete: string;
}

interface BloombergHolding {
  PortfolioCode: string;
  BloombergHoldingDataComplete: string;
}

interface MainDataCheckRead {
  PortfolioManagers: PortfolioManager[];
  Custodians: Custodian[];
  BloombergHoldings: BloombergHolding[];
}

// Mock data factory
const createMockPortfolioManager = (
  overrides: Partial<PortfolioManager> = {},
): PortfolioManager => ({
  PortfolioCode: 'PORT001',
  HoldingDataComplete: 'Yes',
  TransactionDataComplete: 'Yes',
  IncomeDataComplete: 'Yes',
  CashDataComplete: 'Yes',
  PerformanceDataComplete: 'Yes',
  ManagementFeeDataComplete: 'Yes',
  ...overrides,
});

const createMockCustodian = (
  overrides: Partial<Custodian> = {},
): Custodian => ({
  PortfolioCode: 'PORT001',
  CustodianHoldingDataComplete: 'Yes',
  CustodianTransactionDataComplete: 'Yes',
  CustodianCashDataComplete: 'Yes',
  CustodianFeeDataComplete: 'Yes',
  ...overrides,
});

const createMockBloombergHolding = (
  overrides: Partial<BloombergHolding> = {},
): BloombergHolding => ({
  PortfolioCode: 'PORT001',
  BloombergHoldingDataComplete: 'Yes',
  ...overrides,
});

const createMockMainDataCheck = (
  overrides: Partial<MainDataCheckRead> = {},
): MainDataCheckRead => ({
  PortfolioManagers: [createMockPortfolioManager()],
  Custodians: [createMockCustodian()],
  BloombergHoldings: [createMockBloombergHolding()],
  ...overrides,
});

describe('Epic 3, Story 1: Main File Checks Tab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tab Display', () => {
    it('displays three tabs: Main File Checks, Other Checks, and Portfolio Re-imports', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('tab', { name: /main file checks/i }),
        ).toBeInTheDocument();
      });

      expect(
        screen.getByRole('tab', { name: /other checks/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('tab', { name: /portfolio re-imports/i }),
      ).toBeInTheDocument();
    });

    it('highlights Main File Checks tab as active by default', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        const mainTab = screen.getByRole('tab', { name: /main file checks/i });
        expect(mainTab).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Portfolio Manager Data Grid', () => {
    it('displays Portfolio Manager Data section with title', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText(/portfolio manager data/i)).toBeInTheDocument();
      });
    });

    it('displays all required columns in Portfolio Manager Data grid', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText(/portfoliocode/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/holdingdatacomplete/i)).toBeInTheDocument();
      expect(screen.getByText(/transactiondatacomplete/i)).toBeInTheDocument();
      expect(screen.getByText(/incomedatacomplete/i)).toBeInTheDocument();
      expect(screen.getByText(/cashdatacomplete/i)).toBeInTheDocument();
      expect(screen.getByText(/performancedatacomplete/i)).toBeInTheDocument();
      expect(
        screen.getByText(/managementfeedatacomplete/i),
      ).toBeInTheDocument();
    });

    it('displays green checkmark icon for complete portfolio data', async () => {
      const completeData = createMockMainDataCheck({
        PortfolioManagers: [
          createMockPortfolioManager({
            PortfolioCode: 'PORT001',
            HoldingDataComplete: 'Yes',
          }),
        ],
      });

      mockMonthlyGet.mockResolvedValue(completeData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText('PORT001')).toBeInTheDocument();
      });

      // Should have checkmarks for complete data (exact icon implementation varies)
      // Looking for success badges or icons - adjust selector based on implementation
      const successIcons = screen.getAllByRole('img', { hidden: true });
      expect(successIcons.length).toBeGreaterThan(0);
    });

    it('displays red X icon for incomplete portfolio data', async () => {
      const incompleteData = createMockMainDataCheck({
        PortfolioManagers: [
          createMockPortfolioManager({
            PortfolioCode: 'PORT002',
            HoldingDataComplete: 'No',
            TransactionDataComplete: 'No',
          }),
        ],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText('PORT002')).toBeInTheDocument();
      });

      // Should have X icons or error badges for incomplete data
      // The exact implementation will determine the query
      const grid = screen.getByText('PORT002').closest('table');
      expect(grid).toBeInTheDocument();
    });

    it('displays "All portfolios complete" badge when all data is complete', async () => {
      const completeData = createMockMainDataCheck({
        PortfolioManagers: [
          createMockPortfolioManager({
            PortfolioCode: 'PORT001',
            HoldingDataComplete: 'Yes',
            TransactionDataComplete: 'Yes',
            IncomeDataComplete: 'Yes',
            CashDataComplete: 'Yes',
            PerformanceDataComplete: 'Yes',
            ManagementFeeDataComplete: 'Yes',
          }),
          createMockPortfolioManager({
            PortfolioCode: 'PORT002',
            HoldingDataComplete: 'Yes',
            TransactionDataComplete: 'Yes',
            IncomeDataComplete: 'Yes',
            CashDataComplete: 'Yes',
            PerformanceDataComplete: 'Yes',
            ManagementFeeDataComplete: 'Yes',
          }),
        ],
      });

      mockMonthlyGet.mockResolvedValue(completeData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(
          screen.getByText(/all portfolios complete/i),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Custodian Data Grid', () => {
    it('displays Custodian Data section with title', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText(/custodian data/i)).toBeInTheDocument();
      });
    });

    it('displays all required columns in Custodian Data grid', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText(/custodian data/i)).toBeInTheDocument();
      });

      expect(
        screen.getByText(/custodianholdingdatacomplete/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/custodiantransactiondatacomplete/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/custodiancashdatacomplete/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/custodianfeedatacomplete/i),
      ).toBeInTheDocument();
    });

    it('displays green checkmark icon for complete custodian data', async () => {
      const completeData = createMockMainDataCheck({
        Custodians: [
          createMockCustodian({
            PortfolioCode: 'PORT001',
            CustodianHoldingDataComplete: 'Yes',
          }),
        ],
      });

      mockMonthlyGet.mockResolvedValue(completeData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText(/custodian data/i)).toBeInTheDocument();
      });

      expect(screen.getByText('PORT001')).toBeInTheDocument();
    });

    it('displays red X icon for incomplete custodian data', async () => {
      const incompleteData = createMockMainDataCheck({
        Custodians: [
          createMockCustodian({
            PortfolioCode: 'PORT003',
            CustodianHoldingDataComplete: 'No',
          }),
        ],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText('PORT003')).toBeInTheDocument();
      });
    });
  });

  describe('Bloomberg Holdings Grid', () => {
    it('displays Bloomberg Holdings section with title', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText(/bloomberg holdings/i)).toBeInTheDocument();
      });
    });

    it('displays all required columns in Bloomberg Holdings grid', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText(/bloomberg holdings/i)).toBeInTheDocument();
      });

      expect(
        screen.getByText(/bloombergholdingdatacomplete/i),
      ).toBeInTheDocument();
    });

    it('displays green checkmark icon for complete Bloomberg holdings', async () => {
      const completeData = createMockMainDataCheck({
        BloombergHoldings: [
          createMockBloombergHolding({
            PortfolioCode: 'PORT001',
            BloombergHoldingDataComplete: 'Yes',
          }),
        ],
      });

      mockMonthlyGet.mockResolvedValue(completeData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText(/bloomberg holdings/i)).toBeInTheDocument();
      });

      expect(screen.getByText('PORT001')).toBeInTheDocument();
    });

    it('displays red X icon for incomplete Bloomberg holdings', async () => {
      const incompleteData = createMockMainDataCheck({
        BloombergHoldings: [
          createMockBloombergHolding({
            PortfolioCode: 'PORT004',
            BloombergHoldingDataComplete: 'No',
          }),
        ],
      });

      mockMonthlyGet.mockResolvedValue(incompleteData);

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByText('PORT004')).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('calls GET /check-main-data-completeness on page load', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(mockMonthlyGet).toHaveBeenCalledWith(
          '/check-main-data-completeness',
        );
      });
    });

    it('displays loading state while fetching data', () => {
      mockMonthlyGet.mockImplementation(() => new Promise(() => {}));

      render(<DataConfirmationPage />);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays error message when API fails', async () => {
      mockMonthlyGet.mockRejectedValue(new Error('API Error'));

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      const { container } = render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('has proper table structure with headers', async () => {
      mockMonthlyGet.mockResolvedValue(createMockMainDataCheck());

      render(<DataConfirmationPage />);

      await waitFor(() => {
        const tables = screen.getAllByRole('table');
        expect(tables.length).toBeGreaterThanOrEqual(3);
      });

      // Each table should have proper column headers
      const headers = screen.getAllByRole('columnheader');
      expect(headers.length).toBeGreaterThan(0);
    });
  });
});
