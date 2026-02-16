import { isPlatformBrowser } from '@angular/common';
import { HttpInterceptorFn } from '@angular/common/http';
import { ApplicationRef, inject, PLATFORM_ID } from '@angular/core';
import { finalize, first, timeout } from 'rxjs';

export const isStableInterceptor: HttpInterceptorFn = (req, next) => {
  const appRef = inject(ApplicationRef);
  const _PLATFORM_ID = inject(PLATFORM_ID);

  return next(req).pipe(
    finalize(() => {
      if (isPlatformBrowser(_PLATFORM_ID)) {
        // Wait for the application to become stable, with a timeout fallback
        appRef.isStable
          .pipe(
            first((stable) => stable),
            timeout(5000) // Fallback after 5 seconds
          )
          .subscribe({
            next: () => {
              const loaderElement = document.querySelector('.lightBox');
              if (loaderElement) {
                loaderElement.classList.add('d-none');
              }
            },
            error: () => {
              // If the application doesn't stabilize within the timeout, hide the loader anyway
              const loaderElement = document.querySelector('.lightBox');
              if (loaderElement) {
                loaderElement.classList.add('d-none');
              }
            },
          });
      }
    })
  );
};
