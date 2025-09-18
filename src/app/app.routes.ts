import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./pages/home/home')
    },
    {
        path: 'about',
        loadComponent: () => import('./pages/about/about')
    },
    {
        path: '**',
        redirectTo: ''
    }
];
