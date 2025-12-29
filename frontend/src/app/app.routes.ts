import { Routes } from '@angular/router';
import { MainPageComponent } from '@app/features/main/main-page.component';
import { AuthCallback } from '@app/features/auth/auth-callback/auth-callback';

export const routes: Routes = [
  { path: '', component: MainPageComponent, title: 'Главная - SSPS' },
  {
    path: 'auth',
    children: [{ path: 'callback', component: AuthCallback }],
  },
];
