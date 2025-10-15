import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/interfaces/page';
import { PublishedEvent } from '../models/interfaces/published-event';

export interface GetPublishedEventsOptions {
  page?: number;
  size?: number;
  sort?: string; // e.g. 'start,desc' or 'name,asc'
}

@Injectable({ providedIn: 'root' })
export class PublishedEventsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = 'http://localhost:8080/api/v1/published-events';

  getPublishedEvents(options: GetPublishedEventsOptions = {}): Observable<Page<PublishedEvent>> {
    let params = new HttpParams();
    if (options.page !== undefined) params = params.set('page', options.page);
    if (options.size !== undefined) params = params.set('size', options.size);
    if (options.sort) params = params.set('sort', options.sort);

    return this.http.get<Page<PublishedEvent>>(this.baseUrl, { params });
  }
}
