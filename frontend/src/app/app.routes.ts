import { Routes } from '@angular/router';
import { Main } from 'app/components/main/main'
import { Login } from 'app/components/login/login';

export const routes: Routes = [
    { path: '', component: Main, title: 'Главная - SSPS' },
    { path: 'login', component: Login, title: 'Авторизация' },
];
