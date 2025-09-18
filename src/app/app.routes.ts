import { Routes } from '@angular/router';

export const routes: Routes = [

    {
        path: '',
        loadComponent: () => import('./pages/home/home')
    },
    {
        path: 'products',
        loadComponent: () => import('./pages/products/products')
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about/about')
    },
    {
        path: 'add-product',
        loadComponent: () => import('./pages/products/add-product')
    },
    {
        path: '**',
        redirectTo: ''
    }
];
