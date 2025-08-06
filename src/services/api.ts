/**
 * Base API Client
 * Handles HTTP requests with authentication and error handling
 */

import { AuthService } from '@/utils/auth';
import { ApiResponse, ApiError } from '@/types/rsvp';

export class ApiClient {
  private baseURL: string;

  constructor(baseURL: string = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080') {
    // Ensure the base URL always ends with /api
    this.baseURL = baseURL.endsWith('/api') ? baseURL : `${baseURL}/api`;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;

    // Don't set Content-Type for FormData - let browser handle it
    const isFormData = options.body instanceof FormData;

    const config: RequestInit = {
      headers: {
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...AuthService.getAuthHeaders(),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new ApiErrorClass(data);
      }

      return data;
    } catch (error) {
      if (error instanceof ApiErrorClass) {
        throw error;
      }

      // Handle network errors
      throw new ApiErrorClass({
        status: 'error',
        error: {
          message: 'Network error occurred',
          statusCode: 0,
          errorCode: 'NETWORK_ERROR',
          timestamp: new Date().toISOString(),
        },
      });
    }
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<ApiResponse<T>> {
    const url = params ? `${endpoint}?${new URLSearchParams(params)}` : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data instanceof FormData ? data : (data ? JSON.stringify(data) : undefined),
      ...options,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any, options?: RequestInit): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

// Custom API Error class
export class ApiErrorClass extends Error {
  public statusCode: number;
  public errorCode: string;
  public timestamp: string;
  public details?: string[];

  constructor(errorResponse: ApiError) {
    super(errorResponse.error.message);
    this.statusCode = errorResponse.error.statusCode;
    this.errorCode = errorResponse.error.errorCode;
    this.timestamp = errorResponse.error.timestamp;
    this.details = errorResponse.error.details;
  }
}

export const apiClient = new ApiClient();
