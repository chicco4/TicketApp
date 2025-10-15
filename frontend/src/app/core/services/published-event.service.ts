import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from '../models/interfaces/page.interface';
import { ListPublishedEventResponse, GetPublishedEventDetailsResponse } from '../models/interfaces/event.interface';

@Injectable({
  providedIn: 'root'
})
export class PublishedEventService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/published-events`;

  listPublishedEvents(query?: string, page: number = 0, size: number = 10): Observable<Page<ListPublishedEventResponse>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (query) {
      params = params.set('query', query);
    }

    return this.http.get<Page<ListPublishedEventResponse>>(this.apiUrl, { params });
  }

  getPublishedEventDetails(eventId: string): Observable<GetPublishedEventDetailsResponse> {
    return this.http.get<GetPublishedEventDetailsResponse>(`${this.apiUrl}/${eventId}`);
  }
}
