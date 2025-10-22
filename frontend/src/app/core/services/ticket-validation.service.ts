import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TicketValidationRequest,
  TicketValidationResponse
} from '../models/interfaces/ticket-validation';
import { environment } from '../../../environments/environment';
import { API_CONSTANTS, buildApiUrl } from '../constants/apis';

@Injectable({ providedIn: 'root' })
export class TicketValidationService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = buildApiUrl(
    environment.apiUrl,
    API_CONSTANTS.API_METHODS.TICKET_VALIDATIONS.VALIDATE_TICKET()
  );

  /**
   * Validate a ticket (staff only)
   * @param request The validation request containing ticket ID and method
   * @returns The validation response with status
   */
  validateTicket(request: TicketValidationRequest): Observable<TicketValidationResponse> {
    return this.http.post<TicketValidationResponse>(this.baseUrl, request);
  }
}
