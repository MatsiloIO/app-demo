import { Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard';
import { guestGuard } from './guards/guest-guard';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./pages/home/home')
    },
    {
        path: 'clients',
        loadComponent: () => import('./pages/client/client.component'),
        canActivate: [authGuard]
    },
    {
        path: 'products',
        loadComponent: () => import('./pages/products/product.component'),
        canActivate: [authGuard]
    },
    {
        path: 'category',
        loadComponent: () => import('./pages/category/category.component'),
        canActivate: [authGuard]
    },
    {
        path: 'orders',
        loadComponent: () => import('./pages/order/order.component'),
        canActivate: [authGuard]
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about/about')
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/auth/login'),
        canActivate: [guestGuard]
    },
    {
        path: '**',
        redirectTo: ''
    }
];
