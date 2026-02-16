import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const logedUserGuard: CanActivateFn = (route, state) => {
  const _Router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformBrowser(platformId)) {
    const userToken = localStorage.getItem('user');
    if (userToken) {
      if (state.url !== '/dashboard') {
        _Router.navigate(['/dashboard']); // Redirect only if not already on dashboard
      }
      return false; // Block access to login if logged in
    } else {
      return true; // Allow access to login page if not logged in
    }
  }

  return true;
};
