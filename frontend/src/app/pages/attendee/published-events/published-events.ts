import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { PublishedEventsService } from '../../../core/services/published-events.service';
import { Page } from '../../../core/models/interfaces/page';
import { PublishedEventSummary } from '../../../core/models/interfaces/published-event';
import { getEventTypeImage } from '../../../core/utils/event-type-images';

@Component({
  selector: 'app-attendee-home',
  imports: [CommonModule, MatCardModule, MatPaginatorModule, MatProgressSpinnerModule, MatButtonModule],
  templateUrl: './published-events.html',
  styleUrl: './published-events.css'
})
export class AttendeeHome implements OnInit {
  loading = false;
  error?: string;
  page?: Page<PublishedEventSummary>;
  events: PublishedEventSummary[] = [];

  constructor(private readonly publishedEvents: PublishedEventsService, private readonly router: Router) {}

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(page = 0): void {
    this.loading = true;
    this.error = undefined;
    this.publishedEvents
      .getPublishedEvents({ page, size: 10, sort: 'start,asc' })
      .subscribe({
        next: (res) => {
          this.page = res;
          this.events = res.content;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Failed to load events.';
        },
      });
  }

  gotoPage(p: number): void {
    if (!this.page) return;
    if (p < 0 || p >= this.page.totalPages || p === this.page.number) return;
    this.fetchEvents(p);
  }

  onPageChange(event: PageEvent): void {
    this.fetchEvents(event.pageIndex);
  }

  viewDetails(ev: PublishedEventSummary): void {
    if (!ev?.id) return;
    this.router.navigate(['/attendee/published-events', ev.id]);
  }

  getEventImage(eventType: string): string {
    return getEventTypeImage(eventType);
  }
}
