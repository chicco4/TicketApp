import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { TicketsService } from '../../../core/services/tickets.service';
import { Page } from '../../../core/models/interfaces/page';
import { Ticket } from '../../../core/models/interfaces/ticket';
import { QuickGuideCardComponent, type QuickGuideStep } from '../../../shared/components/quick-guide-card/quick-guide-card';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

@Component({
  selector: 'app-attendee-tickets',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    QuickGuideCardComponent,
    MoneyPipe,
  ],
  templateUrl: './tickets.html',
  styleUrl: './tickets.css'
})
export class AttendeeTickets implements OnInit, OnDestroy {
  loading = false;
  error?: string;
  page?: Page<Ticket>;
  tickets: Ticket[] = [];
  readonly pageSize = 8;
  readonly ticketsQuickGuide = {
    icon: 'confirmation_number',
    title: 'Ticket Quick Guide',
    subtitle: 'Your purchased tickets and redemption steps at a glance.',
    steps: [
      { icon: 'inventory_2', text: 'Each card shows ticket status, price, and the unique ticket ID.' },
      { icon: 'qr_code', text: 'Select "View details" to open the QR code ready for event entry.' },
      { icon: 'support_agent', text: 'Contact the organizer or support if you need ticket changes.' },
    ] satisfies QuickGuideStep[],
  };
  showQuickGuide = true;

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
      .getTickets({ page, size: this.pageSize, sort: 'createdAt,desc' })
      .subscribe({
        next: (res) => {
          this.page = res;
          this.tickets = res.content.slice(0, this.pageSize);
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
