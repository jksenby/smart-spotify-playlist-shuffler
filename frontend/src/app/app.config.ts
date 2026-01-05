import {
  ApplicationConfig,
  importProvidersFrom,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { AuthState } from './store/auth/auth.state';
import { PlaylistState } from './store/playlist/playlist.state';
import { withNgxsFormPlugin } from '@ngxs/form-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NgxSpinnerModule } from 'ngx-spinner';
import { authInterceptor } from './_shared/interceptors/auth-interceptor';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { errorInterceptor } from './_shared/interceptors/error-interceptor';
import { csrfInterceptor } from './_shared/security/csrf.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore([AuthState, PlaylistState]),
    provideAnimations(),
    importProvidersFrom(NgxSpinnerModule.forRoot()),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor, csrfInterceptor])),
    withNgxsFormPlugin(),
    withNgxsLoggerPlugin(),
    withNgxsReduxDevtoolsPlugin(),
    withNgxsStoragePlugin({ keys: '*' }),
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: { duration: 2500 } },
  ],
};
