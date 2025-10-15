import { Routes } from '@angular/router';

export const MY_TICKETS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./my-tickets.component')
      .then(m => m.MyTicketsComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./ticket-detail/ticket-detail.component')
      .then(m => m.TicketDetailComponent)
  }
];
