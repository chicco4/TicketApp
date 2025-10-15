import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/events',
    pathMatch: 'full'
  },
  {
    path: 'events',
    loadComponent: () => import('./features/attendee/events/events.component')
      .then(m => m.EventsComponent)
  },
  {
    path: 'events/:id',
    loadComponent: () => import('./features/attendee/event-details/event-details.component')
      .then(m => m.EventDetailsComponent)
  },
  // TODO: Uncomment when my-tickets components are implemented
  // {
  //   path: 'my-tickets',
  //   canActivate: [authGuard],
  //   loadChildren: () => import('./features/attendee/my-tickets/my-tickets.routes')
  //     .then(m => m.MY_TICKETS_ROUTES)
  // },
  // TODO: Uncomment when organizer components are implemented
  // {
  //   path: 'organizer',
  //   canActivate: [roleGuard],
  //   data: { roles: ['ORGANIZER'] },
  //   loadChildren: () => import('./features/organizer/organizer.routes')
  //     .then(m => m.ORGANIZER_ROUTES)
  // },
  // TODO: Uncomment when staff components are implemented
  // {
  //   path: 'staff',
  //   canActivate: [roleGuard],
  //   data: { roles: ['STAFF'] },
  //   loadChildren: () => import('./features/staff/staff.routes')
  //     .then(m => m.STAFF_ROUTES)
  // },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component')
      .then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/auth/unauthorized/unauthorized.component')
      .then(m => m.UnauthorizedComponent)
  },
  {
    path: '**',
    redirectTo: '/events'
  }
];

