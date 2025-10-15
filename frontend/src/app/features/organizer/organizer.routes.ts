import { Routes } from '@angular/router';

export const ORGANIZER_ROUTES: Routes = [
  {
    path: 'events',
    loadComponent: () => import('./event-list/event-list.component')
      .then(m => m.EventListComponent)
  },
  {
    path: 'events/create',
    loadComponent: () => import('./create-event/create-event.component')
      .then(m => m.CreateEventComponent)
  },
  {
    path: 'events/:id/edit',
    loadComponent: () => import('./edit-event/edit-event.component')
      .then(m => m.EditEventComponent)
  },
  {
    path: 'events/:id/dashboard',
    loadComponent: () => import('./event-dashboard/event-dashboard.component')
      .then(m => m.EventDashboardComponent)
  },
  {
    path: '',
    redirectTo: 'events',
    pathMatch: 'full'
  }
];
