// Core API types and interfaces

export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    message: string;
    statusCode: number;
    errorCode: string;
  };
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface PaginationResponse {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiError extends Error {
  statusCode: number;
  errorCode: string;
}

// Base service configuration
export interface ServiceConfig {
  baseURL: string;
  timeout?: number;
  retries?: number;
  headers?: Record<string, string>;
}

// Request options
export interface RequestOptions extends RequestInit {
  timeout?: number;
  retries?: number;
}

// Generic CRUD operations
export interface CrudService<T, CreateData = Partial<T>, UpdateData = Partial<T>> {
  getAll(params?: PaginationParams): Promise<ApiResponse<T[]>>;
  getById(id: string): Promise<ApiResponse<T>>;
  create(data: CreateData): Promise<ApiResponse<T>>;
  update(id: string, data: UpdateData): Promise<ApiResponse<T>>;
  delete(id: string): Promise<ApiResponse<void>>;
}

// Content types for commenting system
export type ContentType =
  | 'guide_session'
  | 'guide_ideas_lab'
  | 'scholar_session'
  | 'scholar_ideas_lab'
  | 'grow3dge-idea-lab'
  | 'grow3dge-session';

// User roles
export type UserRole = 'admin' | 'guide' | 'scholar' | 'partner' | 'team';

// Generic content item
export interface ContentItem {
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
