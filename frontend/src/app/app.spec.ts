import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import Keycloak from 'keycloak-js';
import { KEYCLOAK_EVENT_SIGNAL, KeycloakEventType } from 'keycloak-angular';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        {
          provide: Keycloak,
          useValue: {
            authenticated: false,
            tokenParsed: undefined,
            login: jasmine.createSpy('login'),
            logout: jasmine.createSpy('logout'),
          } as Partial<Keycloak>,
        },
        {
          provide: KEYCLOAK_EVENT_SIGNAL,
          useValue: signal({
            type: KeycloakEventType.Ready,
            args: [] as unknown[],
          }),
        },
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(
      compiled.querySelector('.app-title')?.textContent?.trim()
    ).toContain('TicketApp');
  });
});
