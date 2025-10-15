import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PublishedEventsService } from '../../../core/services/published-events.service';
import { PublishedEvent } from '../../../core/models/interfaces/published-event';
import { Subscription, switchMap } from 'rxjs';

@Component({
  selector: 'app-attendee-event-details',
  standalone: true,
  imports: [CommonModule, RouterLink, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './event-details.html',
  styleUrl: './event-details.css'
})
export class AttendeeEventDetails implements OnDestroy {
  loading = true;
  error?: string;
  event?: PublishedEvent;

  private sub: Subscription;

  constructor(private readonly route: ActivatedRoute, private readonly service: PublishedEventsService) {
    this.sub = this.route.paramMap
      .pipe(switchMap((params) => {
        const id = params.get('id');
        if (!id) throw new Error('Missing event id');
        this.loading = true;
        this.error = undefined;
        return this.service.getPublishedEventById(id);
      }))
      .subscribe({
        next: (ev) => {
          this.event = ev;
          this.loading = false;
        },
        error: (err) => {
          this.loading = false;
          this.error = err?.error?.message || 'Failed to load event details.';
        },
      });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
