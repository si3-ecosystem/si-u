/**
 * Global Error Handler
 * Handles API errors and provides user-friendly messages
 */

import { ApiErrorClass } from '@/services/api';
import { toast } from 'sonner'; // Using sonner for toast notifications

export class ErrorHandler {
  static handle(error: unknown, context?: string): void {
    console.error(`Error in ${context || 'application'}:`, error);

    if (error instanceof ApiErrorClass) {
      this.handleApiError(error);
    } else if (error instanceof Error) {
      this.handleGenericError(error);
    } else {
      this.handleUnknownError();
    }
  }

  private static handleApiError(error: ApiErrorClass): void {
    switch (error.statusCode) {
      case 400:
        toast.error(error.message || 'Invalid request. Please check your input.');
        break;
      case 401:
        toast.error('Authentication required. Please try again.');
        // Don't automatically redirect to login for API failures
        // Only redirect if this is actually an auth-related endpoint
        console.log('401 error occurred, but not redirecting to login automatically');
        break;
      case 403:
        toast.error('You do not have permission to perform this action.');
        break;
      case 404:
        toast.error('The requested resource was not found.');
        break;
      case 409:
        toast.error(error.message || 'A conflict occurred. You may have already RSVP\'d for this event.');
        break;
      case 422:
        if (error.details && error.details.length > 0) {
          error.details.forEach(detail => toast.error(detail));
        } else {
          toast.error(error.message || 'Validation failed.');
        }
        break;
      case 429:
        toast.error('Too many requests. Please try again later.');
        break;
      case 500:
      default:
        toast.error('An unexpected error occurred. Please try again.');
        break;
    }
  }

  private static handleGenericError(error: Error): void {
    toast.error(error.message || 'An unexpected error occurred.');
  }

  private static handleUnknownError(): void {
    toast.error('An unknown error occurred. Please try again.');
  }

  static getErrorMessage(error: unknown): string {
    if (error instanceof ApiErrorClass) {
      return error.message;
    } else if (error instanceof Error) {
      return error.message;
    } else {
      return 'An unknown error occurred';
    }
  }

  static showSuccess(message: string): void {
    toast.success(message);
  }

  static showInfo(message: string): void {
    toast.info(message);
  }

  static showWarning(message: string): void {
    toast.warning(message);
  }
}
