import { TicketValidationMethod } from '../enums/ticket-validation-method.enum';
import { TicketValidationStatus } from '../enums/ticket-validation-status.enum';

export interface TicketValidationRequest {
  id: string; // ticket ID
  method: TicketValidationMethod;
}

export interface TicketValidationResponse {
  ticketId: string;
  status: TicketValidationStatus;
}
