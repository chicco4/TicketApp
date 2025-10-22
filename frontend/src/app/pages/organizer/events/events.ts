import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EventsService } from '../../../core/services/events.service';
import { Event } from '../../../core/models/interfaces/event';
import { Page } from '../../../core/models/interfaces/page';
import { QuickGuideCardComponent, type QuickGuideStep } from '../../../shared/components/quick-guide-card/quick-guide-card';
import { MoneyPipe } from '../../../shared/pipes/money.pipe';

@Component({
  selector: 'app-organizer-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatIconModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    QuickGuideCardComponent,
    MoneyPipe,
  ],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class OrganizerEvents implements OnInit {
  private readonly eventsService = inject(EventsService);

  readonly pageSize = 5;

  loading = false;
  error?: string;
  submissionSuccess?: string;
  showQuickGuide = true;
  readonly organizerQuickGuide = {
    icon: 'business_center',
    title: 'Organizer Quick Guide',
    subtitle: 'Master event management in three simple steps.',
    steps: [
      { icon: 'add_circle', text: 'Create events with detailed schedules, venues, and ticket configurations.' },
      { icon: 'edit', text: 'Edit event details, adjust pricing, and manage ticket availability in real-time.' },
      { icon: 'analytics', text: 'Monitor sales performance and manage event status from draft to published.' },
    ] satisfies QuickGuideStep[],
  };

  page?: Page<Event>;
  events: Event[] = [];

  deletingEventIds = new Set<string>();
  private pendingSuccess?: string;

  ngOnInit(): void {
    const pendingMessage = this.eventsService.getPendingSuccessMessage();
    if (pendingMessage) {
      this.submissionSuccess = pendingMessage;
    }

    this.fetchEvents();
  }

  fetchEvents(page = 0): void {
    this.loading = true;
    this.error = undefined;

    this.eventsService.getEvents({ page, size: this.pageSize, sort: 'updatedAt,desc' }).subscribe({
      next: (res) => {
        const content = [...res.content];
        this.page = { ...res, content };
        this.events = content;
        this.loading = false;
        if (this.pendingSuccess) {
          this.submissionSuccess = this.pendingSuccess;
          this.pendingSuccess = undefined;
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Unable to load events right now. Please try again later.';
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.fetchEvents(event.pageIndex);
  }

  deleteEvent(event: Event): void {
    if (this.deletingEventIds.has(event.id)) {
      return;
    }

    const confirmed = window.confirm(`Delete the event '${event.name}'? This action cannot be undone.`);
    if (!confirmed) {
      return;
    }

    this.deletingEventIds.add(event.id);

    const currentPage = this.page?.number ?? 0;
    const shouldGoToPreviousPage = this.events.length === 1 && currentPage > 0;
    const targetPage = shouldGoToPreviousPage ? currentPage - 1 : currentPage;

    this.eventsService.deleteEvent(event.id).subscribe({
      next: () => {
        this.deletingEventIds.delete(event.id);
        this.pendingSuccess = `'${event.name}' deleted successfully.`;
        this.fetchEvents(targetPage);
      },
      error: (err) => {
        this.deletingEventIds.delete(event.id);
        this.error = err?.error?.message || 'Failed to delete the event. Please try again later.';
      },
    });
  }

  isDeleting(eventId: string): boolean {
    return this.deletingEventIds.has(eventId);
  }

  trackByEventId(_index: number, event: Event): string {
    return event.id;
  }

  trackTicketType(index: number, _?: unknown): number {
    return index;
  }
}
