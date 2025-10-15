import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TicketService } from '../../../core/services/ticket.service';
import { Ticket } from '../../../core/models/interfaces/ticket.interface';
import { TicketCardComponent } from '../../../shared/components/ticket-card/ticket-card.component';

@Component({
  selector: 'app-my-tickets',
  standalone: true,
  imports: [CommonModule, RouterLink, TicketCardComponent],
  templateUrl: './my-tickets.component.html',
  styleUrl: './my-tickets.component.css'
})
export class MyTicketsComponent implements OnInit {
  tickets: Ticket[] = [];
  isLoading = true;
  error: string | null = null;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.loadMyTickets();
  }

  loadMyTickets(): void {
    this.isLoading = true;
    this.error = null;

    this.ticketService.getMyTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load your tickets. Please try again.';
        this.isLoading = false;
        console.error('Error loading tickets:', err);
      }
    });
  }
}
