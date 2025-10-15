import { EventStatus } from '../enums/event-status.enum';
import { EventType } from '../enums/event-type.enum';

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  status: EventStatus;
  type: EventType;
  imageUrl?: string;
  organizerId: string;
  organizerName?: string;
  capacity?: number;
  ticketsSold?: number;
}

export interface CreateEventRequest {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  type: EventType;
  imageUrl?: string;
  capacity?: number;
}

export interface UpdateEventRequest extends CreateEventRequest {
  status?: EventStatus;
}

export interface ListEventResponse {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  location: string;
  status: EventStatus;
  type: EventType;
  ticketTypes?: Array<{
    id: string;
    name: string;
    price: number;
    availableQuantity: number;
  }>;
}

export interface GetEventDetailsResponse extends Event {
  ticketTypes: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    totalQuantity: number;
    availableQuantity: number;
  }>;
}

export interface GetPublishedEventDetailsResponse extends GetEventDetailsResponse {
}

export interface ListPublishedEventResponse extends ListEventResponse {
}
