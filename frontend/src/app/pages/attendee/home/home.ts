import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PublishedEventsService } from '../../../core/services/published-events.service';
import { Page } from '../../../core/models/interfaces/page';
import { PublishedEvent } from '../../../core/models/interfaces/published-event';

@Component({
  selector: 'app-attendee-home',
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class AttendeeHome implements OnInit {
  loading = false;
  error?: string;
  page?: Page<PublishedEvent>;
  events: PublishedEvent[] = [];

  constructor(private readonly publishedEvents: PublishedEventsService) {}

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
}
