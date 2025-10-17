import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { TicketsService } from '../../../core/services/tickets.service';
import { Page } from '../../../core/models/interfaces/page';
import { Ticket } from '../../../core/models/interfaces/ticket';

@Component({
  selector: 'app-attendee-tickets',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatPaginatorModule, MatProgressSpinnerModule],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class AttendeeTickets implements OnInit, OnDestroy {
  loading = false;
  error?: string;
  page?: Page<Ticket>;
  tickets: Ticket[] = [];

  private fetchSub?: Subscription;

  constructor(private readonly ticketsService: TicketsService, private readonly router: Router) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  ngOnDestroy(): void {
    this.fetchSub?.unsubscribe();
  }

  loadTickets(page = 0): void {
    this.fetchSub?.unsubscribe();
    this.loading = true;
    this.error = undefined;
    this.fetchSub = this.ticketsService
      .getTickets({ page, size: 10, sort: 'createdAt,desc' })
      .subscribe({
        next: (res) => {
          this.page = res;
          this.tickets = res.content;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Failed to load tickets.';
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.loadTickets(event.pageIndex);
  }

  viewDetails(ticket: Ticket): void {
    if (!ticket?.id) return;
    this.router.navigate(['/attendee/ticket-details', ticket.id]);
  }

  getStatusClass(status: string): string {
    return `status-${status?.toLowerCase()}`;
  }
}
