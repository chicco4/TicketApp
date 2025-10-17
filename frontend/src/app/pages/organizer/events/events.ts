import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { EventsService } from '../../../core/services/events.service';
import { Event, EventUpdate } from '../../../core/models/interfaces/event';
import { Page } from '../../../core/models/interfaces/page';
import { EventStatus } from '../../../core/models/enums/event-status.enum';
import { EventType } from '../../../core/models/enums/event-type.enum';
import { TicketType } from '../../../core/models/interfaces/ticket-type';

interface TicketTypeFormValue {
  id: string;
  name: string;
  description?: string;
  price: number;
  totalAvailable: number;
}

type TicketTypeFormGroup = FormGroup<{
  id: FormControl<string>;
  name: FormControl<string>;
  description: FormControl<string>;
  price: FormControl<number>;
  totalAvailable: FormControl<number>;
}>;

type EventFormGroup = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<EventStatus>;
  type: FormControl<EventType>;
  start: FormControl<string>;
  end: FormControl<string>;
  salesStart: FormControl<string>;
  salesEnd: FormControl<string>;
  venue: FormControl<string>;
  ticketTypes: FormArray<TicketTypeFormGroup>;
}>;

@Component({
  selector: 'app-organizer-events',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
  ],
  templateUrl: './events.html',
  styleUrl: './events.css'
})
export class OrganizerEvents implements OnInit {
  private readonly eventsService = inject(EventsService);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly statusOptions = Object.values(EventStatus);
  readonly typeOptions = Object.values(EventType);
  readonly pageSize = 5;

  loading = false;
  error?: string;
  submissionError?: string;
  submissionSuccess?: string;

  page?: Page<Event>;
  events: Event[] = [];

  editingEvent?: Event;
  editingEventId?: string;
  form?: EventFormGroup;

  submissionInProgress = false;
  deletingEventIds = new Set<string>();
  private pendingSuccess?: string;

  ngOnInit(): void {
    this.fetchEvents();
  }

  get ticketTypes(): FormArray<TicketTypeFormGroup> | undefined {
    return this.form?.controls.ticketTypes;
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

  startEdit(event: Event): void {
    if (this.submissionInProgress) {
      return;
    }
    this.editingEvent = event;
    this.editingEventId = event.id;
    this.form = this.buildForm(event);
    this.submissionError = undefined;
    this.submissionSuccess = undefined;
  }

  cancelEdit(): void {
    if (this.submissionInProgress) {
      return;
    }
    this.editingEvent = undefined;
    this.editingEventId = undefined;
    this.form = undefined;
    this.submissionError = undefined;
  }

  saveEdit(): void {
    if (!this.form || !this.editingEvent) {
      return;
    }
    if (this.submissionInProgress) {
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submissionError = 'Please fix the highlighted fields before saving the event.';
      return;
    }

    const value = this.form.getRawValue();
    const trimmedName = value.name.trim();
    const trimmedVenue = value.venue.trim();

    if (!trimmedName) {
      this.form.controls.name.setErrors({ required: true });
      this.submissionError = 'Event name is required.';
      return;
    }

    if (!trimmedVenue) {
      this.form.controls.venue.setErrors({ required: true });
      this.submissionError = 'Venue is required.';
      return;
    }

    const start = value.start;
    const end = value.end;
    const salesStart = value.salesStart;
    const salesEnd = value.salesEnd;

    if (start && end && this.compareDateTimes(start, end) >= 0) {
      this.submissionError = 'Event end must be after the start date and time.';
      return;
    }

    if (salesStart && salesEnd && this.compareDateTimes(salesStart, salesEnd) > 0) {
      this.submissionError = 'Ticket sales end must be on or after the sales start.';
      return;
    }

    if (salesStart && start && this.compareDateTimes(salesStart, start) > 0) {
      this.submissionError = 'Sales cannot open after the event starts.';
      return;
    }

    if (salesEnd && end && this.compareDateTimes(salesEnd, end) > 0) {
      this.submissionError = 'Sales must close on or before the event ends.';
      return;
    }

    const ticketTypes: TicketTypeFormValue[] = value.ticketTypes.map((ticket) => ({
      id: ticket.id,
      name: ticket.name.trim(),
      description: this.emptyToUndefined(ticket.description),
      price: Number(ticket.price),
      totalAvailable: Math.trunc(Number(ticket.totalAvailable ?? 0)),
    }));

    if (!ticketTypes.length) {
      this.submissionError = 'At least one ticket type is required.';
      return;
    }

    if (ticketTypes.some((tt) => !tt.id)) {
      this.submissionError = 'Each ticket type must include its identifier.';
      return;
    }

    if (ticketTypes.some((tt) => !tt.name)) {
      this.submissionError = 'Each ticket type needs a name.';
      return;
    }

    if (ticketTypes.some((tt) => tt.price < 0)) {
      this.submissionError = 'Ticket prices must be zero or higher.';
      return;
    }

    if (ticketTypes.some((tt) => tt.totalAvailable <= 0)) {
      this.submissionError = 'Each ticket type must have at least one available ticket.';
      return;
    }

    const payload: EventUpdate = {
      id: this.editingEvent.id,
      name: trimmedName,
      description: this.emptyToUndefined(value.description),
      status: value.status,
      type: value.type,
      start: this.ensureSeconds(start),
      end: this.ensureSeconds(end),
      salesStart: this.optionalDate(salesStart),
      salesEnd: this.optionalDate(salesEnd),
      venue: trimmedVenue,
      ticketTypes,
    };

    this.submissionError = undefined;
    this.submissionInProgress = true;

    this.eventsService.updateEvent(payload.id, payload).subscribe({
      next: (updated) => {
        this.submissionInProgress = false;
        this.submissionSuccess = `'${updated.name}' updated successfully.`;
        this.submissionError = undefined;
        this.replaceEvent(updated);
        this.cancelEdit();
      },
      error: (err) => {
        this.submissionInProgress = false;
        this.submissionError = err?.error?.message || 'Failed to update the event. Please try again.';
      },
    });
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

  trackByEventId(index: number, event: Event): string {
    return event.id;
  }

  trackTicketType(index: number, _?: unknown): number {
    return index;
  }

  private buildForm(event: Event): EventFormGroup {
    return this.fb.group({
      name: this.fb.control(event.name ?? '', { validators: [Validators.required, Validators.maxLength(120)] }),
      description: this.fb.control(event.description ?? ''),
      status: this.fb.control<EventStatus>(event.status, { validators: [Validators.required] }),
      type: this.fb.control<EventType>(event.type, { validators: [Validators.required] }),
      start: this.fb.control(this.toDateTimeLocal(event.start), { validators: [Validators.required] }),
      end: this.fb.control(this.toDateTimeLocal(event.end), { validators: [Validators.required] }),
      salesStart: this.fb.control(this.toDateTimeLocal(event.salesStart)),
      salesEnd: this.fb.control(this.toDateTimeLocal(event.salesEnd)),
      venue: this.fb.control(event.venue ?? '', { validators: [Validators.required, Validators.maxLength(200)] }),
      ticketTypes: this.fb.array<TicketTypeFormGroup>(
        (event.ticketTypes ?? []).map((ticket) => this.createTicketTypeGroup(ticket)),
        { validators: [Validators.minLength(1)] }
      ),
    });
  }

  private createTicketTypeGroup(ticket: TicketType): TicketTypeFormGroup {
    return this.fb.group({
      id: this.fb.control(ticket.id ?? '', { validators: [Validators.required] }),
      name: this.fb.control(ticket.name ?? '', { validators: [Validators.required, Validators.maxLength(80)] }),
      description: this.fb.control(ticket.description ?? ''),
      price: this.fb.control(ticket.price ?? 0, { validators: [Validators.required, Validators.min(0)] }),
      totalAvailable: this.fb.control(ticket.totalAvailable ?? 1, { validators: [Validators.required, Validators.min(1)] }),
    });
  }

  private replaceEvent(updated: Event): void {
    const updatedEvents = this.events.map((event) => (event.id === updated.id ? updated : event));
    this.events = updatedEvents;
    if (this.page) {
      this.page = { ...this.page, content: updatedEvents };
    }
  }

  private compareDateTimes(start: string, end: string): number {
    return new Date(start).getTime() - new Date(end).getTime();
  }

  private ensureSeconds(value: string): string {
    if (!value) {
      return value;
    }
    const trimmed = value.trim();
    if (!trimmed) {
      return trimmed;
    }
    return trimmed.length === 16 ? `${trimmed}:00` : trimmed;
  }

  private optionalDate(value: string): string | undefined {
    const trimmed = value?.trim();
    if (!trimmed) {
      return undefined;
    }
    return this.ensureSeconds(trimmed);
  }

  private emptyToUndefined(value: string): string | undefined {
    const trimmed = value?.trim();
    return trimmed ? trimmed : undefined;
  }

  private toDateTimeLocal(value?: string): string {
    if (!value) {
      return '';
    }
    const trimmed = value.trim().replace('Z', '');
    if (!trimmed) {
      return '';
    }
    return trimmed.length >= 16 ? trimmed.slice(0, 16) : trimmed;
  }
}
