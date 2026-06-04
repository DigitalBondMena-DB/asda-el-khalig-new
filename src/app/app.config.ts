import { ApplicationConfig, inject, provideAppInitializer } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { IMAGE_CONFIG } from '@angular/common';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';

import { provideToastr } from 'ngx-toastr';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { homeCacheInterceptor } from './core/interceptors/home-cache.interceptor';
import { isStableInterceptor } from './core/interceptors/is-stable.interceptor';
import { networkErrorInterceptor } from './core/interceptors/network-error.interceptor';
import { SeoService } from './core/services/seo/seo.service';
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideAppInitializer(() => {
      const seoService = inject(SeoService);
    }),
    provideNoopAnimations(),
    provideRouter(
      routes,
      withComponentInputBinding(),
      inMemoryScrollingFeature,
      withViewTransitions()
    ),
    provideClientHydration(),
    provideToastr({
      positionClass: 'toast-top-left',
      timeOut: 2000,
    }),
    provideHttpClient(
      withInterceptors([
        isStableInterceptor,
        homeCacheInterceptor,
        networkErrorInterceptor,
      ]),
      withFetch() // for lazy loading
    ),
    {
      provide: IMAGE_CONFIG,
      useValue: {
        disableImageSizeWarning: true,
        disableImageLazyLoadWarning: true,
      },
    },
  ],
};
