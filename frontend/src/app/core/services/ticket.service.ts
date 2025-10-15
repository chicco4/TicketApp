import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Page } from '../models/interfaces/page.interface';
import { ListTicketResponse, GetTicketResponse } from '../models/interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/tickets`;

  listTickets(page: number = 0, size: number = 10): Observable<Page<ListTicketResponse>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    return this.http.get<Page<ListTicketResponse>>(this.apiUrl, { params });
  }

  getTicket(ticketId: string): Observable<GetTicketResponse> {
    return this.http.get<GetTicketResponse>(`${this.apiUrl}/${ticketId}`);
  }

  getTicketQrCode(ticketId: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/${ticketId}/qr-code`, {
      responseType: 'blob'
    });
  }
}
