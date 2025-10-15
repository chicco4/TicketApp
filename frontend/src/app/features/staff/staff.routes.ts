import { Routes } from '@angular/router';

export const STAFF_ROUTES: Routes = [
  {
    path: 'validate',
    loadComponent: () => import('./ticket-validation/ticket-validation.component')
      .then(m => m.TicketValidationComponent)
  },
  {
    path: '',
    redirectTo: 'validate',
    pathMatch: 'full'
  }
];
