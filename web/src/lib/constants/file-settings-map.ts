/**
 * File Settings Map
 *
 * Maps portfolio names and file types to their corresponding FileSettingId and filename patterns.
 * This is used when the API doesn't return FileSettingId for cells that have never had a file uploaded.
 *
 * Data source: Database file_settings table
 */

export interface FileSettingConfig {
  id: number;
  pattern: string;
}

/**
 * Portfolio-specific file settings
 * Key: Portfolio name (e.g., 'ALD-MULTI-ASSET-USD')
 * Value: Map of file type to FileSettingConfig
 */
export const PORTFOLIO_FILE_SETTINGS: Record<
  string,
  Record<string, FileSettingConfig>
> = {
  'ALD-MULTI-ASSET-USD': {
    Holdings: { id: 61, pattern: '*Holdings*.csv' },
    Transactions: { id: 62, pattern: '*Transactions*.csv' },
    'Instrument Static': { id: 60, pattern: '*InstrumentStatic*.csv' },
    Income: { id: 63, pattern: '*Income*.csv' },
    Cash: { id: 64, pattern: '*Cash*.csv' },
    Performance: { id: 65, pattern: '*Net vs Gross*.xlsx' },
    'Management Fees': { id: 66, pattern: '*.pdf' },
  },
  'BRL-GOVERNMENT-ZAR': {
    Holdings: { id: 31, pattern: '*Holdings*.csv' },
    Transactions: { id: 32, pattern: '*Transactions*.csv' },
    'Instrument Static': { id: 30, pattern: '*Instrument Static*.csv' },
    Income: { id: 33, pattern: '*Income*.csv' },
    Cash: { id: 34, pattern: '*Cash*.csv' },
    Performance: { id: 35, pattern: '*Performance*.xlsx' },
    'Management Fees': { id: 36, pattern: '*.pdf' },
  },
};

/**
 * Other (global) file settings - files not associated with a specific portfolio
 * Key: File type as returned by API
 * Value: FileSettingConfig
 */
export const OTHER_FILE_SETTINGS: Record<string, FileSettingConfig> = {
  'Monthly Index Prices': {
    id: 16,
    pattern: 'BloombergMonthlyIndexPrice*.xlsx',
  },
  Instruments: { id: 15, pattern: 'InstrumentUpload.xlsx' },
};

/**
 * Get FileSettingId for a portfolio file
 * @param portfolioName - The portfolio name (e.g., 'ALD-MULTI-ASSET-USD')
 * @param fileType - The file type (e.g., 'Instrument Static')
 * @returns FileSettingId or 0 if not found
 */
export function getPortfolioFileSettingId(
  portfolioName: string,
  fileType: string,
): number {
  return PORTFOLIO_FILE_SETTINGS[portfolioName]?.[fileType]?.id ?? 0;
}

/**
 * Get FileSettingConfig for a portfolio file
 * @param portfolioName - The portfolio name (e.g., 'ALD-MULTI-ASSET-USD')
 * @param fileType - The file type (e.g., 'Instrument Static')
 * @returns FileSettingConfig or null if not found
 */
export function getPortfolioFileSetting(
  portfolioName: string,
  fileType: string,
): FileSettingConfig | null {
  return PORTFOLIO_FILE_SETTINGS[portfolioName]?.[fileType] ?? null;
}

/**
 * Get FileSettingConfig for an "other" (global) file
 * @param fileType - The file type (e.g., 'Monthly Index Prices')
 * @returns FileSettingConfig or null if not found
 */
export function getOtherFileSetting(
  fileType: string,
): FileSettingConfig | null {
  return OTHER_FILE_SETTINGS[fileType] ?? null;
}

/**
 * Validate if a filename matches the expected pattern
 *
 * Pattern format: *keyword*.extension or exact filename
 * Examples:
 *   - '*Holdings*.csv' matches 'Portfolio_Holdings_2024.csv'
 *   - '*Income*.csv' matches '202401_Income_Report.csv'
 *   - '*.pdf' matches any PDF file
 *   - 'InstrumentUpload.xlsx' matches exact filename
 *
 * @param filename - The filename to validate
 * @param pattern - The expected pattern (e.g., '*Holdings*.csv')
 * @returns true if filename matches the pattern
 */
export function validateFilenamePattern(
  filename: string,
  pattern: string,
): boolean {
  if (!filename || !pattern) return false;

  const filenameLower = filename.toLowerCase();
  const patternLower = pattern.toLowerCase();

  // Extract extension from pattern
  const patternExtMatch = patternLower.match(/\.([a-z]+)$/);
  const patternExt = patternExtMatch ? patternExtMatch[1] : null;

  // Check extension first
  if (patternExt) {
    const filenameExtMatch = filenameLower.match(/\.([a-z]+)$/);
    const filenameExt = filenameExtMatch ? filenameExtMatch[1] : null;
    if (filenameExt !== patternExt) {
      return false;
    }
  }

  // If pattern is just *.ext, extension check is sufficient
  if (patternLower.startsWith('*.') && patternLower.indexOf('*', 1) === -1) {
    return true;
  }

  // If pattern is exact filename (no wildcards)
  if (!patternLower.includes('*')) {
    return filenameLower === patternLower;
  }

  // Extract keyword from pattern like *keyword*.ext
  // Remove extension and wildcards to get keyword
  const patternWithoutExt = patternLower.replace(/\.[a-z]+$/, '');
  const keyword = patternWithoutExt.replace(/\*/g, '').trim();

  if (keyword) {
    // Check if filename contains the keyword (case-insensitive)
    // Also normalize spaces to handle both "InstrumentStatic" and "Instrument Static" variants
    const normalizedFilename = filenameLower.replace(/\s+/g, '');
    const normalizedKeyword = keyword.replace(/\s+/g, '');
    return normalizedFilename.includes(normalizedKeyword);
  }

  return true;
}

/**
 * Get a human-readable description of the expected filename format
 * @param pattern - The pattern (e.g., '*Holdings*.csv')
 * @returns Human-readable description
 */
export function getPatternDescription(pattern: string): string {
  if (!pattern) return 'any file';

  // If pattern is just *.ext
  if (pattern.startsWith('*.') && pattern.indexOf('*', 1) === -1) {
    const ext = pattern.substring(2);
    return `a .${ext} file`;
  }

  // If exact filename
  if (!pattern.includes('*')) {
    return `exactly "${pattern}"`;
  }

  // Extract keyword and extension
  const extMatch = pattern.match(/\.([a-z]+)$/i);
  const ext = extMatch ? extMatch[1] : '';
  const patternWithoutExt = pattern.replace(/\.[a-z]+$/i, '');
  const keyword = patternWithoutExt.replace(/\*/g, '').trim();

  if (keyword && ext) {
    return `"${keyword}" in the filename with .${ext} extension`;
  } else if (keyword) {
    return `"${keyword}" in the filename`;
  } else if (ext) {
    return `a .${ext} file`;
  }

  return 'the specified format';
}
