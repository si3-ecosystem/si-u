import { ApiResponse, ApiError, ServiceConfig, RequestOptions } from '@/types/api';
import { UnifiedAuthService } from '@/services/authService';

/**
 * Base service class providing common HTTP operations with TypeScript safety
 * Features: automatic retries, timeout handling, error standardization, auth headers
 */
export class BaseService {
  protected baseURL: string;
  protected timeout: number;
  protected retries: number;
  protected defaultHeaders: Record<string, string>;

  constructor(config: ServiceConfig) {
    this.baseURL = config.baseURL;
    this.timeout = config.timeout || 10000;
    this.retries = config.retries || 3;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      ...config.headers,
    };
  }

  /**
   * Get authentication token from storage
   */
  protected getAuthToken(): string | null {
    // Use UnifiedAuthService for consistent token access
    return UnifiedAuthService.getAuthHeaders().Authorization?.replace('Bearer ', '') || null;
  }

  /**
   * Get cookie value by name
   */
  private getCookie(name: string): string | null {
    if (typeof window === 'undefined') return null;
    
    const cookies = document.cookie.split(';');
    for (const cookie of cookies) {
      const [cookieName, ...cookieValueParts] = cookie.trim().split('=');
      if (cookieName === name) {
        return cookieValueParts.join('=');
      }
    }
    return null;
  }

  /**
   * Build headers with authentication
   */
  protected buildHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const token = this.getAuthToken();
    
    return {
      ...this.defaultHeaders,
      ...(token && { Authorization: `Bearer ${token}` }),
      ...customHeaders,
    };
  }

  /**
   * Create API error from response
   */
  protected createApiError(message: string, statusCode: number, errorCode: string): ApiError {
    const error = new Error(message) as ApiError;
    error.statusCode = statusCode;
    error.errorCode = errorCode;
    return error;
  }

  /**
   * Handle API response and extract data
   */
  protected async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    let data: any;
    
    try {
      data = await response.json();
    } catch {
      // Handle non-JSON responses
      data = { status: 'error', error: { message: 'Invalid response format', statusCode: response.status, errorCode: 'INVALID_RESPONSE' } };
    }

    if (!response.ok) {
      const errorMessage = data?.error?.message || `HTTP ${response.status}: ${response.statusText}`;
      const errorCode = data?.error?.errorCode || 'HTTP_ERROR';
      
      throw this.createApiError(errorMessage, response.status, errorCode);
    }

    return data as ApiResponse<T>;
  }

  /**
   * Make HTTP request with retry logic and timeout
   */
  protected async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const timeout = options.timeout || this.timeout;
    const retries = options.retries || this.retries;

    const requestConfig: RequestInit = {
      ...options,
      headers: this.buildHeaders(options.headers as Record<string, string>),
      credentials: 'include', // Include cookies
    };

    let lastError: Error;

    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);

        const response = await fetch(url, {
          ...requestConfig,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        return await this.handleResponse<T>(response);

      } catch (error) {
        lastError = error as Error;
        
        // Don't retry on certain errors
        if (error instanceof Error) {
          if (error.name === 'AbortError') {
            throw this.createApiError('Request timeout', 408, 'TIMEOUT');
          }
          
          if ((error as ApiError).statusCode >= 400 && (error as ApiError).statusCode < 500) {
            throw error; // Don't retry client errors
          }
        }

        // Wait before retry (exponential backoff)
        if (attempt < retries) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError!;
  }

  /**
   * GET request
   */
  protected async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params).toString()}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  /**
   * POST request
   */
  protected async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * PUT request
   */
  protected async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * DELETE request
   */
  protected async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  /**
   * PATCH request
   */
  protected async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  /**
   * Build query string from parameters
   */
  protected buildQueryString(params: Record<string, any>): string {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    return searchParams.toString();
  }

  /**
   * Log request for debugging (only in development)
   */
  protected logRequest(method: string, endpoint: string, data?: any): void {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[API] ${method} ${endpoint}`, data ? { data } : '');
    }
  }
}
