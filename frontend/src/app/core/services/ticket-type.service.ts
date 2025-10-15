import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GetTicketResponse } from '../models/interfaces/ticket.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketTypeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ticket-types`;

  purchaseTicket(ticketTypeId: string): Observable<GetTicketResponse> {
    return this.http.post<GetTicketResponse>(`${this.apiUrl}/${ticketTypeId}`, {});
  }
}
