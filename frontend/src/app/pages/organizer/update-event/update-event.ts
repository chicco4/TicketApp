import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { EventsService } from '../../../core/services/events.service';
import { EventStatus } from '../../../core/models/enums/event-status.enum';
import { EventType } from '../../../core/models/enums/event-type.enum';
import { Event, EventUpdate } from '../../../core/models/interfaces/event';
import { TicketTypeUpdate } from '../../../core/models/interfaces/ticket-type';

interface ParsedDateTime {
  date: Date | null;
  time: string;
}

type TicketTypeFormGroup = FormGroup<{
  id: FormControl<string | null>;
  name: FormControl<string>;
  description: FormControl<string>;
  price: FormControl<number>;
  totalAvailable: FormControl<number | null>;
}>;

type EventFormGroup = FormGroup<{
  name: FormControl<string>;
  description: FormControl<string>;
  status: FormControl<EventStatus>;
  type: FormControl<EventType>;
  startDate: FormControl<Date | null>;
  startTime: FormControl<string>;
  endDate: FormControl<Date | null>;
  endTime: FormControl<string>;
  salesStartDate: FormControl<Date | null>;
  salesStartTime: FormControl<string>;
  salesEndDate: FormControl<Date | null>;
  salesEndTime: FormControl<string>;
  venue: FormControl<string>;
  ticketTypes: FormArray<TicketTypeFormGroup>;
}>;

@Component({
  selector: 'app-organizer-update-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatTimepickerModule,
  ],
  templateUrl: './update-event.html',
  styleUrl: './update-event.css'
})
export class OrganizerUpdateEvent implements OnInit {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly eventsService = inject(EventsService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly statusOptions = Object.values(EventStatus);
  readonly typeOptions = Object.values(EventType);

  readonly form: EventFormGroup = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required, Validators.maxLength(120)] }),
    description: this.fb.control(''),
    status: this.fb.control<EventStatus>(EventStatus.DRAFT, { validators: [Validators.required] }),
    type: this.fb.control<EventType>(EventType.CONCERT, { validators: [Validators.required] }),
    startDate: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
    startTime: this.fb.control('', { validators: [Validators.required] }),
    endDate: this.fb.control<Date | null>(null, { validators: [Validators.required] }),
    endTime: this.fb.control('', { validators: [Validators.required] }),
    salesStartDate: this.fb.control<Date | null>(null),
    salesStartTime: this.fb.control(''),
    salesEndDate: this.fb.control<Date | null>(null),
    salesEndTime: this.fb.control(''),
    venue: this.fb.control('', { validators: [Validators.required, Validators.maxLength(200)] }),
    ticketTypes: this.fb.array<TicketTypeFormGroup>([
      this.createTicketTypeGroup()
    ], { validators: [Validators.minLength(1)] }),
  }) as EventFormGroup;

  submissionInProgress = false;
  submissionError?: string;
  submissionSuccess?: string;
  loadError?: string;
  loading = true;
  showDescriptionField = false;
  showSalesWindowFields = false;

  private eventId?: string;
  private loadedEvent?: Event;

  ngOnInit(): void {
    const paramEventId = this.route.snapshot.paramMap.get('eventId');
    if (!paramEventId) {
      this.loading = false;
      this.loadError = 'Missing event identifier. Use the event list to choose what you want to edit.';
      return;
    }

    this.eventId = paramEventId;
    this.fetchEvent(paramEventId);
  }

  get ticketTypes(): FormArray<TicketTypeFormGroup> {
    return this.form.controls.ticketTypes;
  }

  addTicketType(): void {
    this.ticketTypes.push(this.createTicketTypeGroup());
    this.ticketTypes.markAsDirty();
  }

  removeTicketType(index: number): void {
    if (this.ticketTypes.length === 1) {
      return;
    }
    this.ticketTypes.removeAt(index);
    this.ticketTypes.markAsDirty();
    this.ticketTypes.markAsTouched();
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSubmit(): void {
    if (this.submissionInProgress || this.loading) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submissionError = 'Please review the highlighted fields before saving your changes.';
      this.submissionSuccess = undefined;
      return;
    }

    const formValue = this.form.getRawValue();
    const trimmedName = formValue.name.trim();
    const trimmedVenue = formValue.venue.trim();

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

    const start = this.combineDateAndTime(formValue.startDate, formValue.startTime);
    const end = this.combineDateAndTime(formValue.endDate, formValue.endTime);
    const salesStart = this.combineDateAndTime(formValue.salesStartDate, formValue.salesStartTime);
    const salesEnd = this.combineDateAndTime(formValue.salesEndDate, formValue.salesEndTime);

    if ((formValue.salesStartDate && !formValue.salesStartTime) || (!formValue.salesStartDate && formValue.salesStartTime)) {
      this.submissionError = 'Please provide both date and time for sales opening.';
      return;
    }

    if ((formValue.salesEndDate && !formValue.salesEndTime) || (!formValue.salesEndDate && formValue.salesEndTime)) {
      this.submissionError = 'Please provide both date and time for sales closing.';
      return;
    }

    if (start && end && this.compareDateTime(start, end) >= 0) {
      this.submissionError = 'Event end must be after the start date and time.';
      return;
    }

    if (salesStart && salesEnd && this.compareDateTime(salesStart, salesEnd) > 0) {
      this.submissionError = 'Ticket sales end must be on or after the sales start.';
      return;
    }

    if (salesStart && start && this.compareDateTime(salesStart, start) > 0) {
      this.submissionError = 'Sales cannot open after the event starts.';
      return;
    }

    if (salesEnd && end && this.compareDateTime(salesEnd, end) > 0) {
      this.submissionError = 'Sales must close on or before the event ends.';
      return;
    }

    const ticketTypes: TicketTypeUpdate[] = [];
    let availabilityParseError = false;

    for (const ticket of formValue.ticketTypes) {
      const parsedTotal = this.parseTotalAvailable(ticket.totalAvailable);
      if (parsedTotal === undefined) {
        availabilityParseError = true;
        break;
      }

      const parsedPrice = Number(ticket.price);

      ticketTypes.push({
        id: ticket.id?.trim() || undefined,
        name: ticket.name.trim(),
        description: this.emptyToUndefined(ticket.description),
        price: parsedPrice,
        totalAvailable: parsedTotal,
      });
    }

    if (availabilityParseError) {
      this.submissionError = 'Ticket availability must be a whole number or left blank for unlimited quantity.';
      return;
    }

    if (!ticketTypes.length || ticketTypes.some((tt) => !tt.name)) {
      this.submissionError = 'Each ticket type needs a name.';
      return;
    }

    if (ticketTypes.some((tt) => tt.price < 0)) {
      this.submissionError = 'Ticket prices must be zero or higher.';
      return;
    }

    if (ticketTypes.some((tt) => tt.totalAvailable != null && tt.totalAvailable <= 0)) {
      this.submissionError = 'Each ticket type must have at least one available ticket when a limit is set.';
      return;
    }

    if (!this.eventId) {
      this.submissionError = 'Unable to determine which event to update. Please return to the event list and retry.';
      return;
    }

    const payload: EventUpdate = {
      id: this.eventId,
      name: trimmedName,
      description: this.emptyToUndefined(formValue.description),
      status: formValue.status,
      type: formValue.type,
      start: this.ensureSeconds(start || ''),
      end: this.ensureSeconds(end || ''),
      salesStart: salesStart ? this.ensureSeconds(salesStart) : undefined,
      salesEnd: salesEnd ? this.ensureSeconds(salesEnd) : undefined,
      venue: trimmedVenue,
      ticketTypes,
    };

    this.submissionError = undefined;
    this.submissionSuccess = undefined;
    this.submissionInProgress = true;

    this.eventsService.updateEvent(this.eventId, payload).subscribe({
      next: (event) => {
        this.submissionInProgress = false;
        this.eventsService.setPendingSuccessMessage(`'${event.name}' updated successfully.`);
        this.router.navigate(['/organizer/events']);
      },
      error: (err) => {
        this.submissionInProgress = false;
        this.submissionError = err?.error?.error || err?.error?.message || 'Failed to update the event. Please try again.';
      },
    });
  }

  goToOrganizerEvents(): void {
    this.router.navigate(['/organizer/events']);
  }

  toggleDescriptionField(): void {
    this.showDescriptionField = !this.showDescriptionField;
    if (!this.showDescriptionField) {
      this.form.controls.description.reset('');
    }
  }

  toggleSalesWindowFields(): void {
    this.showSalesWindowFields = !this.showSalesWindowFields;
    if (!this.showSalesWindowFields) {
      this.form.controls.salesStartDate.reset(null);
      this.form.controls.salesStartTime.reset('');
      this.form.controls.salesEndDate.reset(null);
      this.form.controls.salesEndTime.reset('');
    }
  }

  resetToLoadedEvent(): void {
    if (!this.loadedEvent) {
      return;
    }
    this.populateForm(this.loadedEvent);
    this.form.markAsPristine();
    this.form.markAsUntouched();
    this.submissionError = undefined;
    this.submissionSuccess = 'Reverted changes to the last saved version.';
  }

  private fetchEvent(eventId: string): void {
    this.loading = true;
    this.eventsService.getEventById(eventId).subscribe({
      next: (event) => {
        this.eventId = event.id;
        this.loadedEvent = event;
        this.populateForm(event);
        this.loading = false;
        this.form.markAsPristine();
        this.form.markAsUntouched();
      },
      error: (err) => {
        this.loading = false;
        this.loadError = err?.error?.error || err?.error?.message || 'Unable to load event details right now. Please try again later.';
      },
    });
  }

  private populateForm(event: Event): void {
    const start = this.parseDateTime(event.start);
    const end = this.parseDateTime(event.end);
    const salesStart = this.parseDateTime(event.salesStart);
    const salesEnd = this.parseDateTime(event.salesEnd);

    this.form.patchValue({
      name: event.name,
      description: event.description ?? '',
      status: event.status,
      type: event.type,
      startDate: start.date,
      startTime: start.time,
      endDate: end.date,
      endTime: end.time,
      salesStartDate: salesStart.date,
      salesStartTime: salesStart.time,
      salesEndDate: salesEnd.date,
      salesEndTime: salesEnd.time,
      venue: event.venue,
    });

    this.ticketTypes.clear();
    event.ticketTypes?.forEach((ticket) => {
      this.ticketTypes.push(this.createTicketTypeGroup({
        id: ticket.id,
        name: ticket.name,
        description: ticket.description ?? '',
        price: ticket.price,
        totalAvailable: ticket.totalAvailable ?? null,
      }));
    });

    if (!this.ticketTypes.length) {
      this.ticketTypes.push(this.createTicketTypeGroup());
    }

    this.showDescriptionField = !!event.description?.trim();
    this.showSalesWindowFields = !!(event.salesStart || event.salesEnd);
  }

  private createTicketTypeGroup(ticket?: Partial<TicketTypeUpdate>): TicketTypeFormGroup {
    const totalAvailableValue =
      ticket?.totalAvailable === undefined ? 1 : ticket.totalAvailable;

    return this.fb.group({
      id: this.fb.control(ticket?.id ?? null),
      name: this.fb.control(ticket?.name ?? '', { validators: [Validators.required, Validators.maxLength(80)] }),
      description: this.fb.control(ticket?.description ?? ''),
      price: this.fb.control(ticket?.price ?? 0, { validators: [Validators.required, Validators.min(0)] }),
      totalAvailable: new FormControl<number | null>(totalAvailableValue ?? null, { validators: [Validators.min(1)] }),
    });
  }

  private parseTotalAvailable(value: unknown): number | null | undefined {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    if (!Number.isFinite(parsed)) {
      return undefined;
    }

    return Math.trunc(parsed);
  }

  private ensureSeconds(value: string): string {
    if (!value) {
      return value;
    }
    return value.length === 16 ? `${value}:00` : value;
  }

  private emptyToUndefined(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }

  private combineDateAndTime(date: Date | null, time: unknown): string | null {
    if (!date || time === null || time === undefined || time === '') {
      return null;
    }

    const timeParts = this.extractTimeParts(time);
    if (!timeParts) {
      return null;
    }

    const combined = new Date(date);
    combined.setHours(timeParts.hours, timeParts.minutes, 0, 0);

    return combined.toISOString().slice(0, 19);
  }

  private parseDateTime(value?: string): ParsedDateTime {
    if (!value) {
      return { date: null, time: '' };
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      return { date: null, time: '' };
    }

    const hours = parsed.getHours().toString().padStart(2, '0');
    const minutes = parsed.getMinutes().toString().padStart(2, '0');

    return { date: parsed, time: `${hours}:${minutes}` };
  }

  private compareDateTime(start: string, end: string): number {
    return new Date(start).getTime() - new Date(end).getTime();
  }

  private extractTimeParts(time: unknown): { hours: number; minutes: number } | null {
    if (typeof time === 'string') {
      const trimmed = time.trim();
      if (!trimmed) {
        return null;
      }
      const match = trimmed.match(/^([0-9]{1,2}):([0-9]{2})(?:\s*([APap][Mm]))?$/);
      if (!match) {
        return null;
      }

      let hours = Number(match[1]);
      const minutes = Number(match[2]);
      const meridiem = match[3]?.toLowerCase();

      if (Number.isNaN(hours) || Number.isNaN(minutes)) {
        return null;
      }

      if (meridiem === 'pm' && hours < 12) {
        hours += 12;
      }

      if (meridiem === 'am' && hours === 12) {
        hours = 0;
      }

      return { hours, minutes };
    }

    if (time instanceof Date) {
      return { hours: time.getHours(), minutes: time.getMinutes() };
    }

    if (typeof time === 'object' && time !== null) {
      const maybeHours = (time as { hours?: number; hour?: number }).hours ?? (time as { hour?: number }).hour;
      const maybeMinutes = (time as { minutes?: number; minute?: number }).minutes ?? (time as { minute?: number }).minute;

      if (typeof maybeHours === 'number' && typeof maybeMinutes === 'number') {
        return { hours: maybeHours, minutes: maybeMinutes };
      }
    }

    return null;
  }
}
