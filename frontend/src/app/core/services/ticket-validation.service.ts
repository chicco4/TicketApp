import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TicketValidationRequest, TicketValidationResponse } from '../models/interfaces/ticket-validation.interface';

@Injectable({
  providedIn: 'root'
})
export class TicketValidationService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/ticket-validations`;

  validateTicket(request: TicketValidationRequest): Observable<TicketValidationResponse> {
    return this.http.post<TicketValidationResponse>(this.apiUrl, request);
  }
}
