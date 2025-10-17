import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TicketDetail } from '../../../core/models/interfaces/ticket';
import { PublishedEvent } from '../../../core/models/interfaces/published-event';
import { TicketType } from '../../../core/models/interfaces/ticket-type';

interface PurchaseSuccessState {
  tickets?: TicketDetail[];
  event?: PublishedEvent;
  ticketType?: TicketType;
  quantity?: number;
}

@Component({
  selector: 'app-purchase-success',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './purchase-success.html',
  styleUrl: './purchase-success.css'
})
export class PurchaseSuccess {
  tickets: TicketDetail[] = [];
  event?: PublishedEvent;
  ticketType?: TicketType;
  quantity = 0;
  eventName?: string;
  eventVenue?: string;
  eventDate?: string;
  totalPrice = 0;

  constructor(private readonly router: Router) {
    const navigation = this.router.getCurrentNavigation();
    const state = (navigation?.extras?.state ?? history.state) as PurchaseSuccessState;

    const tickets = Array.isArray(state?.tickets) ? state.tickets : undefined;
    const ticketType = state?.ticketType;

    if (!tickets?.length || !ticketType) {
      this.router.navigate(['/attendee/published-events']);
      return;
    }

    this.tickets = tickets;
    this.ticketType = ticketType;
    this.event = state?.event;
    this.quantity = state?.quantity ?? tickets.length;

    const primaryTicket = tickets[0];
    this.eventName = this.event?.name ?? primaryTicket.eventName;
    this.eventVenue = this.event?.venue ?? primaryTicket.eventVenue;
    this.eventDate = this.event?.start ?? primaryTicket.eventStart;
    this.totalPrice = tickets.reduce((sum, ticket) => sum + (ticket.price ?? 0), 0);
  }

  goHome(): void {
    this.router.navigate(['/attendee/published-events']);
  }
}
