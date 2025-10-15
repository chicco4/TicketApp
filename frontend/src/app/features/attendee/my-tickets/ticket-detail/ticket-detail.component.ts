import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TicketService } from '../../../../core/services/ticket.service';
import { Ticket } from '../../../../core/models/interfaces/ticket.interface';
import { DateFormatPipe } from '../../../../shared/pipes/date-format.pipe';
import { CurrencyPipe } from '../../../../shared/pipes/currency.pipe';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, DateFormatPipe, CurrencyPipe],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  ticket: Ticket | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private ticketService: TicketService
  ) {}

  ngOnInit(): void {
    const ticketId = this.route.snapshot.paramMap.get('id');
    if (ticketId) {
      this.loadTicketDetails(+ticketId);
    }
  }

  loadTicketDetails(id: number): void {
    this.isLoading = true;
    this.error = null;

    this.ticketService.getTicketById(id).subscribe({
      next: (ticket) => {
        this.ticket = ticket;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load ticket details. Please try again.';
        this.isLoading = false;
        console.error('Error loading ticket details:', err);
      }
    });
  }

  downloadTicket(): void {
    if (this.ticket) {
      // Implement ticket download/PDF generation
      console.log('Downloading ticket:', this.ticket.id);
    }
  }
}
