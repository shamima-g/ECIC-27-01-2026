/**
 * Epic 1, Story 4: Start Page - Navigation Links
 *
 * Tests the navigation menu and quick action links on the Start Page.
 *
 * User Story:
 * As a user
 * I want quick navigation links to key screens
 * So that I can efficiently access the areas I need to work in
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
}));

// Mock Next.js navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
}));

import { get } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import HomePage from '@/app/page';

const mockGet = get as ReturnType<typeof vitest.fn>;

// Mock data factory
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

describe('Epic 1, Story 4: Start Page - Navigation Links', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Navigation Menu', () => {
    it('displays navigation menu with all main sections', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('navigation')).toBeInTheDocument();
      });

      // All main navigation links should be visible
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
      expect(
        screen.getByRole('link', { name: /Process Logs/i }),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: /Administration/i }),
      ).toBeInTheDocument();
    });

    it('navigates to Portfolio Imports Dashboard when File Uploads is clicked', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /File Uploads/i }),
        ).toBeInTheDocument();
      });

      const fileUploadsLink = screen.getByRole('link', {
        name: /File Uploads/i,
      });
      expect(fileUploadsLink).toHaveAttribute('href', '/file-uploads');
    });

    it('navigates to Data Confirmation screen when Data Confirmation is clicked', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /Data Confirmation/i }),
        ).toBeInTheDocument();
      });

      const dataConfirmationLink = screen.getByRole('link', {
        name: /Data Confirmation/i,
      });
      expect(dataConfirmationLink).toHaveAttribute(
        'href',
        '/data-confirmation',
      );
    });
  });

  describe('Maintenance Submenu', () => {
    it('shows submenu with maintenance links when Maintenance is clicked', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /Maintenance/i }),
        ).toBeInTheDocument();
      });

      const maintenanceLink = screen.getByRole('link', {
        name: /Maintenance/i,
      });
      await user.click(maintenanceLink);

      // Submenu items should appear
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /Instruments/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Index Prices/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Durations/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Betas/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Credit Ratings/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Report Comments/i }),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Approvals Submenu', () => {
    it('shows submenu with approval level links when Approvals is clicked', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /Approvals/i }),
        ).toBeInTheDocument();
      });

      const approvalsLink = screen.getByRole('link', { name: /Approvals/i });
      await user.click(approvalsLink);

      // Submenu items should appear
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /L1 Approval/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /L2 Approval/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /L3 Approval/i }),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Administration Submenu', () => {
    it('shows submenu with admin links when Administration is clicked', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /Administration/i }),
        ).toBeInTheDocument();
      });

      const adminLink = screen.getByRole('link', { name: /Administration/i });
      await user.click(adminLink);

      // Submenu items should appear
      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /User Management/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Role Management/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Page Access/i }),
        ).toBeInTheDocument();
      });
    });
  });

  describe('Process Logs Navigation', () => {
    it('navigates to Process Logs screen when Process Logs is clicked', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /Process Logs/i }),
        ).toBeInTheDocument();
      });

      const processLogsLink = screen.getByRole('link', {
        name: /Process Logs/i,
      });
      expect(processLogsLink).toHaveAttribute('href', '/process-logs');
    });
  });

  describe('Quick Action Cards', () => {
    it('displays quick action cards below status section', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        // Quick action cards should be visible
        expect(screen.getByText(/Upload Files/i)).toBeInTheDocument();
        expect(screen.getByText(/View Data Confirmation/i)).toBeInTheDocument();
        expect(screen.getByText(/View Approvals/i)).toBeInTheDocument();
      });
    });

    it('navigates to correct screen when quick action card is clicked', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByText(/Upload Files/i)).toBeInTheDocument();
      });

      // Find the card container and get its link
      const uploadCard = screen.getByText(/Upload Files/i).closest('a');
      expect(uploadCard).toHaveAttribute('href', '/file-uploads');
    });
  });

  describe('Role-Based Access (Placeholder for Epic 8)', () => {
    it('shows all navigation sections for Administrator role', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        // All sections visible including Administration
        expect(
          screen.getByRole('link', { name: /File Uploads/i }),
        ).toBeInTheDocument();
        expect(
          screen.getByRole('link', { name: /Administration/i }),
        ).toBeInTheDocument();
      });
    });

    // Note: Actual RBAC will be implemented in Epic 8
    // This test documents the expected behavior for future implementation
    it.skip('hides Administration section for Analyst role', async () => {
      // Will be implemented in Epic 8 with proper auth context
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /File Uploads/i }),
        ).toBeInTheDocument();
        expect(
          screen.queryByRole('link', { name: /Administration/i }),
        ).not.toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('uses semantic nav element for navigation menu', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(screen.getByRole('navigation')).toBeInTheDocument();
      });
    });

    it('navigation links are keyboard accessible', async () => {
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        const fileUploadsLink = screen.getByRole('link', {
          name: /File Uploads/i,
        });
        expect(fileUploadsLink).toBeInTheDocument();

        // Link should be focusable
        fileUploadsLink.focus();
        expect(document.activeElement).toBe(fileUploadsLink);
      });
    });

    it('submenu items are announced to screen readers', async () => {
      const user = userEvent.setup();
      mockGet.mockResolvedValue(createMockBatches());

      render(<HomePage />);

      await waitFor(() => {
        expect(
          screen.getByRole('link', { name: /Maintenance/i }),
        ).toBeInTheDocument();
      });

      const maintenanceLink = screen.getByRole('link', {
        name: /Maintenance/i,
      });
      await user.click(maintenanceLink);

      await waitFor(() => {
        // Submenu should be accessible via role
        const instrumentsLink = screen.getByRole('link', {
          name: /Instruments/i,
        });
        expect(instrumentsLink).toBeInTheDocument();
      });
    });
  });
});
