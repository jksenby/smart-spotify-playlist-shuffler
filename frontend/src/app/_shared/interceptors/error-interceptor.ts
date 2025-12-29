// frontend/src/app/_shared/interceptors/error-interceptor.ts
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, retry, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    retry({
      count: 2,
      delay: (error: HttpErrorResponse, retryCount) => {
        if (error.status >= 500 || error.status === 0) {
          const delayMs = Math.min(1000 * Math.pow(2, retryCount), 10000);
          console.log(`Retrying request (${retryCount}/2) after ${delayMs}ms...`);
          return timer(delayMs);
        }
        return throwError(() => error);
      },
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Network error: ${error.error.message}`;
        console.error('Client-side error:', error.error);
      } else {
        console.error(`Backend error: ${error.status} ${error.statusText}`, error.error);

        switch (error.status) {
          case 0:
            errorMessage = 'Network connection lost. Please check your internet connection.';
            break;
          case 400:
            errorMessage = error.error?.message || 'Invalid request. Please check your input.';
            break;
          case 401:
            errorMessage = 'Session expired. Please log in again.';
            authService.logout();
            router.navigate(['/']);
            break;
          case 403:
            errorMessage = 'Access denied. You do not have permission to perform this action.';
            break;
          case 404:
            errorMessage = error.error?.message || 'Requested resource not found.';
            break;
          case 409:
            errorMessage = error.error?.message || 'Conflict occurred. Please try again.';
            break;
          case 429:
            errorMessage = 'Too many requests. Please wait a moment and try again.';
            break;
          case 500:
            errorMessage = 'Server error. Please try again later.';
            break;
          case 502:
          case 503:
          case 504:
            errorMessage = 'Service temporarily unavailable. Please try again later.';
            break;
          default:
            errorMessage = error.error?.message || `Error ${error.status}: ${error.statusText}`;
        }
      }

      snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['error-snackbar'],
      });

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error,
      }));
    }),
  );
};
