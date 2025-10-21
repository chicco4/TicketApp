import { Routes } from '@angular/router';
import { canActivateAuthRole } from './core/guards/auth-role.guard';

export const routes: Routes = [
  {
    path: 'attendee/published-events',
    loadComponent: () => import('./pages/attendee/published-events/published-events').then((m) => m.AttendeeHome),
  },
  {
    path: 'attendee/published-events/:id',
    loadComponent: () => import('./pages/attendee/published-event-details/published-event-details').then((m) => m.AttendeeEventDetails),
  },
  {
    path: 'attendee/tickets',
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_ATTENDEE' },
    loadComponent: () => import('./pages/attendee/tickets/tickets').then((m) => m.AttendeeTickets),
  },
  {
    path: 'attendee/ticket-details/:ticketId',
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_ATTENDEE' },
    loadComponent: () => import('./pages/attendee/ticket-details/ticket-details').then((m) => m.AttendeeTicketDetails),
  },
  {
    path: 'attendee/ticket-qr-code/:ticketId',
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_ATTENDEE' },
    loadComponent: () => import('./pages/attendee/ticket-qr-code/ticket-qr-code').then((m) => m.AttendeeTicketQrCode),
  },
  {
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_ATTENDEE' },
    path: 'attendee/purchase-ticket/:eventId/:ticketTypeId',
    loadComponent: () => import('./pages/attendee/purchase-ticket/purchase-ticket').then((m) => m.PurchaseTicket),
  },
  {
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_ATTENDEE' },
    path: 'attendee/purchase-success',
    loadComponent: () => import('./pages/attendee/purchase-success/purchase-success').then((m) => m.PurchaseSuccess),
  },
  {
    path: 'organizer/guide',
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_ORGANIZER' },
    loadComponent: () => import('./pages/organizer/guide/guide').then((m) => m.OrganizerGuide),
  },
  {
    path: 'organizer/create-event',
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_ORGANIZER' },
    loadComponent: () => import('./pages/organizer/create-event/create-event').then((m) => m.OrganizerCreateEvent),
  },
  {
    path: 'organizer/update-event/:eventId',
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_ORGANIZER' },
    loadComponent: () => import('./pages/organizer/update-event/update-event').then((m) => m.OrganizerUpdateEvent),
  },
  {
    path: 'organizer/events',
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_ORGANIZER' },
    loadComponent: () => import('./pages/organizer/events/events').then((m) => m.OrganizerEvents),
  },
  {
    path: 'staff/home',
    canActivate: [canActivateAuthRole],
    data: { role: 'ROLE_STAFF' },
    loadComponent: () => import('./pages/staff/home/home').then((m) => m.StaffHome),
  },
  { path: '', pathMatch: 'full', redirectTo: 'attendee/published-events' },
  { path: '**', redirectTo: 'attendee/published-events' }
];
