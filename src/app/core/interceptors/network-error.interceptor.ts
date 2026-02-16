import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError, delay, retryWhen, scan } from 'rxjs';

export const networkErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);
  const MAX_RETRIES = 3; // Number of retry attempts
  const RETRY_DELAY = 2000; // 2 seconds delay between retries

  return next(req).pipe(
    retryWhen((errors) =>
      errors.pipe(
        scan((retryCount, error) => {
          if (retryCount >= MAX_RETRIES || error.status !== 0) {
            throw error; // Stop retrying if max retries reached or it's not a network issue
          }
          console.warn(`Retrying request... (${retryCount + 1}/${MAX_RETRIES})`);
          return retryCount + 1;
        }, 0),
        delay(RETRY_DELAY)
      )
    ),
    catchError((error) => {
      if (error.status === 0 && !navigator.onLine) {
        // Clear previous messages and show network error
        // messageService.clear();
        // messageService.add({
        //   severity: 'error',
        //   summary: 'خطأ في الاتصال',
        //   detail: 'يبدو أنك غير متصل بالإنترنت. يرجى التحقق من الشبكة.',
        //   life: 3000,
        // });

        return throwError(() => new Error('No internet connection'));
      }

      return throwError(() => error);
    })
  );
};
