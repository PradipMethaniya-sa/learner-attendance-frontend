import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

export interface ApiError {
  success: false;
  code: string;
  message: string;
  timestamp: string;
  traceId: string;
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {

  constructor() { }

  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred. Please try again.';

    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Network error: ${error.error.message}`;
    } else if (error.status) {
      // Server-side error
      const apiError = error.error as ApiError;
      
      switch (error.status) {
        case 400:
          // Bad Request - Validation errors
          if (apiError?.code === 'ALREADY_EXISTS') {
            errorMessage = apiError.message || 'This record already exists.';
          } else if (apiError?.code === 'VALIDATION_ERROR') {
            errorMessage = apiError.message || 'Please check your input and try again.';
          } else {
            errorMessage = apiError?.message || 'Invalid request. Please check your input.';
          }
          break;
          
        case 401:
          // Unauthorized - Token expired or invalid
          errorMessage = 'Your session has expired. Please log in again.';
          this.handleUnauthorized();
          break;
          
        case 403:
          // Forbidden - User doesn't have permission
          errorMessage = apiError?.message || 'You do not have permission to perform this action.';
          break;
          
        case 404:
          // Not Found
          errorMessage = apiError?.message || 'The requested resource was not found.';
          break;
          
        case 409:
          // Conflict - Resource already exists
          errorMessage = apiError?.message || 'This record already exists or conflicts with existing data.';
          break;
          
        case 422:
          // Unprocessable Entity - Validation failed
          errorMessage = apiError?.message || 'The request could not be processed due to validation errors.';
          break;
          
        case 500:
          // Internal Server Error
          errorMessage = 'Server error occurred. Please try again later.';
          break;
          
        case 502:
        case 503:
        case 504:
          // Service unavailable
          errorMessage = 'Service is temporarily unavailable. Please try again later.';
          break;
          
        default:
          // Use API error message if available
          if (apiError?.message) {
            errorMessage = apiError.message;
          } else {
            errorMessage = `Server error (${error.status}): ${error.statusText || 'Unknown error'}`;
          }
      }
    }

    console.error('API Error:', error);
    
    return throwError(() => ({
      message: errorMessage,
      originalError: error,
      timestamp: new Date().toISOString()
    }));
  }

  private handleUnauthorized(): void {
    // Clear stored authentication data
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_id');
    
    // You could dispatch a logout action or navigate to login page
    // For now, we'll just log it
    console.warn('User unauthorized - clearing session');
    
    // In a real implementation, you might want to:
    // 1. Navigate to login page
    // 2. Show a toast/message about session expiry
    // 3. Clear any user data from services
  }

  // Helper method to get user-friendly error messages based on error codes
  getErrorMessage(errorCode: string, defaultMessage: string = 'An error occurred'): string {
    const errorMessages: { [key: string]: string } = {
      'ALREADY_EXISTS': 'This record already exists.',
      'VALIDATION_ERROR': 'Please check your input and try again.',
      'NOT_FOUND': 'The requested resource was not found.',
      'UNAUTHORIZED': 'You are not authorized to perform this action.',
      'FORBIDDEN': 'You do not have permission to perform this action.',
      'INTERNAL_ERROR': 'An internal server error occurred.',
      'SERVICE_UNAVAILABLE': 'The service is temporarily unavailable.',
      'INVALID_CREDENTIALS': 'Invalid email or password.',
      'ACCOUNT_LOCKED': 'Your account has been locked. Please contact support.',
      'EMAIL_NOT_VERIFIED': 'Please verify your email address.',
      'WEAK_PASSWORD': 'Password does not meet security requirements.',
      'INVALID_TOKEN': 'Invalid or expired authentication token.',
      'RATE_LIMIT_EXCEEDED': 'Too many requests. Please try again later.',
      'RESOURCE_CONFLICT': 'This resource conflicts with existing data.',
      'DEPENDENT_RESOURCES': 'Cannot delete this resource as it has dependent records.',
      'FILE_TOO_LARGE': 'The uploaded file is too large.',
      'INVALID_FILE_FORMAT': 'Invalid file format.',
      'NETWORK_ERROR': 'Network connection error. Please check your internet connection.',
      'TIMEOUT_ERROR': 'Request timed out. Please try again.'
    };

    return errorMessages[errorCode] || defaultMessage;
  }
}
