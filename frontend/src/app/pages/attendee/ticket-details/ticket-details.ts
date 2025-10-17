import { Component, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription, switchMap } from 'rxjs';
import { TicketsService } from '../../../core/services/tickets.service';
import { TicketDetail } from '../../../core/models/interfaces/ticket';

@Component({
  selector: 'app-attendee-ticket-details',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule, DatePipe],
  templateUrl: './ticket-details.html',
  styleUrl: './ticket-details.css'
})
export class AttendeeTicketDetails implements OnDestroy {
  loading = true;
  error?: string;
  ticket?: TicketDetail;

  private sub: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly ticketsService: TicketsService
  ) {
    this.sub = this.route.paramMap
      .pipe(
        switchMap((params) => {
          const ticketId = params.get('ticketId');
          if (!ticketId) {
            throw new Error('Missing ticket id');
          }
          this.loading = true;
          this.error = undefined;
          return this.ticketsService.getTicketById(ticketId);
        })
      )
      .subscribe({
        next: (ticket) => {
          this.ticket = ticket;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Failed to load ticket details.';
        }
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  viewQrCode(): void {
    if (!this.ticket?.id) return;
    this.router.navigate(['/attendee/ticket-qr-code', this.ticket.id]);
  }

  goBack(): void {
    this.router.navigate(['/attendee/tickets']);
  }
}
