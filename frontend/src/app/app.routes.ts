import { Routes } from '@angular/router';
import { Main } from 'app/components/main/main'
import { Login } from 'app/components/login/login';
import { authGuard } from './_shared/guards/auth-guard';

export const routes: Routes = [
    { path: '', component: Main, title: 'Главная - SSPS', canActivate: [authGuard] },
    { path: 'login', component: Login, title: 'Авторизация' },
];
