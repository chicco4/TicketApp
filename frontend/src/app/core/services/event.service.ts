import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from '../models/interfaces/page.interface';
import {
  Event,
  CreateEventRequest,
  UpdateEventRequest,
  ListEventResponse,
  GetEventDetailsResponse
} from '../models/interfaces/event.interface';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/events`;

  createEvent(request: CreateEventRequest): Observable<Event> {
    return this.http.post<Event>(this.apiUrl, request);
  }

  listEvents(page: number = 0, size: number = 10): Observable<Page<ListEventResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<ListEventResponse>>(this.apiUrl, { params });
  }

  getEvent(eventId: string): Observable<GetEventDetailsResponse> {
    return this.http.get<GetEventDetailsResponse>(`${this.apiUrl}/${eventId}`);
  }

  updateEvent(eventId: string, request: UpdateEventRequest): Observable<Event> {
    return this.http.put<Event>(`${this.apiUrl}/${eventId}`, request);
  }

  deleteEvent(eventId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${eventId}`);
  }
}
