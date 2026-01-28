/**
 * Epic 2, Story 4: File Validation and Error Viewing
 *
 * Tests the validation error display and retry functionality.
 *
 * User Story:
 * As an Operations Lead or Analyst
 * I want to view validation errors for failed files
 * So that I can understand what went wrong and fix the issues
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
}));

import { get, post } from '@/lib/api/client';
// This import WILL FAIL until implemented - that's the point of TDD!
import FileValidationErrors from '@/components/file-import/FileValidationErrors';

const mockGet = get as ReturnType<typeof vitest.fn>;
const mockPost = post as ReturnType<typeof vitest.fn>;

// Type definitions based on FileImporterAPIDefinition.yaml
interface FileFault {
  Id: number;
  Exception: string;
  Message: string;
  FaultedActivityId: string;
  FaultedActivityName: string;
  Resuming: boolean;
}

// Mock data factory
const createMockFileFault = (overrides: Partial<FileFault> = {}): FileFault => ({
  Id: 1,
  Exception: 'System.FormatException: Invalid date format',
  Message: 'Row 5: Date field must be in format YYYY-MM-DD',
  FaultedActivityId: 'activity-123',
  FaultedActivityName: 'ValidateHoldingsData',
  Resuming: false,
  ...overrides,
});

const createMockFileFaultsResponse = (faults: FileFault[] = []) => ({
  FileFault: faults,
});

describe('Epic 2, Story 4: File Validation and Error Viewing', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Error Display', () => {
    it('displays "View Errors" button for failed files', () => {
      render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      expect(screen.getByRole('button', { name: /view errors/i })).toBeInTheDocument();
    });

    it('expands errors section when "View Errors" is clicked', async () => {
      const user = userEvent.setup();
      const faults = [
        createMockFileFault({
          Message: 'Row 5: Date field must be in format YYYY-MM-DD',
          FaultedActivityName: 'ValidateHoldingsData'
        }),
      ];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));

      render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      const viewErrorsButton = screen.getByRole('button', { name: /view errors/i });
      await user.click(viewErrorsButton);

      await waitFor(() => {
        expect(screen.getByText(/Row 5: Date field must be in format YYYY-MM-DD/i)).toBeInTheDocument();
      });
    });

    it('displays validation faults with FaultedActivityName, Message, and Exception', async () => {
      const user = userEvent.setup();
      const faults = [
        createMockFileFault({
          FaultedActivityName: 'ValidateHoldingsData',
          Message: 'Row 5: Date field must be in format YYYY-MM-DD',
          Exception: 'System.FormatException: Invalid date format'
        }),
      ];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));

      render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await userEvent.click(screen.getByRole('button', { name: /view errors/i }));

      await waitFor(() => {
        expect(screen.getByText(/ValidateHoldingsData/i)).toBeInTheDocument();
      });

      expect(screen.getByText(/Row 5: Date field must be in format YYYY-MM-DD/i)).toBeInTheDocument();
      expect(screen.getByText(/System\.FormatException/i)).toBeInTheDocument();
    });

    it('paginates errors when there are more than 10', async () => {
      const user = userEvent.setup();
      const faults = Array.from({ length: 25 }, (_, i) =>
        createMockFileFault({
          Id: i + 1,
          Message: `Row ${i + 1}: Validation error`,
        })
      );
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));

      render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      await waitFor(() => {
        expect(screen.getByText(/Row 1: Validation error/i)).toBeInTheDocument();
      });

      // Should show first 10 errors
      expect(screen.getByText(/Row 1: Validation error/i)).toBeInTheDocument();
      expect(screen.getByText(/Row 10: Validation error/i)).toBeInTheDocument();

      // Should not show 11th error yet
      expect(screen.queryByText(/Row 11: Validation error/i)).not.toBeInTheDocument();

      // Pagination controls should exist
      const nextButton = screen.getByRole('button', { name: /next|page 2/i });
      expect(nextButton).toBeInTheDocument();

      await user.click(nextButton);

      // Now should show errors 11-20
      await waitFor(() => {
        expect(screen.getByText(/Row 11: Validation error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Error Export', () => {
    it('displays "Export Errors to Excel" button when errors exist', async () => {
      const user = userEvent.setup();
      const faults = [createMockFileFault()];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));

      render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /export.*excel/i })).toBeInTheDocument();
      });
    });

    it('downloads Excel file when "Export Errors to Excel" is clicked', async () => {
      const user = userEvent.setup();
      const faults = [
        createMockFileFault({
          Message: 'Row 5: Date field invalid',
          FaultedActivityName: 'ValidateHoldingsData',
          Exception: 'System.FormatException'
        }),
      ];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));

      // Mock URL.createObjectURL
      global.URL.createObjectURL = vi.fn(() => 'blob:mock-url');
      global.URL.revokeObjectURL = vi.fn();

      render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /export.*excel/i })).toBeInTheDocument();
      });

      const exportButton = screen.getByRole('button', { name: /export.*excel/i });
      await user.click(exportButton);

      // Verify download was triggered
      await waitFor(() => {
        expect(global.URL.createObjectURL).toHaveBeenCalled();
      });
    });
  });

  describe('Retry Validation', () => {
    it('displays "Retry Validation" button for failed files', async () => {
      const user = userEvent.setup();
      const faults = [createMockFileFault()];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));

      render(
        <FileValidationErrors
          fileLogId={123}
          fileSettingId={5}
          fileFormatId={2}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry validation/i })).toBeInTheDocument();
      });
    });

    it('shows loading spinner when retrying validation', async () => {
      const user = userEvent.setup();
      const faults = [createMockFileFault()];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));
      mockPost.mockImplementation(() => new Promise(() => {})); // Never resolves

      render(
        <FileValidationErrors
          fileLogId={123}
          fileSettingId={5}
          fileFormatId={2}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      const retryButton = await screen.findByRole('button', { name: /retry validation/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByRole('progressbar', { name: /validating/i })).toBeInTheDocument();
      });
    });

    it('updates status to "Complete" when retry succeeds', async () => {
      const user = userEvent.setup();
      const faults = [createMockFileFault()];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));
      mockPost.mockResolvedValue({ message: 'Validation successful' });

      const onRetrySuccess = vi.fn();

      render(
        <FileValidationErrors
          fileLogId={123}
          fileSettingId={5}
          fileFormatId={2}
          statusColor="Red"
          hasErrors={true}
          onRetrySuccess={onRetrySuccess}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      const retryButton = await screen.findByRole('button', { name: /retry validation/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText(/validation successful/i)).toBeInTheDocument();
      });

      expect(onRetrySuccess).toHaveBeenCalled();
    });

    it('displays updated error messages when retry fails again', async () => {
      const user = userEvent.setup();
      const initialFaults = [
        createMockFileFault({ Message: 'Row 5: Date field invalid' }),
      ];
      mockGet.mockResolvedValueOnce(createMockFileFaultsResponse(initialFaults));

      mockPost.mockResolvedValue({ message: 'Validation failed' });

      const updatedFaults = [
        createMockFileFault({ Message: 'Row 5: Date field invalid' }),
        createMockFileFault({ Message: 'Row 10: Amount field missing' }),
      ];
      mockGet.mockResolvedValueOnce(createMockFileFaultsResponse(updatedFaults));

      render(
        <FileValidationErrors
          fileLogId={123}
          fileSettingId={5}
          fileFormatId={2}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      const retryButton = await screen.findByRole('button', { name: /retry validation/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText(/Row 10: Amount field missing/i)).toBeInTheDocument();
      });
    });

    it('calls retry validation API with correct parameters', async () => {
      const user = userEvent.setup();
      const faults = [createMockFileFault()];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));
      mockPost.mockResolvedValue({ message: 'Validation successful' });

      render(
        <FileValidationErrors
          fileLogId={123}
          fileSettingId={5}
          fileFormatId={2}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      const retryButton = await screen.findByRole('button', { name: /retry validation/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(mockPost).toHaveBeenCalledWith(
          expect.stringContaining('/file'),
          null,
          expect.objectContaining({
            params: expect.objectContaining({
              FileLogId: 123,
              FileSettingId: 5,
              FileFormatId: 2,
            }),
          })
        );
      });
    });
  });

  describe('Clear Messaging', () => {
    it('displays error count summary', async () => {
      const user = userEvent.setup();
      const faults = Array.from({ length: 15 }, (_, i) =>
        createMockFileFault({ Id: i + 1, Message: `Error ${i + 1}` })
      );
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));

      render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      await waitFor(() => {
        expect(screen.getByText(/15.*validation errors/i)).toBeInTheDocument();
      });
    });

    it('displays clear guidance for format issues', async () => {
      const user = userEvent.setup();
      const faults = [
        createMockFileFault({
          Message: 'Row 5: Date field must be in format YYYY-MM-DD. Found: 03/15/2024',
          FaultedActivityName: 'ValidateHoldingsData'
        }),
      ];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));

      render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      await waitFor(() => {
        expect(screen.getByText(/must be in format YYYY-MM-DD/i)).toBeInTheDocument();
      });
    });
  });

  describe('API Integration', () => {
    it('calls file/faults endpoint with correct FileLogId', async () => {
      const user = userEvent.setup();
      const faults = [createMockFileFault()];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));

      render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      await waitFor(() => {
        expect(mockGet).toHaveBeenCalledWith(
          expect.stringContaining('/file/faults'),
          expect.objectContaining({
            params: expect.objectContaining({
              FileLogId: 123,
            }),
          })
        );
      });
    });
  });

  describe('Error Handling', () => {
    it('displays error message when fetching faults fails', async () => {
      const user = userEvent.setup();
      mockGet.mockRejectedValue(new Error('Network error'));

      render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });

    it('displays error message when retry validation fails', async () => {
      const user = userEvent.setup();
      const faults = [createMockFileFault()];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));
      mockPost.mockRejectedValue(new Error('Retry failed'));

      render(
        <FileValidationErrors
          fileLogId={123}
          fileSettingId={5}
          fileFormatId={2}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      const retryButton = await screen.findByRole('button', { name: /retry validation/i });
      await user.click(retryButton);

      await waitFor(() => {
        expect(screen.getByRole('alert')).toBeInTheDocument();
      });

      expect(screen.getByText(/error|failed/i)).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const user = userEvent.setup();
      const faults = [createMockFileFault()];
      mockGet.mockResolvedValue(createMockFileFaultsResponse(faults));

      const { container } = render(
        <FileValidationErrors
          fileLogId={123}
          statusColor="Red"
          hasErrors={true}
        />
      );

      await user.click(screen.getByRole('button', { name: /view errors/i }));

      await waitFor(() => {
        expect(screen.getByText(createMockFileFault().Message)).toBeInTheDocument();
      });

      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
