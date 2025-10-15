import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { PageEvent } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { PublishedEventService } from '../../../core/services/published-event.service';
import { EventCardComponent } from '../../../shared/components/event-card/event-card.component';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { Page } from '../../../core/models/interfaces/page.interface';
import { ListPublishedEventResponse } from '../../../core/models/interfaces/event.interface';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatIconModule,
    EventCardComponent,
    PaginationComponent
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  private publishedEventService = inject(PublishedEventService);
  private router = inject(Router);

  searchControl = new FormControl('');
  events: Page<ListPublishedEventResponse> | null = null;
  loading = false;
  error: string | null = null;

  currentPage = 0;
  pageSize = 10;

  ngOnInit(): void {
    this.loadEvents();
    
    this.searchControl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.currentPage = 0;
        this.loadEvents();
      });
  }

  loadEvents(): void {
    this.loading = true;
    this.error = null;

    const query = this.searchControl.value || undefined;

    this.publishedEventService.listPublishedEvents(query, this.currentPage, this.pageSize)
      .subscribe({
        next: (data) => {
          this.events = data;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to load events. Please try again.';
          this.loading = false;
          console.error('Error loading events:', err);
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEvents();
  }

  onEventClick(eventId: string): void {
    this.router.navigate(['/events', eventId]);
  }
}
