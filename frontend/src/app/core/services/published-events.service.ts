import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/interfaces/page';
import { PublishedEvent, PublishedEventSummary } from '../models/interfaces/published-event';

export interface GetPublishedEventsOptions {
  query?: string;
  page?: number;
  size?: number;
  sort?: string; // e.g. 'start,desc' or 'name,asc'
}

@Injectable({ providedIn: 'root' })
export class PublishedEventsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/published-events';

  /**
   * Get a paginated list of published events
   */
  getPublishedEvents(options: GetPublishedEventsOptions = {}): Observable<Page<PublishedEventSummary>> {
    let params = new HttpParams();
    if (options.query) params = params.set('query', options.query);
    if (options.page !== undefined) params = params.set('page', options.page);
    if (options.size !== undefined) params = params.set('size', options.size);
    if (options.sort) params = params.set('sort', options.sort);

    return this.http.get<Page<PublishedEventSummary>>(this.baseUrl, { params });
  }

  /**
   * Get details of a single published event by its ID
   */
  getPublishedEventById(id: string): Observable<PublishedEvent> {
    return this.http.get<PublishedEvent>(`${this.baseUrl}/${encodeURIComponent(id)}`);
  }
}
