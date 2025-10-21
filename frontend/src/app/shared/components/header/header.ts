import { Component, effect, inject, signal } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';

@Component({
  selector: 'app-header',
  imports: [MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, RouterLink, RouterLinkActive],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  appTitle = signal('TicketApp');

  // Inject Keycloak instance and event signal
  private keycloak = inject(Keycloak);
  private keycloakEvent = inject(KEYCLOAK_EVENT_SIGNAL);

  // Track authentication status for toggling Login/Logout button
  isAuthenticated = signal<boolean>(false);
  userName = signal<string>('');
  hasAttendeeRole = signal<boolean>(false);
  hasOrganizerRole = signal<boolean>(false);
  hasStaffRole = signal<boolean>(false);

  constructor() {
    // Initialize authentication state once Keycloak is ready
    this.updateAuthState();

    // React to keycloak auth events to keep the UI state in sync
    effect(() => {
      const ev = this.keycloakEvent();
      switch (ev.type) {
        case KeycloakEventType.AuthSuccess:
        case KeycloakEventType.AuthLogout:
        case KeycloakEventType.Ready:
        case KeycloakEventType.AuthRefreshSuccess:
          this.updateAuthState();
          break;
      }
    });
  }

  private updateAuthState() {
    this.isAuthenticated.set(this.keycloak.authenticated ?? false);
    this.updateUserName();
    this.updateRoles();
  }

  private updateUserName() {
    if (this.keycloak.authenticated && this.keycloak.tokenParsed) {
      const name = this.keycloak.tokenParsed['preferred_username'];
      this.userName.set(name as string);
    } else {
      this.userName.set('');
    }
  }

  private updateRoles() {
    if (!this.keycloak.authenticated) {
      this.hasAttendeeRole.set(false);
      this.hasOrganizerRole.set(false);
      this.hasStaffRole.set(false);
      return;
    }

    const attendee = this.hasRole('ROLE_ATTENDEE');
    this.hasAttendeeRole.set(attendee);
    const organizer = this.hasRole('ROLE_ORGANIZER');
    this.hasOrganizerRole.set(organizer);
    const staff = this.hasRole('ROLE_STAFF');
    this.hasStaffRole.set(staff);
  }

  private hasRole(role: string): boolean {
    const tokenParsed = this.keycloak.tokenParsed as Record<string, unknown> | undefined;
    if (!tokenParsed) {
      return false;
    }

    const realmRoles = Array.isArray((tokenParsed as any)?.realm_access?.roles)
      ? ((tokenParsed as any).realm_access.roles as string[])
      : [];
    const resourceRoles = Object.values((tokenParsed as any)?.resource_access ?? {}).flatMap((resource: any) =>
      Array.isArray(resource?.roles) ? (resource.roles as string[]) : []
    );

    const normalizedRoles = new Set(
      [...realmRoles, ...resourceRoles]
        .filter((r): r is string => typeof r === 'string')
        .flatMap((r) => [r, r.toLowerCase()])
    );

    const variants: string[] = [];
    if (role) {
      variants.push(role);
      if (role.startsWith('ROLE_')) {
        variants.push(role.substring(5));
      } else {
        variants.push(`ROLE_${role}`);
      }
    }

    const normalizedVariants = new Set(variants.flatMap((variant) => [variant, variant.toLowerCase()]));

    return Array.from(normalizedVariants).some((variant) => normalizedRoles.has(variant));
  }

  login() {
    // Trigger Keycloak login flow only when user clicks the button
    // Redirect back to current location after login
    const redirectUri = window.location.href;
    return this.keycloak.login({ redirectUri });
  }

  logout() {
    const redirectUri = window.location.origin;
    return this.keycloak.logout({ redirectUri });
  }
}
