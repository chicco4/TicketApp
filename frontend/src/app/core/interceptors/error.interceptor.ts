import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'An unknown error occurred';

      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = `Error: ${error.error.message}`;
      } else {
        // Server-side error
        errorMessage = error.error?.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
        
        // Handle specific status codes
        if (error.status === 401) {
          // Unauthorized - redirect to login
          router.navigate(['/login']);
        } else if (error.status === 403) {
          // Forbidden - redirect to home or show error
          console.error('Access forbidden');
        }
      }

      console.error(errorMessage);
      return throwError(() => error);
    })
  );
};
