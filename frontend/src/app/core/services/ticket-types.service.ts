import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketDetail } from '../models/interfaces/ticket';

@Injectable({ providedIn: 'root' })
export class TicketTypesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/ticket-types';

  /**
   * Purchase a ticket of a specific ticket type
   * @param ticketTypeId The ID of the ticket type to purchase
   * @returns The created ticket details
   */
  purchaseTicket(ticketTypeId: string): Observable<TicketDetail> {
    return this.http.post<TicketDetail>(
      `${this.baseUrl}/${encodeURIComponent(ticketTypeId)}`,
      null
    );
  }
}
