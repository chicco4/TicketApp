import { Routes } from '@angular/router';
import { canActivateAuthRole } from './core/guards/auth-role.guard';

export const routes: Routes = [
  {
    path: 'attendee/published-events',
    loadComponent: () => import('./pages/attendee/published-events/home').then((m) => m.AttendeeHome),
  },
  {
    path: 'attendee/published-events/:id',
    loadComponent: () => import('./pages/attendee/published-event-details/event-details').then((m) => m.AttendeeEventDetails),
  },
  {
    path: 'attendee/purchase-ticket/:eventId/:ticketTypeId',
    loadComponent: () => import('./pages/attendee/purchase-ticket/purchase-ticket').then((m) => m.PurchaseTicket),
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
  { path: '', pathMatch: 'full', redirectTo: 'attendee/published-events' },
  { path: '**', redirectTo: 'attendee/published-events' }
];
