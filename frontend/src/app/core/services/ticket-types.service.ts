import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TicketDetail } from '../models/interfaces/ticket';

@Injectable({ providedIn: 'root' })
export class TicketTypesService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = '/api/v1/ticket-types';

  /**
   * Purchase one or more tickets of a specific ticket type.
   * @param ticketTypeId The ID of the ticket type to purchase
   * @param quantity Number of tickets to purchase (defaults to 1)
   * @returns The created ticket details, one entry per ticket
   */
  purchaseTickets(ticketTypeId: string, quantity = 1): Observable<TicketDetail[]> {
    const params = quantity > 1
      ? new HttpParams().set('quantity', quantity.toString())
      : undefined;

    return this.http.post<TicketDetail[]>(
      `${this.baseUrl}/${encodeURIComponent(ticketTypeId)}`,
      null,
      params ? { params } : undefined
    );
  }
}
