import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideStore } from '@ngxs/store';
import { AuthState } from './store/auth/auth.state';
import { PlaylistState } from './store/playlist/playlist.state';
import { withNgxsFormPlugin } from '@ngxs/form-plugin';
import { withNgxsReduxDevtoolsPlugin } from '@ngxs/devtools-plugin';
import { withNgxsStoragePlugin } from '@ngxs/storage-plugin';
import { withNgxsLoggerPlugin } from '@ngxs/logger-plugin';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore([AuthState, PlaylistState]),
    provideHttpClient(),
    withNgxsFormPlugin(),
    withNgxsLoggerPlugin(),
    withNgxsReduxDevtoolsPlugin(),
    withNgxsStoragePlugin({ keys: '*' }),
  ],
};
