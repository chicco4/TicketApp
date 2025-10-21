import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PublishedEventsService } from '../../../core/services/published-events.service';
import { Page } from '../../../core/models/interfaces/page';
import { PublishedEventSummary } from '../../../core/models/interfaces/published-event';
import { getEventTypeImage } from '../../../core/utils/event-type-images';
import { EventType } from '../../../core/models/enums/event-type.enum';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

type FilterFormValue = { query?: string; type?: EventType | '' };

@Component({
  selector: 'app-attendee-home',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './published-events.html',
  styleUrl: './published-events.css'
})
export class AttendeeHome implements OnInit, OnDestroy {
  loading = false;
  error?: string;
  page?: Page<PublishedEventSummary>;
  events: PublishedEventSummary[] = [];
  readonly pageSizeOptions = [8, 16, 24];
  private pageSize = 8;
  private readonly sort = 'start,asc';
  readonly eventTypes = Object.values(EventType);
  readonly filtersForm: FormGroup<{
    query: FormControl<string>;
    type: FormControl<EventType | ''>;
  }>;
  private filtersSub?: Subscription;

  constructor(
    private readonly publishedEvents: PublishedEventsService,
    private readonly router: Router,
    private readonly fb: FormBuilder
  ) {
    this.filtersForm = this.fb.nonNullable.group({
      query: '',
      type: '' as EventType | ''
    });
  }

  ngOnInit(): void {
    this.filtersSub = this.filtersForm.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(
          (previous: FilterFormValue, current: FilterFormValue) =>
            (previous?.query ?? '') === (current?.query ?? '') &&
            (previous?.type ?? '') === (current?.type ?? '')
        )
      )
      .subscribe(() => this.fetchEvents(0));

    this.fetchEvents();
  }

  ngOnDestroy(): void {
    this.filtersSub?.unsubscribe();
  }

  fetchEvents(page = 0, size = this.pageSize): void {
    this.loading = true;
    this.error = undefined;

    this.pageSize = size;
    const filters = this.filtersForm.getRawValue();

    const trimmedQuery = filters.query.trim();

    this.publishedEvents
      .getPublishedEvents({
        page,
        size,
        sort: this.sort,
        query: trimmedQuery ? trimmedQuery : undefined,
        type: filters.type || undefined
      })
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
    this.fetchEvents(event.pageIndex, event.pageSize);
  }

  viewDetails(ev: PublishedEventSummary): void {
    if (!ev?.id) return;
    this.router.navigate(['/attendee/published-events', ev.id]);
  }

  getEventImage(eventType: string): string {
    return getEventTypeImage(eventType);
  }

  resetFilters(): void {
    this.filtersForm.setValue({ query: '', type: '' });
  }
}
