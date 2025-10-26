import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
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
import { Router } from '@angular/router';
import { EventsService } from '../../../core/services/events.service';
import { EventStatus } from '../../../core/models/enums/event-status.enum';
import { EventType } from '../../../core/models/enums/event-type.enum';
import { EventCreate } from '../../../core/models/interfaces/event';
import { TicketTypeCreate } from '../../../core/models/interfaces/ticket-type';

type TicketTypeFormGroup = FormGroup<{
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
  selector: 'app-organizer-create-event',
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
  templateUrl: './create-event.html',
  styleUrl: './create-event.css'
})
export class OrganizerCreateEvent {
  private readonly fb = inject(NonNullableFormBuilder);
  private readonly eventsService = inject(EventsService);
  private readonly router = inject(Router);

  readonly statusOptions = Object.values(EventStatus);
  readonly typeOptions = Object.values(EventType);

  submissionInProgress = false;
  submissionError?: string;
  showDescriptionField = false;
  showSalesWindowFields = false;

  constructor() {
    this.syncOptionalSectionVisibility();
  }

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
    if (this.submissionInProgress) return;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.submissionError = 'Please review the highlighted fields before trying again.';
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

    // Validate that both date and time are provided for sales dates
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

    const ticketTypes: TicketTypeCreate[] = [];
    let availabilityParseError = false;

    for (const ticket of formValue.ticketTypes) {
      const parsedTotal = this.parseTotalAvailable(ticket.totalAvailable);
      if (parsedTotal === undefined) {
        availabilityParseError = true;
        break;
      }

      const parsedPrice = Number(ticket.price);

      ticketTypes.push({
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

    const payload: EventCreate = {
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

    if (!payload.ticketTypes.length || payload.ticketTypes.some((tt) => !tt.name)) {
      this.submissionError = 'Each ticket type needs a name.';
      return;
    }

    if (payload.ticketTypes.some((tt) => tt.price < 0)) {
      this.submissionError = 'Ticket prices must be zero or higher.';
      return;
    }

    if (payload.ticketTypes.some((tt) => tt.totalAvailable != null && tt.totalAvailable <= 0)) {
      this.submissionError = 'Each ticket type must have at least one available ticket when a limit is set.';
      return;
    }

    this.submissionError = undefined;
    this.submissionInProgress = true;

    this.eventsService.createEvent(payload).subscribe({
      next: (event) => {
        this.submissionInProgress = false;
        // Set success message for display on events page
        this.eventsService.setPendingSuccessMessage(`'${event.name}' created successfully.`);
        // Navigate back to organizer events page
        this.router.navigate(['/organizer/events']);
      },
      error: (err) => {
        this.submissionInProgress = false;
        this.submissionError = err?.error?.error || err?.error?.message || 'Failed to create the event. Please try again.';
      },
    });
  }

  goToOrganizerEvents(): void {
    this.router.navigate(['/organizer/events']);
  }

  resetForNewEvent(): void {
    this.submissionError = undefined;
    this.resetFormControls();
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

  private createTicketTypeGroup(): TicketTypeFormGroup {
    return this.fb.group({
      name: this.fb.control('', { validators: [Validators.required, Validators.maxLength(80)] }),
      description: this.fb.control(''),
      price: this.fb.control(0, { validators: [Validators.required, Validators.min(0)] }),
      totalAvailable: new FormControl<number | null>(1, { validators: [Validators.min(1)] }),
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

  private compareDateTimes(start: string, end: string): number {
    return new Date(start).getTime() - new Date(end).getTime();
  }

  private ensureSeconds(value: string): string {
    if (!value) {
      return value;
    }
    return value.length === 16 ? `${value}:00` : value;
  }

  private optionalDate(value: string): string | undefined {
    const trimmed = value?.trim();
    if (!trimmed) {
      return undefined;
    }
    return this.ensureSeconds(trimmed);
  }

  private emptyToUndefined(value: string): string | undefined {
    const trimmed = value.trim();
    return trimmed ? trimmed : undefined;
  }

  private resetFormControls(): void {
    this.form.reset({
      name: '',
      description: '',
      status: EventStatus.DRAFT,
      type: EventType.CONCERT,
      startDate: null,
      startTime: '',
      endDate: null,
      endTime: '',
      salesStartDate: null,
      salesStartTime: '',
      salesEndDate: null,
      salesEndTime: '',
      venue: '',
      ticketTypes: [],
    });
    this.ticketTypes.clear();
    this.ticketTypes.push(this.createTicketTypeGroup());
    this.showDescriptionField = false;
    this.showSalesWindowFields = false;
    this.form.markAsPristine();
    this.form.markAsUntouched();
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

    // Convert to ISO string and remove the 'Z' to get local datetime format
    return combined.toISOString().slice(0, 19);
  }

  private compareDateTime(start: string, end: string): number {
    return new Date(start).getTime() - new Date(end).getTime();
  }

  private syncOptionalSectionVisibility(): void {
    this.showDescriptionField = !!this.form.controls.description.value?.trim();
    this.showSalesWindowFields = !!(
      this.form.controls.salesStartDate.value ||
      this.form.controls.salesStartTime.value ||
      this.form.controls.salesEndDate.value ||
      this.form.controls.salesEndTime.value
    );
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
