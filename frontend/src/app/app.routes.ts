import { Routes } from '@angular/router';
import { MainPageComponent } from './features/main/main-page.component';
import { LoginPageComponent } from './features/login/login-page.component';

export const routes: Routes = [
  { path: '', component: MainPageComponent, title: 'Главная - SSPS' },
  { path: 'login', component: LoginPageComponent, title: 'Авторизация' },
];
