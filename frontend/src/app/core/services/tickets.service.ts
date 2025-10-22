import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Page } from '../models/interfaces/page';
import { Ticket, TicketDetail } from '../models/interfaces/ticket';
import { environment } from '../../../environments/environment';
import { API_CONSTANTS, buildApiUrl } from '../constants/apis';

export interface GetTicketsOptions {
  page?: number;
  size?: number;
  sort?: string; // e.g. 'createdAt,desc'
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = buildApiUrl(
    environment.apiUrl,
    API_CONSTANTS.API_METHODS.TICKETS.GET_TICKETS()
  );

  /**
   * Get a paginated list of user's tickets
   */
  getTickets(options: GetTicketsOptions = {}): Observable<Page<Ticket>> {
    let params = new HttpParams();
    if (options.page !== undefined) params = params.set('page', options.page);
    if (options.size !== undefined) params = params.set('size', options.size);
    if (options.sort) params = params.set('sort', options.sort);

    return this.http.get<Page<Ticket>>(this.baseUrl, { params });
  }

  /**
   * Get details of a specific ticket by ID
   */
  getTicketById(id: string): Observable<TicketDetail> {
    return this.http.get<TicketDetail>(
      buildApiUrl(
        environment.apiUrl,
        API_CONSTANTS.API_METHODS.TICKETS.GET_TICKET_BY_ID(id)
      )
    );
  }

  /**
   * Get the QR code image for a ticket
   * Returns a Blob that can be used to display or download the image
   */
  getTicketQrCode(id: string): Observable<Blob> {
    return this.http.get(
      buildApiUrl(
        environment.apiUrl,
        API_CONSTANTS.API_METHODS.TICKETS.GET_TICKET_QR_CODE(id)
      ),
      {
        responseType: 'blob'
      }
    );
  }

  /**
   * Helper method to create an object URL for displaying the QR code
   */
  createQrCodeUrl(blob: Blob): string {
    return URL.createObjectURL(blob);
  }

  /**
   * Helper method to revoke an object URL (call when done with the URL)
   */
  revokeQrCodeUrl(url: string): void {
    URL.revokeObjectURL(url);
  }
}
