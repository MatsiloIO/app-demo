import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./pages/home/home')
    },
    {
        path: 'clients',
        loadComponent: () => import('./pages/client/client.component'),
        //canActivate: [authGuard]
    },
    {
        path: 'products',
        loadComponent: () => import('./pages/products/products'),
        canActivate: [authGuard]
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about/about')
    },
    {
        path: 'add-product',
        loadComponent: () => import('./pages/products/add-product'),
        canActivate: [authGuard]
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login')
    },
    {
        path: '**',
        redirectTo: ''
    }
];
