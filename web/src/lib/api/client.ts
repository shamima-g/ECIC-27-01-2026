/**
 * Base API Client Template
 *
 * A reusable fetch wrapper providing:
 * - Error handling for common HTTP status codes
 * - Automatic JSON parsing
 * - Request/response logging for development
 * - Type-safe API responses
 *
 * USAGE:
 * 1. Update API_BASE_URL in constants.ts or environment variables
 * 2. Define your API endpoints as functions that call apiClient
 * 3. Customize error handling and logging as needed
 */

import {
  API_BASE_URL,
  MONTHLY_API_BASE_URL,
  FILE_IMPORTER_API_BASE_URL,
  DATA_MAINTENANCE_API_BASE_URL,
  API_KEY,
} from '@/lib/utils/constants';
import type {
  APIError,
  APIRequestConfig,
  DefaultResponse,
  HTTPStatusCode,
} from '@/types/api';

/**
 * Main API client function that wraps fetch with error handling and logging
 *
 * @param endpoint - API endpoint path (e.g., '/v1/resource')
 * @param config - Request configuration including method, body, headers, etc.
 * @returns Promise with parsed JSON response
 * @throws APIError on HTTP errors or network failures
 */
export async function apiClient<T = unknown>(
  endpoint: string,
  config: APIRequestConfig = {},
): Promise<T> {
  const { params, lastChangedUser, isBinaryResponse, baseUrl, ...fetchConfig } =
    config;

  // Build full URL with query parameters
  const url = buildUrl(endpoint, params, baseUrl);

  // Build headers
  const headers = buildHeaders(
    fetchConfig.method,
    lastChangedUser,
    fetchConfig.headers,
    fetchConfig.body ?? undefined,
  );

  // Log request in development
  logRequest(url, fetchConfig.method || 'GET', fetchConfig.body ?? undefined);

  try {
    const response = await fetch(url, {
      ...fetchConfig,
      headers,
      body: fetchConfig.body ?? undefined,
    });

    // Log response in development
    logResponse(response);

    // Handle specific error status codes
    if (!response.ok) {
      await handleErrorResponse(response, url);
    }

    // Handle successful responses
    return await handleSuccessResponse<T>(response, isBinaryResponse);
  } catch (error) {
    // Handle network errors or other unexpected errors
    if (error instanceof Error && error.name === 'TypeError') {
      throw createAPIError(
        'Network error: Unable to connect to the API server',
        0,
        ['Please check your internet connection and try again.'],
        url,
      );
    }

    // Re-throw API errors
    throw error;
  }
}

/**
 * Builds the full URL with query parameters
 */
function buildUrl(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
  customBaseUrl?: string,
): string {
  const baseUrl = `${customBaseUrl || API_BASE_URL}${endpoint}`;

  if (!params) {
    return baseUrl;
  }

  // Filter out undefined values and build query string
  const queryParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      queryParams.append(key, String(value));
    }
  });

  const queryString = queryParams.toString();
  return queryString ? `${baseUrl}?${queryString}` : baseUrl;
}

/**
 * Builds request headers
 * Only sets Content-Type when there's a request body
 */
function buildHeaders(
  method?: string,
  lastChangedUser?: string,
  customHeaders?: HeadersInit,
  body?: BodyInit,
): Record<string, string> {
  const baseHeaders: Record<string, string> = {
    // Add API key to all requests
    [API_KEY.HEADER_NAME]: API_KEY.VALUE,
  };

  // Convert HeadersInit to plain object if needed
  if (customHeaders) {
    if (customHeaders instanceof Headers) {
      customHeaders.forEach((value, key) => {
        baseHeaders[key] = value;
      });
    } else if (Array.isArray(customHeaders)) {
      customHeaders.forEach(([key, value]) => {
        baseHeaders[key] = value;
      });
    } else {
      Object.assign(baseHeaders, customHeaders);
    }
  }

  // Only set Content-Type for requests with a body
  const hasBody = body !== undefined;
  const methodsWithBody = ['POST', 'PUT', 'PATCH'];
  const shouldSetContentType =
    hasBody || (method && methodsWithBody.includes(method.toUpperCase()));

  if (shouldSetContentType && !baseHeaders['Content-Type']) {
    // Don't set Content-Type for FormData - browser must set it automatically
    // with the correct multipart boundary
    const isFormData =
      typeof FormData !== 'undefined' && body instanceof FormData;
    if (!isFormData) {
      baseHeaders['Content-Type'] = 'application/json';
    }
  }

  // Add custom headers (e.g., LastChangedUser for audit trails)
  if (lastChangedUser) {
    baseHeaders['LastChangedUser'] = lastChangedUser;
  }

  return baseHeaders;
}

/**
 * Handles error responses from the API
 * Customize this function based on your API's error response format
 */
async function handleErrorResponse(
  response: Response,
  url: string,
): Promise<never> {
  const statusCode = response.status as HTTPStatusCode;

  // Try to extract error details from response body
  let errorMessages: string[] = [];
  let defaultMessage = `HTTP ${statusCode}: ${response.statusText}`;

  try {
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = (await response.json()) as DefaultResponse;

      if (errorData.Messages && errorData.Messages.length > 0) {
        errorMessages = errorData.Messages;
        defaultMessage = errorMessages[0];
      } else if (errorData.MessageType) {
        defaultMessage = `${errorData.MessageType}: ${defaultMessage}`;
      }
    }
  } catch {
    // If parsing fails, use default error message
  }

  // Handle specific status codes
  // Customize these messages based on your application's needs
  switch (statusCode) {
    case 401:
      throw createAPIError(
        'Unauthorized: Please log in to continue',
        statusCode,
        errorMessages.length > 0
          ? errorMessages
          : ['Your session may have expired. Please log in again.'],
        url,
      );

    case 403:
      throw createAPIError(
        'Forbidden: You do not have permission to perform this action',
        statusCode,
        errorMessages.length > 0 ? errorMessages : ['Access denied.'],
        url,
      );

    case 404:
      throw createAPIError(
        'Not Found: The requested resource does not exist',
        statusCode,
        errorMessages.length > 0 ? errorMessages : ['Resource not found.'],
        url,
      );

    case 500:
      throw createAPIError(
        'Internal Server Error: Something went wrong on the server',
        statusCode,
        errorMessages.length > 0
          ? errorMessages
          : [
              'Please try again later or contact support if the problem persists.',
            ],
        url,
      );

    default:
      throw createAPIError(
        defaultMessage,
        statusCode,
        errorMessages.length > 0
          ? errorMessages
          : [`Request failed with status ${statusCode}`],
        url,
      );
  }
}

/**
 * Handles successful API responses
 * Parses JSON or returns void for 204 No Content responses
 * For binary responses, returns a Blob
 */
async function handleSuccessResponse<T>(
  response: Response,
  isBinaryResponse?: boolean,
): Promise<T> {
  // Handle 204 No Content responses (e.g., DELETE operations)
  if (response.status === 204) {
    return undefined as T;
  }

  // If explicitly marked as binary response, always return blob
  if (isBinaryResponse) {
    return (await response.blob()) as T;
  }

  const contentType = response.headers.get('content-type');

  // Handle JSON responses
  if (contentType && contentType.includes('application/json')) {
    return (await response.json()) as T;
  }

  // Handle binary responses (e.g., file downloads)
  if (contentType && contentType.includes('application/octet-stream')) {
    return (await response.blob()) as T;
  }

  // Fallback: try to parse as JSON
  try {
    return (await response.json()) as T;
  } catch {
    // If JSON parsing fails, return undefined
    return undefined as T;
  }
}

/**
 * Creates a standardized APIError object
 */
function createAPIError(
  message: string,
  statusCode: number,
  details: string[],
  endpoint: string,
): APIError {
  return {
    message,
    statusCode,
    details,
    endpoint,
  };
}

/**
 * Sanitizes request body for safe logging by removing sensitive fields
 * Customize the sensitiveFields array based on your application's needs
 */
function sanitizeBodyForLogging(body: BodyInit | null): unknown {
  if (!body) {
    return null;
  }

  try {
    const parsed = JSON.parse(body as string);
    const sensitiveFields = [
      'password',
      'token',
      'apiKey',
      'secret',
      'creditCard',
      'ssn',
    ];

    // Create a sanitized copy
    const sanitized = { ...parsed };

    // Remove or mask sensitive fields
    Object.keys(sanitized).forEach((key) => {
      if (sensitiveFields.some((field) => key.toLowerCase().includes(field))) {
        sanitized[key] = '***REDACTED***';
      }
    });

    return sanitized;
  } catch {
    return '[Unable to parse body]';
  }
}

/**
 * Logs API request details in development mode
 * Automatically sanitizes sensitive fields for security
 */
function logRequest(url: string, method: string, body?: BodyInit | null): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`API Request: ${method} ${url}`);
    console.log('URL:', url);
    console.log('Method:', method);

    if (body) {
      console.log('Body:', sanitizeBodyForLogging(body));
    }

    console.groupEnd();
  }
}

/**
 * Logs API response details in development mode
 */
function logResponse(response: Response): void {
  if (process.env.NODE_ENV === 'development') {
    const statusEmoji = response.ok ? '✅' : '❌';
    console.log(
      `${statusEmoji} API Response: ${response.status} ${response.statusText}`,
    );
  }
}

/**
 * Configuration object for GET requests
 */
interface GetConfig {
  params?: Record<string, string | number | boolean | undefined>;
  baseUrl?: string;
}

/**
 * Convenience method for GET requests
 * Supports two calling patterns:
 * 1. get(endpoint, params) - params directly
 * 2. get(endpoint, { params, baseUrl }) - config object with params and optional baseUrl
 */
export async function get<T>(
  endpoint: string,
  configOrParams?:
    | GetConfig
    | Record<string, string | number | boolean | undefined>,
): Promise<T> {
  // Detect if second arg is a config object (has params property) or direct params
  if (configOrParams && 'params' in configOrParams) {
    const config = configOrParams as GetConfig;
    return apiClient<T>(endpoint, {
      method: 'GET',
      params: config.params,
      baseUrl: config.baseUrl,
    });
  }
  // Direct params style
  return apiClient<T>(endpoint, {
    method: 'GET',
    params: configOrParams as Record<
      string,
      string | number | boolean | undefined
    >,
  });
}

/**
 * Configuration object for POST requests
 */
interface PostConfig {
  params?: Record<string, string | number | boolean | undefined>;
  baseUrl?: string;
  lastChangedUser?: string;
}

/**
 * Convenience method for POST requests
 * Supports config object with params and baseUrl
 */
export async function post<T>(
  endpoint: string,
  body?: unknown,
  configOrUser?: PostConfig | string,
): Promise<T> {
  // Detect if third arg is a config object or just lastChangedUser string
  if (configOrUser && typeof configOrUser === 'object') {
    const config = configOrUser as PostConfig;
    return apiClient<T>(endpoint, {
      method: 'POST',
      body:
        body instanceof FormData
          ? body
          : body
            ? JSON.stringify(body)
            : undefined,
      params: config.params,
      baseUrl: config.baseUrl,
      lastChangedUser: config.lastChangedUser,
    });
  }
  // Legacy style with just lastChangedUser string
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    lastChangedUser: configOrUser as string,
  });
}

/**
 * Convenience method for PUT requests
 */
export async function put<T>(
  endpoint: string,
  body?: unknown,
  lastChangedUser?: string,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    lastChangedUser,
  });
}

/**
 * Configuration object for DELETE requests
 */
interface DelConfig {
  params?: Record<string, string | number | boolean | undefined>;
  baseUrl?: string;
  lastChangedUser?: string;
}

/**
 * Convenience method for DELETE requests
 * Supports config object with params and baseUrl
 */
export async function del<T>(
  endpoint: string,
  configOrUser?: DelConfig | string,
): Promise<T> {
  // Detect if second arg is a config object or just lastChangedUser string
  if (configOrUser && typeof configOrUser === 'object') {
    const config = configOrUser as DelConfig;
    return apiClient<T>(endpoint, {
      method: 'DELETE',
      params: config.params,
      baseUrl: config.baseUrl,
      lastChangedUser: config.lastChangedUser,
    });
  }
  // Legacy style with just lastChangedUser string
  return apiClient<T>(endpoint, {
    method: 'DELETE',
    lastChangedUser: configOrUser as string,
  });
}

// ============================================================
// Monthly Process API convenience methods
// ============================================================

/**
 * Convenience method for Monthly API GET requests
 */
export async function monthlyGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'GET',
    params,
    baseUrl: MONTHLY_API_BASE_URL,
  });
}

/**
 * Convenience method for Monthly API POST requests
 */
export async function monthlyPost<T>(
  endpoint: string,
  body?: unknown,
  lastChangedUser?: string,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    lastChangedUser,
    baseUrl: MONTHLY_API_BASE_URL,
  });
}

/**
 * Convenience method for Monthly API PUT requests
 */
export async function monthlyPut<T>(
  endpoint: string,
  body?: unknown,
  lastChangedUser?: string,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    lastChangedUser,
    baseUrl: MONTHLY_API_BASE_URL,
  });
}

/**
 * Convenience method for Monthly API DELETE requests
 */
export async function monthlyDel<T>(
  endpoint: string,
  lastChangedUser?: string,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'DELETE',
    lastChangedUser,
    baseUrl: MONTHLY_API_BASE_URL,
  });
}

// ============================================================
// File Importer API convenience methods
// ============================================================

/**
 * Convenience method for File Importer API GET requests
 */
export async function fileImporterGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'GET',
    params,
    baseUrl: FILE_IMPORTER_API_BASE_URL,
  });
}

/**
 * Configuration for File Importer POST requests
 */
interface FileImporterPostConfig {
  params?: Record<string, string | number | boolean | undefined>;
  lastChangedUser?: string;
}

/**
 * Convenience method for File Importer API POST requests
 * Supports FormData for file uploads and query params
 */
export async function fileImporterPost<T>(
  endpoint: string,
  body?: unknown,
  config?: FileImporterPostConfig,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    params: config?.params,
    lastChangedUser: config?.lastChangedUser,
    baseUrl: FILE_IMPORTER_API_BASE_URL,
  });
}

/**
 * Configuration for File Importer binary upload requests
 */
interface FileImporterUploadConfig {
  params?: Record<string, string | number | boolean | undefined>;
  lastChangedUser?: string;
}

/**
 * Convenience method for File Importer API binary file uploads
 * Sends raw binary data with application/octet-stream content type
 * as required by the /file/upload endpoint per OpenAPI spec
 */
export async function fileImporterUpload<T>(
  endpoint: string,
  file: File | Blob,
  config?: FileImporterUploadConfig,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: file,
    headers: {
      'Content-Type': 'application/octet-stream',
    },
    params: config?.params,
    lastChangedUser: config?.lastChangedUser,
    baseUrl: FILE_IMPORTER_API_BASE_URL,
  });
}

/**
 * Convenience method for File Importer API DELETE requests
 */
export async function fileImporterDel<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
  lastChangedUser?: string,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'DELETE',
    params,
    lastChangedUser,
    baseUrl: FILE_IMPORTER_API_BASE_URL,
  });
}

// ============================================================
// Data Maintenance API convenience methods
// ============================================================

/**
 * Convenience method for Data Maintenance API GET requests
 */
export async function dataMaintenanceGet<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean | undefined>,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'GET',
    params,
    baseUrl: DATA_MAINTENANCE_API_BASE_URL,
  });
}

/**
 * Convenience method for Data Maintenance API POST requests
 */
export async function dataMaintenancePost<T>(
  endpoint: string,
  body?: unknown,
  lastChangedUser?: string,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
    lastChangedUser,
    baseUrl: DATA_MAINTENANCE_API_BASE_URL,
  });
}

/**
 * Convenience method for Data Maintenance API PUT requests
 */
export async function dataMaintenancePut<T>(
  endpoint: string,
  body?: unknown,
  lastChangedUser?: string,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(body),
    lastChangedUser,
    baseUrl: DATA_MAINTENANCE_API_BASE_URL,
  });
}

/**
 * Convenience method for Data Maintenance API DELETE requests
 */
export async function dataMaintenanceDel<T>(
  endpoint: string,
  lastChangedUser?: string,
): Promise<T> {
  return apiClient<T>(endpoint, {
    method: 'DELETE',
    lastChangedUser,
    baseUrl: DATA_MAINTENANCE_API_BASE_URL,
  });
}
