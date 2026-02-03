'use client';

/**
 * Data Confirmation Page - Epic 3
 *
 * Multi-tab interface for checking data completeness:
 * - Main File Checks: Portfolio Manager, Custodian, Bloomberg data
 * - Other Checks: Index prices, instruments, ratings, durations, betas
 * - Portfolio Re-imports: Track re-import status and history
 */

import React, { useEffect, useState, useCallback, useRef } from 'react';
import { monthlyGet, fileImporterGet } from '@/lib/api/client';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

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

interface OtherDataCheckRead {
  IndexPriceIncompleteCounts: { IndexPriceIncompleteCount: number }[];
  InstrumentIncompleteCounts: { InstrumentIncompleteCount: number }[];
  CreditRatingIncompleteCounts: { CreditRatingIncompleteCount: number }[];
  InstrumentDurationIncompleteCounts: {
    InstrumentDurationIncompleteCount: number;
  }[];
  InstrumentBetaIncompleteCounts: { InstrumentBetaIncompleteCount: number }[];
}

interface PortfolioFile {
  FileLogId: number;
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

// Status Icon component
function StatusIcon({ complete }: { complete: boolean }) {
  if (complete) {
    return (
      <span
        role="img"
        aria-label="Complete"
        className="text-green-600 font-bold"
        title="Complete"
      >
        ✓
      </span>
    );
  }
  return (
    <span
      role="img"
      aria-label="Incomplete"
      className="text-red-600 font-bold"
      title="Incomplete"
    >
      ✗
    </span>
  );
}

// Get report month/year helper
function getReportMonthYear(): { month: string; year: number } {
  const date = new Date();
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  return {
    month: monthNames[date.getMonth()],
    year: date.getFullYear(),
  };
}

export default function DataConfirmationPage() {
  const [activeTab, setActiveTab] = useState('main-file-checks');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Main data checks state
  const [mainData, setMainData] = useState<MainDataCheckRead | null>(null);

  // Other checks state
  const [otherData, setOtherData] = useState<OtherDataCheckRead | null>(null);
  const [otherLoading, setOtherLoading] = useState(false);
  const [otherError, setOtherError] = useState<string | null>(null);

  // Re-imports state
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [reimportLoading, setReimportLoading] = useState(false);
  const [reimportError, setReimportError] = useState<string | null>(null);
  const [expandedPortfolio, setExpandedPortfolio] = useState<string | null>(
    null,
  );

  // Polling interval ref
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  // Previous incomplete counts for change detection
  const prevCountsRef = useRef<Record<string, number>>({});

  // Notification states
  const [changeNotification, setChangeNotification] = useState<string | null>(
    null,
  );
  const [pollingError, setPollingError] = useState<string | null>(null);
  const [allCompleteNotification, setAllCompleteNotification] = useState(false);

  // Fetch main data completeness
  const fetchMainData = useCallback(async () => {
    try {
      const response = await monthlyGet<MainDataCheckRead>(
        '/check-main-data-completeness',
      );
      setMainData(response);
      setLastUpdated(new Date());
      return response;
    } catch (err) {
      throw err;
    }
  }, []);

  // Fetch other data completeness
  const fetchOtherData = useCallback(async () => {
    try {
      setOtherLoading(true);
      setOtherError(null);
      const response = await monthlyGet<OtherDataCheckRead>(
        '/check-other-data-completeness',
      );

      // Handle null/undefined response
      if (!response) {
        setOtherData(null);
        return null;
      }

      setOtherData(response);
      setLastUpdated(new Date());

      // Check for changes and show notifications
      const newCounts: Record<string, number> = {
        instruments:
          response.InstrumentIncompleteCounts?.[0]?.InstrumentIncompleteCount ??
          0,
        indexPrices:
          response.IndexPriceIncompleteCounts?.[0]?.IndexPriceIncompleteCount ??
          0,
        creditRatings:
          response.CreditRatingIncompleteCounts?.[0]
            ?.CreditRatingIncompleteCount ?? 0,
        durations:
          response.InstrumentDurationIncompleteCounts?.[0]
            ?.InstrumentDurationIncompleteCount ?? 0,
        betas:
          response.InstrumentBetaIncompleteCounts?.[0]
            ?.InstrumentBetaIncompleteCount ?? 0,
      };

      // Detect changes for notification
      if (Object.keys(prevCountsRef.current).length > 0) {
        for (const [key, newVal] of Object.entries(newCounts)) {
          const oldVal = prevCountsRef.current[key] ?? 0;
          if (oldVal !== newVal) {
            // Show change notification
            const keyLabel =
              key === 'instruments'
                ? 'Instruments'
                : key === 'indexPrices'
                  ? 'Index Prices'
                  : key === 'creditRatings'
                    ? 'Credit Ratings'
                    : key === 'durations'
                      ? 'Durations'
                      : 'Betas';
            setChangeNotification(
              `${keyLabel}: ${oldVal} incomplete → ${newVal} incomplete`,
            );
            // Auto-dismiss after 15 seconds (longer than polling interval)
            setTimeout(() => setChangeNotification(null), 15000);
          }
        }

        // Check if all complete now
        const totalNew = Object.values(newCounts).reduce((a, b) => a + b, 0);
        if (totalNew === 0) {
          setAllCompleteNotification(true);
          // Auto-dismiss after 15 seconds (longer than polling interval)
          setTimeout(() => setAllCompleteNotification(false), 15000);
        }
      }
      prevCountsRef.current = newCounts;

      return response;
    } catch (err) {
      setOtherError(err instanceof Error ? err.message : 'Failed to load data');
      // Don't rethrow - let component handle error state
      return null;
    } finally {
      setOtherLoading(false);
    }
  }, []);

  // Fetch portfolio files for re-imports
  const fetchPortfolioFiles = useCallback(async () => {
    try {
      setReimportLoading(true);
      setReimportError(null);
      const { month, year } = getReportMonthYear();
      const response = await fileImporterGet<PortfolioFilesResponse>(
        '/portfolio-files',
        {
          ReportMonth: month,
          ReportYear: year,
        },
      );
      setPortfolios(response?.Portfolios || []);
      setLastUpdated(new Date());
      return response;
    } catch (err) {
      setReimportError(
        err instanceof Error ? err.message : 'Failed to load data',
      );
      // Don't rethrow - let component handle error state
      return null;
    } finally {
      setReimportLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        setError(null);
        await fetchMainData();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, [fetchMainData]);

  // Polling effect - 10 second intervals
  useEffect(() => {
    // Only poll when page is visible
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Stop polling when hidden
        if (pollingRef.current) {
          clearInterval(pollingRef.current);
          pollingRef.current = null;
        }
      } else {
        // Resume polling when visible
        startPolling();
      }
    };

    const startPolling = () => {
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }

      pollingRef.current = setInterval(async () => {
        try {
          setPollingError(null);
          if (activeTab === 'main-file-checks') {
            await fetchMainData();
          } else if (activeTab === 'other-checks') {
            await fetchOtherData();
          }
        } catch (err) {
          // Show error but continue polling
          setPollingError(
            err instanceof Error ? err.message : 'Failed to refresh data',
          );
        }
      }, 10000);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Start polling if visible
    if (!document.hidden) {
      startPolling();
    }

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (pollingRef.current) {
        clearInterval(pollingRef.current);
      }
    };
  }, [activeTab, fetchMainData, fetchOtherData]);

  // Tab change handler
  const handleTabChange = async (value: string) => {
    setActiveTab(value);

    try {
      if (value === 'other-checks' && !otherData && !otherError) {
        await fetchOtherData();
      } else if (
        value === 'portfolio-re-imports' &&
        portfolios.length === 0 &&
        !reimportError
      ) {
        await fetchPortfolioFiles();
      }
    } catch {
      // Error already handled in fetch functions
    }
  };

  // Manual refresh handler
  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      if (activeTab === 'main-file-checks') {
        await fetchMainData();
      } else if (activeTab === 'other-checks') {
        await fetchOtherData();
      } else if (activeTab === 'portfolio-re-imports') {
        await fetchPortfolioFiles();
      }
    } catch {
      // Error already handled in fetch functions
    } finally {
      setRefreshing(false);
    }
  };

  // Check if all portfolios are complete
  const isAllPortfoliosComplete = (managers: PortfolioManager[]): boolean => {
    return managers.every(
      (m) =>
        m.HoldingDataComplete === 'Yes' &&
        m.TransactionDataComplete === 'Yes' &&
        m.IncomeDataComplete === 'Yes' &&
        m.CashDataComplete === 'Yes' &&
        m.PerformanceDataComplete === 'Yes' &&
        m.ManagementFeeDataComplete === 'Yes',
    );
  };

  // Check if all reference data is complete
  const isAllReferenceDataComplete = (data: OtherDataCheckRead): boolean => {
    return (
      (data.IndexPriceIncompleteCounts?.[0]?.IndexPriceIncompleteCount ?? 0) ===
        0 &&
      (data.InstrumentIncompleteCounts?.[0]?.InstrumentIncompleteCount ?? 0) ===
        0 &&
      (data.CreditRatingIncompleteCounts?.[0]?.CreditRatingIncompleteCount ??
        0) === 0 &&
      (data.InstrumentDurationIncompleteCounts?.[0]
        ?.InstrumentDurationIncompleteCount ?? 0) === 0 &&
      (data.InstrumentBetaIncompleteCounts?.[0]
        ?.InstrumentBetaIncompleteCount ?? 0) === 0
    );
  };

  // Check if any re-imports are active
  const hasActiveReimports = portfolios.some((p) =>
    p.Files.some(
      (f) =>
        f.StatusColor === 'Yellow' || f.WorkflowStatusName === 'Processing',
    ),
  );

  // Format date for display
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Show error state (but still render tabs)
  const mainError = error;

  // Render tabs even during loading so tab interactions are testable

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Data Confirmation</h1>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <span className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </span>
          )}
          <Button
            onClick={handleRefresh}
            disabled={refreshing}
            aria-label="Refresh"
          >
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>
      </div>

      {/* Status region for screen reader announcements */}
      <div role="status" aria-live="polite" className="sr-only">
        {otherData && isAllReferenceDataComplete(otherData)
          ? 'All checks complete - ready for approval'
          : ''}
      </div>

      {/* Change notification toast */}
      {changeNotification && (
        <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50">
          {changeNotification}
        </div>
      )}

      {/* All complete notification */}
      {allCompleteNotification && (
        <div className="fixed top-4 right-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded z-50">
          All checks complete - ready for approval
        </div>
      )}

      {/* Polling error notification */}
      {pollingError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          Error refreshing data: {pollingError}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="main-file-checks">Main File Checks</TabsTrigger>
          <TabsTrigger value="other-checks">Other Checks</TabsTrigger>
          <TabsTrigger value="portfolio-re-imports">
            Portfolio Re-imports
          </TabsTrigger>
        </TabsList>

        {/* Main File Checks Tab */}
        <TabsContent value="main-file-checks" className="space-y-6 mt-6">
          {loading && (
            <div
              role="progressbar"
              aria-label="Loading"
              className="flex items-center justify-center h-32"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {mainError && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
            >
              Error loading data: {mainError}
            </div>
          )}

          {mainData && !loading && (
            <>
              {/* Portfolio Manager Data */}
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Portfolio Manager Data</CardTitle>
                    {mainData.PortfolioManagers &&
                      isAllPortfoliosComplete(mainData.PortfolioManagers) && (
                        <Badge variant="default" className="bg-green-600">
                          All portfolios complete
                        </Badge>
                      )}
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PortfolioCode</TableHead>
                        <TableHead>HoldingDataComplete</TableHead>
                        <TableHead>TransactionDataComplete</TableHead>
                        <TableHead>IncomeDataComplete</TableHead>
                        <TableHead>CashDataComplete</TableHead>
                        <TableHead>PerformanceDataComplete</TableHead>
                        <TableHead>ManagementFeeDataComplete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mainData.PortfolioManagers?.map((pm) => (
                        <TableRow key={pm.PortfolioCode}>
                          <TableCell>{pm.PortfolioCode}</TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={pm.HoldingDataComplete === 'Yes'}
                            />
                          </TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={pm.TransactionDataComplete === 'Yes'}
                            />
                          </TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={pm.IncomeDataComplete === 'Yes'}
                            />
                          </TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={pm.CashDataComplete === 'Yes'}
                            />
                          </TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={pm.PerformanceDataComplete === 'Yes'}
                            />
                          </TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={pm.ManagementFeeDataComplete === 'Yes'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Custodian Data */}
              <Card>
                <CardHeader>
                  <CardTitle>Custodian Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PortfolioCode</TableHead>
                        <TableHead>CustodianHoldingDataComplete</TableHead>
                        <TableHead>CustodianTransactionDataComplete</TableHead>
                        <TableHead>CustodianCashDataComplete</TableHead>
                        <TableHead>CustodianFeeDataComplete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mainData.Custodians?.map((c) => (
                        <TableRow key={c.PortfolioCode}>
                          <TableCell>{c.PortfolioCode}</TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={
                                c.CustodianHoldingDataComplete === 'Yes'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={
                                c.CustodianTransactionDataComplete === 'Yes'
                              }
                            />
                          </TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={c.CustodianCashDataComplete === 'Yes'}
                            />
                          </TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={c.CustodianFeeDataComplete === 'Yes'}
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Bloomberg Holdings */}
              <Card>
                <CardHeader>
                  <CardTitle>Bloomberg Holdings</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PortfolioCode</TableHead>
                        <TableHead>BloombergHoldingDataComplete</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mainData.BloombergHoldings?.map((bh) => (
                        <TableRow key={bh.PortfolioCode}>
                          <TableCell>{bh.PortfolioCode}</TableCell>
                          <TableCell>
                            <StatusIcon
                              complete={
                                bh.BloombergHoldingDataComplete === 'Yes'
                              }
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>

        {/* Other Checks Tab */}
        <TabsContent value="other-checks" className="space-y-6 mt-6">
          {otherLoading && (
            <div
              role="progressbar"
              aria-label="Loading"
              className="flex items-center justify-center h-32"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {otherError && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
            >
              Error loading data: {otherError}
            </div>
          )}

          {otherData && !otherLoading && (
            <>
              {/* Overall status */}
              {isAllReferenceDataComplete(otherData) ? (
                <Badge variant="default" className="bg-green-600">
                  All reference data complete
                </Badge>
              ) : (
                <Badge variant="destructive">
                  Reference data incomplete - resolve issues before approval
                </Badge>
              )}

              {/* Change notification toast simulation */}
              {otherData &&
                Object.keys(prevCountsRef.current).length > 0 &&
                isAllReferenceDataComplete(otherData) && (
                  <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    All checks complete - ready for approval
                  </div>
                )}

              {/* Incomplete counts cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Index Prices */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Index Prices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const count =
                        otherData.IndexPriceIncompleteCounts?.[0]
                          ?.IndexPriceIncompleteCount ?? 0;
                      return count > 0 ? (
                        <a
                          href="/maintenance/index-prices"
                          className="text-red-600 hover:underline"
                        >
                          {count} incomplete
                        </a>
                      ) : (
                        <Badge variant="default" className="bg-green-600">
                          0 incomplete
                        </Badge>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Instruments */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Instruments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const count =
                        otherData.InstrumentIncompleteCounts?.[0]
                          ?.InstrumentIncompleteCount ?? 0;
                      return count > 0 ? (
                        <a
                          href="/maintenance/instruments"
                          className="text-red-600 hover:underline"
                        >
                          {count} incomplete
                        </a>
                      ) : (
                        <Badge variant="default" className="bg-green-600">
                          0 incomplete
                        </Badge>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Credit Ratings */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Credit Ratings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const count =
                        otherData.CreditRatingIncompleteCounts?.[0]
                          ?.CreditRatingIncompleteCount ?? 0;
                      return count > 0 ? (
                        <a
                          href="/maintenance/credit-ratings"
                          className="text-red-600 hover:underline"
                        >
                          {count} incomplete
                        </a>
                      ) : (
                        <Badge variant="default" className="bg-green-600">
                          0 incomplete
                        </Badge>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Durations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Durations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const count =
                        otherData.InstrumentDurationIncompleteCounts?.[0]
                          ?.InstrumentDurationIncompleteCount ?? 0;
                      return count > 0 ? (
                        <a
                          href="/maintenance/durations"
                          className="text-red-600 hover:underline"
                        >
                          {count} incomplete
                        </a>
                      ) : (
                        <Badge variant="default" className="bg-green-600">
                          0 incomplete
                        </Badge>
                      );
                    })()}
                  </CardContent>
                </Card>

                {/* Betas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Betas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {(() => {
                      const count =
                        otherData.InstrumentBetaIncompleteCounts?.[0]
                          ?.InstrumentBetaIncompleteCount ?? 0;
                      return count > 0 ? (
                        <a
                          href="/maintenance/betas"
                          className="text-red-600 hover:underline"
                        >
                          {count} incomplete
                        </a>
                      ) : (
                        <Badge variant="default" className="bg-green-600">
                          0 incomplete
                        </Badge>
                      );
                    })()}
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </TabsContent>

        {/* Portfolio Re-imports Tab */}
        <TabsContent value="portfolio-re-imports" className="space-y-6 mt-6">
          {reimportLoading && (
            <div
              role="progressbar"
              aria-label="Loading"
              className="flex items-center justify-center h-32"
            >
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {reimportError && (
            <div
              role="alert"
              className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded"
            >
              Error loading data: {reimportError}
            </div>
          )}

          {!reimportLoading && !reimportError && portfolios.length > 0 && (
            <>
              {!hasActiveReimports && (
                <Badge variant="secondary" className="mb-4">
                  No active re-imports
                </Badge>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Recent Re-imports / History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {portfolios.map((portfolio) => {
                      const hasProcessing = portfolio.Files.some(
                        (f) =>
                          f.StatusColor === 'Yellow' ||
                          f.WorkflowStatusName === 'Processing' ||
                          f.WorkflowStatusName === 'Queued',
                      );
                      const hasFailed = portfolio.Files.some(
                        (f) =>
                          f.StatusColor === 'Red' ||
                          f.WorkflowStatusName === 'Failed',
                      );
                      const isComplete = portfolio.Files.every(
                        (f) =>
                          f.StatusColor === 'Green' &&
                          f.WorkflowStatusName === 'Complete',
                      );

                      return (
                        <div
                          key={portfolio.PortfolioId}
                          className="border rounded p-4"
                        >
                          <button
                            className="w-full flex justify-between items-center text-left"
                            onClick={() =>
                              setExpandedPortfolio(
                                expandedPortfolio === portfolio.PortfolioCode
                                  ? null
                                  : portfolio.PortfolioCode,
                              )
                            }
                          >
                            <span className="font-medium">
                              {portfolio.PortfolioCode}
                            </span>
                            <div className="flex items-center gap-2">
                              {hasProcessing && (
                                <>
                                  <div
                                    role="progressbar"
                                    aria-label={`${portfolio.PortfolioCode} re-import in progress`}
                                    className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-500"
                                  ></div>
                                  <Badge variant="secondary">Processing</Badge>
                                  {portfolio.Files[0]?.StartDate && (
                                    <span className="text-sm text-gray-500">
                                      {formatDate(portfolio.Files[0].StartDate)}
                                    </span>
                                  )}
                                </>
                              )}
                              {hasFailed && (
                                <>
                                  <Badge variant="destructive">
                                    Re-import failed
                                  </Badge>
                                  {portfolio.Files.find(
                                    (f) =>
                                      f.StatusColor === 'Red' ||
                                      f.WorkflowStatusName === 'Failed',
                                  )?.Message && (
                                    <span className="text-sm text-red-600">
                                      {
                                        portfolio.Files.find(
                                          (f) =>
                                            f.StatusColor === 'Red' ||
                                            f.WorkflowStatusName === 'Failed',
                                        )?.Message
                                      }
                                    </span>
                                  )}
                                </>
                              )}
                              {isComplete && !hasProcessing && (
                                <Badge
                                  variant="default"
                                  className="bg-green-600"
                                >
                                  Re-import complete
                                </Badge>
                              )}
                            </div>
                          </button>

                          {/* Expanded details */}
                          {expandedPortfolio === portfolio.PortfolioCode && (
                            <div className="mt-4 space-y-2">
                              {portfolio.Files.map((file) => (
                                <div
                                  key={file.FileLogId}
                                  className="flex justify-between items-center p-2 bg-gray-50 rounded"
                                >
                                  <span>{file.FileType}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm">
                                      {file.WorkflowStatusName}
                                    </span>
                                    {file.Message && hasFailed && (
                                      <span className="text-sm text-red-600">
                                        {file.Message}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </main>
  );
}
