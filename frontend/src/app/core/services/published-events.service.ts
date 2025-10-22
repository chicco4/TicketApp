import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/interfaces/page';
import { PublishedEvent, PublishedEventSummary } from '../models/interfaces/published-event';
import { EventType } from '../models/enums/event-type.enum';
import { environment } from '../../../environments/environment';
import { API_CONSTANTS, buildApiUrl } from '../constants/apis';

export interface GetPublishedEventsOptions {
  query?: string;
  page?: number;
  size?: number;
  sort?: string; // e.g. 'start,desc' or 'name,asc'
  type?: EventType;
}

@Injectable({ providedIn: 'root' })
export class PublishedEventsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = buildApiUrl(
    environment.apiUrl,
    API_CONSTANTS.API_METHODS.PUBLISHED_EVENTS.GET_PUBLISHED_EVENTS()
  );

  /**
   * Get a paginated list of published events
   */
  getPublishedEvents(options: GetPublishedEventsOptions = {}): Observable<Page<PublishedEventSummary>> {
    let params = new HttpParams();
    if (options.query) params = params.set('query', options.query);
    if (options.page !== undefined) params = params.set('page', options.page);
    if (options.size !== undefined) params = params.set('size', options.size);
    if (options.sort) params = params.set('sort', options.sort);
    if (options.type) params = params.set('type', options.type);

    return this.http.get<Page<PublishedEventSummary>>(this.baseUrl, { params });
  }

  /**
   * Get details of a single published event by its ID
   */
  getPublishedEventById(id: string): Observable<PublishedEvent> {
    return this.http.get<PublishedEvent>(
      buildApiUrl(
        environment.apiUrl,
        API_CONSTANTS.API_METHODS.PUBLISHED_EVENTS.GET_PUBLISHED_EVENT_BY_ID(id)
      )
    );
  }
}
