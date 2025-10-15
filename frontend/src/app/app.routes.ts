import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'attendee/home',
    loadComponent: () => import('./pages/attendee/home/home').then((m) => m.Home),
  },
  {
    path: 'organizer/home',
    loadComponent: () => import('./pages/organizer/home/home').then((m) => m.Home),
  },
  {
    path: 'staff/home',
    loadComponent: () => import('./pages/staff/home/home').then((m) => m.Home),
  }
];
