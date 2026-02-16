import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  InMemoryScrollingFeature,
  InMemoryScrollingOptions,
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withViewTransitions,
} from '@angular/router';

import { IMAGE_CONFIG } from '@angular/common';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideShareButtonsOptions,
  SharerMethods,
  withConfig,
} from 'ngx-sharebuttons';
import { shareIcons } from 'ngx-sharebuttons/icons';
import { provideToastr } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { routes } from './app.routes';
import { homeCacheInterceptor } from './core/interceptors/home-cache.interceptor';
import { isStableInterceptor } from './core/interceptors/is-stable.interceptor';
import { loadingSpinnerInterceptor } from './core/interceptors/loading-spinner.interceptor';
import { networkErrorInterceptor } from './core/interceptors/network-error.interceptor';
const scrollConfig: InMemoryScrollingOptions = {
  scrollPositionRestoration: 'top',
  anchorScrolling: 'enabled',
};

const inMemoryScrollingFeature: InMemoryScrollingFeature =
  withInMemoryScrolling(scrollConfig);

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withComponentInputBinding(),
      inMemoryScrollingFeature,
      withViewTransitions()
    ),
    provideClientHydration(),
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-top-left',
      timeOut: 2000,
    }),
    provideHttpClient(
      withInterceptors([
        isStableInterceptor,
        loadingSpinnerInterceptor,
        homeCacheInterceptor,
        networkErrorInterceptor,
      ]),
      withFetch() // for lazy loading
    ),
    MessageService,
    importProvidersFrom([ToastModule]),
    provideShareButtonsOptions(
      shareIcons(),
      withConfig({
        debug: true,
        sharerMethod: SharerMethods.Anchor,
      })
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
