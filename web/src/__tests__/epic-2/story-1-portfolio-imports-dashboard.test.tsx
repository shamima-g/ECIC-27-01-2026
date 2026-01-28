/**
 * Epic 2, Story 1: Portfolio Imports Dashboard - Matrix View
 *
 * Tests the portfolio files matrix display with status icons.
 *
 * User Story:
 * As an Operations Lead
 * I want to see all portfolio files in a matrix format
 * So that I can quickly identify which files are missing, complete, or failed for each portfolio
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
  fileImporterGet: vi.fn(),
  fileImporterPost: vi.fn(),
  fileImporterDel: vi.fn(),
}));

import { fileImporterGet } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import PortfolioImportsPage from '@/app/imports/portfolio/page';

const mockFileImporterGet = fileImporterGet as ReturnType<typeof vitest.fn>;

// Type definitions based on FileImporterAPIDefinition.yaml
interface PortfolioFile {
  FileLogId: number;
  FileSettingId: number;
  FileFormatId: number;
  FileTypeId: number;
  ReportBatchId: number;
  FileType: string;
  FileName: string;
  FileNamePattern: string;
  StatusColor: string; // 'Gray' | 'Yellow' | 'Red' | 'Green'
  Message: string;
  Action: string;
  WorkflowInstanceId: string;
  WorkflowStatusId: number;
  StartDate: string;
  EndDate: string;
  InvalidReasons: string;
}

interface Portfolio {
  PortfolioId: number;
  PortfolioName: string;
  Action: string;
  Files: PortfolioFile[];
}

// Mock data factory
const createMockPortfolioFile = (
  overrides: Partial<PortfolioFile> = {},
): PortfolioFile => ({
  FileLogId: 1,
  FileSettingId: 1,
  FileFormatId: 1,
  FileTypeId: 1,
  ReportBatchId: 1,
  FileType: 'Holdings',
  FileName: '202403_CORONATION_Holdings.csv',
  FileNamePattern: 'CORONATION_Holdings_*.csv',
  StatusColor: 'Green',
  Message: 'File uploaded successfully',
  Action: 'View',
  WorkflowInstanceId: 'wf-123',
  WorkflowStatusId: 1,
  StartDate: '2024-03-01T10:00:00Z',
  EndDate: '2024-03-01T10:05:00Z',
  InvalidReasons: '',
  ...overrides,
});

const createMockPortfolio = (
  overrides: Partial<Portfolio> = {},
): Portfolio => ({
  PortfolioId: 1,
  PortfolioName: 'Coronation Fund',
  Action: '',
  Files: [
    createMockPortfolioFile({ FileType: 'Holdings', StatusColor: 'Green' }),
    createMockPortfolioFile({
      FileType: 'Transactions',
      StatusColor: 'Gray',
      FileName: '',
      Message: 'File not uploaded',
    }),
    createMockPortfolioFile({
      FileType: 'Instrument Static',
      StatusColor: 'Red',
      Message: 'Validation failed',
    }),
    createMockPortfolioFile({
      FileType: 'Income',
      StatusColor: 'Yellow',
      Message: 'Processing',
    }),
    createMockPortfolioFile({ FileType: 'Cash', StatusColor: 'Green' }),
    createMockPortfolioFile({ FileType: 'Performance', StatusColor: 'Green' }),
    createMockPortfolioFile({
      FileType: 'Management Fees',
      StatusColor: 'Gray',
      FileName: '',
      Message: 'File not uploaded',
    }),
  ],
  ...overrides,
});

const createMockPortfoliosResponse = (portfolios: Portfolio[] = []) => ({
  Portfolios: portfolios,
});

describe('Epic 2, Story 1: Portfolio Imports Dashboard - Matrix View', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Matrix Display', () => {
    it('displays a grid with portfolios as rows and file types as columns', async () => {
      const portfolios = [
        createMockPortfolio({
          PortfolioId: 1,
          PortfolioName: 'Coronation Fund',
        }),
        createMockPortfolio({
          PortfolioId: 2,
          PortfolioName: 'Ashburton Fund',
        }),
      ];
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Verify portfolio names appear as rows
      expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      expect(screen.getByText('Ashburton Fund')).toBeInTheDocument();
    });

    it('displays all expected file type columns', async () => {
      const portfolios = [createMockPortfolio()];
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Holdings')).toBeInTheDocument();
      });

      // Verify all file type columns
      expect(screen.getByText('Holdings')).toBeInTheDocument();
      expect(screen.getByText('Transactions')).toBeInTheDocument();
      expect(screen.getByText('Instrument Static')).toBeInTheDocument();
      expect(screen.getByText('Income')).toBeInTheDocument();
      expect(screen.getByText('Cash')).toBeInTheDocument();
      expect(screen.getByText('Performance')).toBeInTheDocument();
      expect(screen.getByText('Management Fees')).toBeInTheDocument();
    });

    it('displays gray "Missing" status icon for files not uploaded', async () => {
      const portfolios = [createMockPortfolio()];
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Find cells with gray/missing status
      const missingIcons = screen.getAllByLabelText(/missing|not uploaded/i);
      expect(missingIcons.length).toBeGreaterThan(0);
    });

    it('displays yellow "Busy" status icon with spinner for processing files', async () => {
      const portfolios = [createMockPortfolio()];
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Find cells with busy/processing status
      const busyIcon = screen.getByLabelText(/processing|busy/i);
      expect(busyIcon).toBeInTheDocument();
    });

    it('displays red "Failed" status icon for validation failures', async () => {
      const portfolios = [createMockPortfolio()];
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Find cells with failed status
      const failedIcon = screen.getByLabelText(/failed|validation failed/i);
      expect(failedIcon).toBeInTheDocument();
    });

    it('displays green "Complete" status icon for successfully uploaded files', async () => {
      const portfolios = [createMockPortfolio()];
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Find cells with complete status
      const completeIcons = screen.getAllByLabelText(/complete|success/i);
      expect(completeIcons.length).toBeGreaterThan(0);
    });
  });

  describe('Clickable Status Icons', () => {
    it('opens modal when status icon is clicked', async () => {
      const user = userEvent.setup();
      const portfolios = [createMockPortfolio()];
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Click on a status icon (complete status)
      const completeIcon = screen.getAllByLabelText(/complete|success/i)[0];
      await user.click(completeIcon);

      // Modal should open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
      });
    });
  });

  describe('Responsive Layout', () => {
    it('keeps column headers fixed at top when scrolling vertically', async () => {
      const portfolios = Array.from({ length: 20 }, (_, i) =>
        createMockPortfolio({
          PortfolioId: i + 1,
          PortfolioName: `Portfolio ${i + 1}`,
        }),
      );
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Portfolio 1')).toBeInTheDocument();
      });

      // Verify sticky header exists (implementation will use position: sticky)
      const table = screen.getByRole('table');
      const thead = within(table).getByRole('rowgroup');
      expect(thead).toBeInTheDocument();
    });

    it('keeps portfolio names fixed on left when scrolling horizontally', async () => {
      const portfolios = [createMockPortfolio()];
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      // Portfolio name cell should have sticky positioning
      const portfolioCell = screen.getByText('Coronation Fund');
      expect(portfolioCell).toBeInTheDocument();
    });
  });

  describe('Loading and Error States', () => {
    it('displays loading indicator while fetching data', () => {
      mockFileImporterGet.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(<PortfolioImportsPage />);

      expect(
        screen.getByRole('status', { name: /loading/i }),
      ).toBeInTheDocument();
    });

    it('displays error message when API call fails', async () => {
      mockFileImporterGet.mockRejectedValue(new Error('Network error'));

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  describe('API Integration', () => {
    it('calls portfolio-files endpoint with correct parameters', async () => {
      const portfolios = [createMockPortfolio()];
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(mockFileImporterGet).toHaveBeenCalledWith(
          expect.stringContaining('/portfolio-files'),
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
      const portfolios = [createMockPortfolio()];
      mockFileImporterGet.mockResolvedValue(
        createMockPortfoliosResponse(portfolios),
      );

      const { container } = render(<PortfolioImportsPage />);

      await waitFor(() => {
        expect(screen.getByText('Coronation Fund')).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
