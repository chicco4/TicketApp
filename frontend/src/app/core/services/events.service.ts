import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/interfaces/page';
import { Event, EventCreate, EventUpdate } from '../models/interfaces/event';
import { environment } from '../../../environments/environment';
import { API_CONSTANTS, buildApiUrl } from '../constants/apis';

export interface GetEventsOptions {
  page?: number;
  size?: number;
  sort?: string; // e.g. 'name,asc' or 'createdAt,desc'
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = buildApiUrl(
    environment.apiUrl,
    API_CONSTANTS.API_METHODS.EVENTS.GET_EVENTS()
  );

  private pendingSuccessMessage?: string;

  /**
   * Create a new event
   */
  createEvent(event: EventCreate): Observable<Event> {
    return this.http.post<Event>(this.baseUrl, event);
  }

  /**
   * Get a paginated list of events (organizer's events)
   */
  getEvents(options: GetEventsOptions = {}): Observable<Page<Event>> {
    let params = new HttpParams();
    if (options.page !== undefined) params = params.set('page', options.page);
    if (options.size !== undefined) params = params.set('size', options.size);
    if (options.sort) params = params.set('sort', options.sort);

    return this.http.get<Page<Event>>(this.baseUrl, { params });
  }

  /**
   * Get details of a specific event by ID
   */
  getEventById(id: string): Observable<Event> {
    return this.http.get<Event>(
      buildApiUrl(
        environment.apiUrl,
        API_CONSTANTS.API_METHODS.EVENTS.GET_EVENT_BY_ID(id)
      )
    );
  }

  /**
   * Update an existing event
   */
  updateEvent(id: string, event: EventUpdate): Observable<Event> {
    return this.http.put<Event>(
      buildApiUrl(
        environment.apiUrl,
        API_CONSTANTS.API_METHODS.EVENTS.UPDATE_EVENT(id)
      ),
      event
    );
  }

  /**
   * Delete an event
   */
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(
      buildApiUrl(
        environment.apiUrl,
        API_CONSTANTS.API_METHODS.EVENTS.DELETE_EVENT(id)
      )
    );
  }

  /**
   * Set a success message to be displayed on the next events page load
   */
  setPendingSuccessMessage(message: string): void {
    this.pendingSuccessMessage = message;
  }

  /**
   * Get and clear the pending success message
   */
  getPendingSuccessMessage(): string | undefined {
    const message = this.pendingSuccessMessage;
    this.pendingSuccessMessage = undefined;
    return message;
  }
}
