import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/interfaces/page';
import { Event, EventCreate, EventUpdate } from '../models/interfaces/event';

export interface GetEventsOptions {
  page?: number;
  size?: number;
  sort?: string; // e.g. 'name,asc' or 'createdAt,desc'
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/events';

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
    return this.http.get<Event>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }

  /**
   * Update an existing event
   */
  updateEvent(id: string, event: EventUpdate): Observable<Event> {
    return this.http.put<Event>(`${this.baseUrl}/${encodeURIComponent(id)}`, event);
  }

  /**
   * Delete an event
   */
  deleteEvent(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }
}
