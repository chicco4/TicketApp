import { Routes } from '@angular/router';
import { canActivateAuthRole } from './core/guards/auth-role.guard';

export const routes: Routes = [
  {
    path: 'attendee/home',
    loadComponent: () => import('./pages/attendee/home/home').then((m) => m.AttendeeHome),
  },
  {
    path: 'organizer/home',
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_ORGANIZER' },
    loadComponent: () => import('./pages/organizer/home/home').then((m) => m.OrganizerHome),
  },
  {
    path: 'staff/home',
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_STAFF' },
    loadComponent: () => import('./pages/staff/home/home').then((m) => m.StaffHome),
  },
  {
    path: 'forbidden',
    loadComponent: () => import('./pages/forbidden/forbidden').then((m) => m.ForbiddenPage),
  },
  { path: '', pathMatch: 'full', redirectTo: 'attendee/home' },
  { path: '**', redirectTo: 'attendee/home' }
];
