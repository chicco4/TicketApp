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
  }

  private updateUserName() {
    if (this.keycloak.authenticated && this.keycloak.tokenParsed) {
      const name = this.keycloak.tokenParsed['preferred_username']
      this.userName.set(name as string);
    } else {
      this.userName.set('');
    }
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
