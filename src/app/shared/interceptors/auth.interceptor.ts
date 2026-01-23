import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { inject } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private toastr = inject(ToastrService);

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('access_token'); // Only use token if no userData
    const userData = this.getUserData();
    const headers: { [key: string]: string } = {};
    if (userData && !this.isExcludedUrl(request.url)) {
      const authToken = localStorage.getItem('access_token');
      if (authToken) {
        headers['Authorization'] = `Bearer ${authToken}`;
      }
    }
    const schoolId = userData?.school?.id;
    const termId = userData?.activeTermId;
    const yearId = userData?.activeAcademicYearId;

    if (schoolId) {
      headers['x-school-id'] = schoolId;
    }
    if (termId) {
      headers['x-academic-term-id'] = termId;
    }
    if (yearId) {
      headers['x-academic-year-id'] = yearId;
    }

    // Clone request with all headers
    if (Object.keys(headers).length > 0) {
      request = request.clone({
        setHeaders: headers
      });
    }

    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error);
      })
    );
  }

  private isExcludedUrl(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/change-password');
  }

  private getUserData(): any {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unexpected error occurred';
    let errorType: 'error' | 'warning' | 'info' = 'error';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client error: ${error.error.message}`;
    } else {
      // Server-side error
      switch (error.status) {
        case 0:
          errorMessage = 'Network error. Please check your internet connection.';
          break;
        case 400:
          errorMessage = error.error?.message || 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = error.error?.message || 'Unauthorized. Please log in again.';
          this.handleUnauthorized();
          break;
        case 403:
          errorMessage = 'Access denied. You do not have permission to perform this action.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 422:
          errorMessage = error.error?.message || 'Validation error. Please check your input.';
          break;
        case 429:
          errorMessage = 'Too many requests. Please try again later.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        case 502:
          errorMessage = 'Service temporarily unavailable. Please try again later.';
          break;
        case 503:
          errorMessage = 'Service maintenance. Please try again later.';
          break;
        default:
          errorMessage = error.error?.message || `Server error: ${error.status}`;
          break;
      }
    }

    // Show toastr notification
    this.showNotification(errorMessage, errorType);

    return throwError(() => ({
      message: errorMessage,
      status: error.status,
      error: error.error
    }));
  }

  private showNotification(message: string, type: 'error' | 'warning' | 'info' = 'error'): void {
    switch (type) {
      case 'error':
        this.toastr.error(message, 'Error', {
          timeOut: 5000,
          closeButton: true,
          progressBar: true
        });
        break;
      case 'warning':
        this.toastr.warning(message, 'Warning', {
          timeOut: 4000,
          closeButton: true,
          progressBar: true
        });
        break;
      case 'info':
        this.toastr.info(message, 'Info', {
          timeOut: 3000,
          closeButton: true,
          progressBar: true
        });
        break;
    }
  }

  private handleUnauthorized(): void {
    // Clear stored tokens and user data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userData');
    localStorage.removeItem('temp_token');
    
    // Redirect to login page (you might want to use Router for this)
    // For now, just show a message and let the component handle redirection
    // this.showNotification('Session expired. Please log in again.', 'warning');
    
    // You could also emit an event or use a service to notify about auth state change
    // this.authService.logout();
  }
}
