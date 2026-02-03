/**
 * Epic 3, Story 3: Portfolio Re-imports Tab
 *
 * Tests the re-import status and history display.
 *
 * User Story:
 * As an Operations Lead
 * I want to see which portfolios are currently being re-imported
 * So that I can track the progress of re-import operations
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
  fileImporterGet: vi.fn(),
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

import { fileImporterGet } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import DataConfirmationPage from '@/app/data-confirmation/page';

const mockFileImporterGet = fileImporterGet as ReturnType<typeof vi.fn>;

// Type definitions based on FileImporterAPIDefinition.yaml
interface PortfolioFile {
  FileLogId: number;
  FileSettingId: number;
  FileFormatId: number;
  FileTypeId?: number;
  ReportBatchId: number;
  FileType: string;
  FileName: string;
  StatusColor: string;
  WorkflowStatusName?: string;
  StartDate: string;
  EndDate: string;
  Message: string;
}

interface Portfolio {
  PortfolioId: number;
  PortfolioCode: string;
  PortfolioName: string;
  Files: PortfolioFile[];
}

interface PortfolioFilesResponse {
  Portfolios: Portfolio[];
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
  StatusColor: 'Green',
  WorkflowStatusName: 'Complete',
  StartDate: '2024-03-01T10:00:00Z',
  EndDate: '2024-03-01T10:05:00Z',
  Message: 'File processed successfully',
  ...overrides,
});

const createMockPortfolio = (
  overrides: Partial<Portfolio> = {},
): Portfolio => ({
  PortfolioId: 1,
  PortfolioCode: 'PORT001',
  PortfolioName: 'Coronation Fund',
  Files: [createMockPortfolioFile()],
  ...overrides,
});

const createMockPortfolioFilesResponse = (
  overrides: Partial<PortfolioFilesResponse> = {},
): PortfolioFilesResponse => ({
  Portfolios: [createMockPortfolio()],
  ...overrides,
});

describe('Epic 3, Story 3: Portfolio Re-imports Tab', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Tab Display', () => {
    it('switches to Portfolio Re-imports tab when clicked', async () => {
      const user = userEvent.setup();
      mockFileImporterGet.mockResolvedValue(
        createMockPortfolioFilesResponse(),
      );

      render(<DataConfirmationPage />);

      await waitFor(() => {
        expect(
          screen.getByRole('tab', { name: /portfolio re-imports/i }),
        ).toBeInTheDocument();
      });

      const reimportsTab = screen.getByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(reimportsTab).toHaveAttribute('aria-selected', 'true');
      });
    });
  });

  describe('Re-import Status Display', () => {
    it('displays "No active re-imports" when no re-imports are in progress', async () => {
      const user = userEvent.setup();
      const noReimports = createMockPortfolioFilesResponse({
        Portfolios: [
          createMockPortfolio({
            Files: [
              createMockPortfolioFile({
                StatusColor: 'Green',
                WorkflowStatusName: 'Complete',
              }),
            ],
          }),
        ],
      });

      mockFileImporterGet.mockResolvedValue(noReimports);

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(screen.getByText(/no active re-imports/i)).toBeInTheDocument();
      });
    });

    it('displays portfolio code and start time for re-import in progress', async () => {
      const user = userEvent.setup();
      const activeReimport = createMockPortfolioFilesResponse({
        Portfolios: [
          createMockPortfolio({
            PortfolioCode: 'PORT001',
            Files: [
              createMockPortfolioFile({
                StatusColor: 'Yellow',
                WorkflowStatusName: 'Processing',
                StartDate: '2024-03-01T10:00:00Z',
              }),
            ],
          }),
        ],
      });

      mockFileImporterGet.mockResolvedValue(activeReimport);

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(screen.getByText('PORT001')).toBeInTheDocument();
      });

      expect(screen.getByText(/march|mar.*2024/i)).toBeInTheDocument();
    });

    it('displays progress indicator for running re-import', async () => {
      const user = userEvent.setup();
      const processingReimport = createMockPortfolioFilesResponse({
        Portfolios: [
          createMockPortfolio({
            PortfolioCode: 'PORT002',
            Files: [
              createMockPortfolioFile({
                FileType: 'Holdings',
                StatusColor: 'Yellow',
                WorkflowStatusName: 'Processing',
              }),
              createMockPortfolioFile({
                FileType: 'Transactions',
                StatusColor: 'Yellow',
                WorkflowStatusName: 'Queued',
              }),
            ],
          }),
        ],
      });

      mockFileImporterGet.mockResolvedValue(processingReimport);

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
      });
    });

    it('displays "Re-import complete" with green badge for successful re-import', async () => {
      const user = userEvent.setup();
      const completeReimport = createMockPortfolioFilesResponse({
        Portfolios: [
          createMockPortfolio({
            PortfolioCode: 'PORT003',
            Files: [
              createMockPortfolioFile({
                StatusColor: 'Green',
                WorkflowStatusName: 'Complete',
                Message: 'Re-import complete',
              }),
            ],
          }),
        ],
      });

      mockFileImporterGet.mockResolvedValue(completeReimport);

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(screen.getByText(/re-import complete/i)).toBeInTheDocument();
      });
    });

    it('displays "Re-import failed" with red badge and error message for failed re-import', async () => {
      const user = userEvent.setup();
      const failedReimport = createMockPortfolioFilesResponse({
        Portfolios: [
          createMockPortfolio({
            PortfolioCode: 'PORT004',
            Files: [
              createMockPortfolioFile({
                StatusColor: 'Red',
                WorkflowStatusName: 'Failed',
                Message: 'Validation error: Missing required columns',
              }),
            ],
          }),
        ],
      });

      mockFileImporterGet.mockResolvedValue(failedReimport);

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(screen.getByText(/re-import failed/i)).toBeInTheDocument();
      });

      expect(
        screen.getByText(/validation error.*missing required columns/i),
      ).toBeInTheDocument();
    });
  });

  describe('Re-import History', () => {
    it('displays history section with recent re-imports', async () => {
      const user = userEvent.setup();
      const historyData = createMockPortfolioFilesResponse({
        Portfolios: [
          createMockPortfolio({
            PortfolioCode: 'PORT001',
            Files: [
              createMockPortfolioFile({
                StatusColor: 'Green',
                WorkflowStatusName: 'Complete',
                StartDate: '2024-03-01T10:00:00Z',
                EndDate: '2024-03-01T10:05:00Z',
              }),
            ],
          }),
          createMockPortfolio({
            PortfolioCode: 'PORT002',
            Files: [
              createMockPortfolioFile({
                StatusColor: 'Green',
                WorkflowStatusName: 'Complete',
                StartDate: '2024-03-01T09:00:00Z',
                EndDate: '2024-03-01T09:03:00Z',
              }),
            ],
          }),
        ],
      });

      mockFileImporterGet.mockResolvedValue(historyData);

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(screen.getByText(/history|recent/i)).toBeInTheDocument();
      });

      expect(screen.getByText('PORT001')).toBeInTheDocument();
      expect(screen.getByText('PORT002')).toBeInTheDocument();
    });

    it('displays details when clicking on completed re-import', async () => {
      const user = userEvent.setup();
      const detailsData = createMockPortfolioFilesResponse({
        Portfolios: [
          createMockPortfolio({
            PortfolioCode: 'PORT005',
            Files: [
              createMockPortfolioFile({
                FileType: 'Holdings',
                StatusColor: 'Green',
                WorkflowStatusName: 'Complete',
              }),
              createMockPortfolioFile({
                FileType: 'Transactions',
                StatusColor: 'Green',
                WorkflowStatusName: 'Complete',
              }),
            ],
          }),
        ],
      });

      mockFileImporterGet.mockResolvedValue(detailsData);

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(screen.getByText('PORT005')).toBeInTheDocument();
      });

      const portfolioRow = screen.getByText('PORT005').closest('button');
      if (portfolioRow) {
        await user.click(portfolioRow);

        await waitFor(() => {
          expect(screen.getByText(/holdings/i)).toBeInTheDocument();
          expect(screen.getByText(/transactions/i)).toBeInTheDocument();
        });
      }
    });
  });

  describe('Refresh Button', () => {
    it('updates status when refresh button is clicked', async () => {
      const user = userEvent.setup();
      const initialData = createMockPortfolioFilesResponse({
        Portfolios: [
          createMockPortfolio({
            PortfolioCode: 'PORT001',
            Files: [
              createMockPortfolioFile({
                StatusColor: 'Yellow',
                WorkflowStatusName: 'Processing',
              }),
            ],
          }),
        ],
      });

      const updatedData = createMockPortfolioFilesResponse({
        Portfolios: [
          createMockPortfolio({
            PortfolioCode: 'PORT001',
            Files: [
              createMockPortfolioFile({
                StatusColor: 'Green',
                WorkflowStatusName: 'Complete',
              }),
            ],
          }),
        ],
      });

      mockFileImporterGet.mockResolvedValueOnce(initialData);

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(screen.getByText(/processing/i)).toBeInTheDocument();
      });

      mockFileImporterGet.mockResolvedValueOnce(updatedData);

      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      await user.click(refreshButton);

      await waitFor(() => {
        expect(screen.getByText(/complete/i)).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('calls GET /portfolio-files with ReportMonth and ReportYear when tab is activated', async () => {
      const user = userEvent.setup();
      mockFileImporterGet.mockResolvedValue(
        createMockPortfolioFilesResponse(),
      );

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(mockFileImporterGet).toHaveBeenCalledWith('/portfolio-files', {
          ReportMonth: expect.any(String),
          ReportYear: expect.any(Number),
        });
      });
    });

    it('displays loading state while fetching re-import data', async () => {
      const user = userEvent.setup();
      mockFileImporterGet.mockImplementation(() => new Promise(() => {}));

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('displays error message when API fails', async () => {
      const user = userEvent.setup();
      mockFileImporterGet.mockRejectedValue(new Error('API Error'));

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations on Portfolio Re-imports tab', async () => {
      const user = userEvent.setup();
      mockFileImporterGet.mockResolvedValue(
        createMockPortfolioFilesResponse(),
      );

      const { container } = render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });

    it('uses proper ARIA labels for re-import status', async () => {
      const user = userEvent.setup();
      const activeReimport = createMockPortfolioFilesResponse({
        Portfolios: [
          createMockPortfolio({
            PortfolioCode: 'PORT001',
            Files: [
              createMockPortfolioFile({
                StatusColor: 'Yellow',
                WorkflowStatusName: 'Processing',
              }),
            ],
          }),
        ],
      });

      mockFileImporterGet.mockResolvedValue(activeReimport);

      render(<DataConfirmationPage />);

      const reimportsTab = await screen.findByRole('tab', {
        name: /portfolio re-imports/i,
      });
      await user.click(reimportsTab);

      await waitFor(() => {
        const progressBar = screen.getByRole('progressbar');
        expect(progressBar).toHaveAccessibleName();
      });
    });
  });
});
