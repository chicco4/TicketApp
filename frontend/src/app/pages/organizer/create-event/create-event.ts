import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
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

type TicketTypeFormGroup = FormGroup<{
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
  selector: 'app-organizer-create-event',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelectModule,
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

  readonly form: EventFormGroup = this.fb.group({
    name: this.fb.control('', { validators: [Validators.required, Validators.maxLength(120)] }),
    description: this.fb.control(''),
    status: this.fb.control<EventStatus>(EventStatus.DRAFT, { validators: [Validators.required] }),
    type: this.fb.control<EventType>(EventType.CONCERT, { validators: [Validators.required] }),
    start: this.fb.control('', { validators: [Validators.required] }),
    end: this.fb.control('', { validators: [Validators.required] }),
    salesStart: this.fb.control(''),
    salesEnd: this.fb.control(''),
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

    const start = formValue.start;
    const end = formValue.end;
    const salesStart = formValue.salesStart;
    const salesEnd = formValue.salesEnd;

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

    const payload: EventCreate = {
      name: trimmedName,
      description: this.emptyToUndefined(formValue.description),
      status: formValue.status,
      type: formValue.type,
      start: this.ensureSeconds(start),
      end: this.ensureSeconds(end),
      salesStart: this.optionalDate(salesStart),
      salesEnd: this.optionalDate(salesEnd),
      venue: trimmedVenue,
      ticketTypes: formValue.ticketTypes.map((ticket) => ({
        name: ticket.name.trim(),
        description: this.emptyToUndefined(ticket.description),
        price: Number(ticket.price),
        totalAvailable: Math.trunc(Number(ticket.totalAvailable)),
      })),
    };

    if (!payload.ticketTypes.length || payload.ticketTypes.some((tt) => !tt.name)) {
      this.submissionError = 'Each ticket type needs a name.';
      return;
    }

    if (payload.ticketTypes.some((tt) => tt.price < 0)) {
      this.submissionError = 'Ticket prices must be zero or higher.';
      return;
    }

    if (payload.ticketTypes.some((tt) => tt.totalAvailable <= 0)) {
      this.submissionError = 'Each ticket type must have at least one available ticket.';
      return;
    }

    this.submissionError = undefined;
    this.submissionInProgress = true;

    this.eventsService.createEvent(payload).subscribe({
      next: (event) => {
        this.submissionInProgress = false;
        // Navigate immediately back to organizer events page
        this.router.navigate(['/organizer/events']);
      },
      error: (err) => {
        this.submissionInProgress = false;
        this.submissionError = err?.error?.message || 'Failed to create the event. Please try again.';
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

  private createTicketTypeGroup(): TicketTypeFormGroup {
    return this.fb.group({
      name: this.fb.control('', { validators: [Validators.required, Validators.maxLength(80)] }),
      description: this.fb.control(''),
      price: this.fb.control(0, { validators: [Validators.required, Validators.min(0)] }),
      totalAvailable: this.fb.control(1, { validators: [Validators.required, Validators.min(1)] }),
    });
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
      start: '',
      end: '',
      salesStart: '',
      salesEnd: '',
      venue: '',
      ticketTypes: [],
    });
    this.ticketTypes.clear();
    this.ticketTypes.push(this.createTicketTypeGroup());
    this.form.markAsPristine();
    this.form.markAsUntouched();
  }
}
