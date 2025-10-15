import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-event.component.html',
  styleUrl: './create-event.component.css'
})
export class CreateEventComponent {
  eventForm: FormGroup;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', Validators.required],
      eventDate: ['', Validators.required],
      totalSeats: [0, [Validators.required, Validators.min(1)]],
      ticketTypes: this.fb.array([this.createTicketType()])
    });
  }

  get ticketTypes(): FormArray {
    return this.eventForm.get('ticketTypes') as FormArray;
  }

  createTicketType(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [0, [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  addTicketType(): void {
    this.ticketTypes.push(this.createTicketType());
  }

  removeTicketType(index: number): void {
    if (this.ticketTypes.length > 1) {
      this.ticketTypes.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.eventForm.invalid) {
      Object.keys(this.eventForm.controls).forEach(key => {
        this.eventForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    this.error = null;

    this.eventService.createEvent(this.eventForm.value).subscribe({
      next: (event: any) => {
        this.router.navigate(['/organizer/events', event.id, 'dashboard']);
      },
      error: (err: any) => {
        this.error = 'Failed to create event. Please try again.';
        this.isSubmitting = false;
        console.error('Error creating event:', err);
      }
    });
  }
}
