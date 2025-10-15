import { TicketValidationMethod } from '../enums/ticket-validation-method.enum';
import { TicketValidationStatus } from '../enums/ticket-validation-status.enum';

export interface TicketValidation {
  id: string;
  ticketId: string;
  validatedAt: string;
  validatedBy: string;
  method: TicketValidationMethod;
  status: TicketValidationStatus;
}

export interface TicketValidationRequest {
  id: string;
  method: TicketValidationMethod;
}

export interface TicketValidationResponse extends TicketValidation {
  ticketDetails?: {
    eventTitle: string;
    ticketTypeName: string;
    attendeeName: string;
  };
}
