import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../../core/services/event.service';
import { Event } from '../../../core/models/interfaces/event.interface';

@Component({
  selector: 'app-edit-event',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-event.component.html',
  styleUrl: './edit-event.component.css'
})
export class EditEventComponent implements OnInit {
  eventForm: FormGroup;
  eventId: string = '';
  isLoading = true;
  isSubmitting = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      location: ['', Validators.required],
      eventDate: ['', Validators.required],
      totalSeats: [0, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.eventId = this.route.snapshot.paramMap.get('id') || '';
    if (this.eventId) {
      this.loadEvent();
    }
  }

  loadEvent(): void {
    this.isLoading = true;
    this.error = null;

    this.eventService.getEvent(this.eventId).subscribe({
      next: (event: Event) => {
        this.eventForm.patchValue({
          name: event.name,
          description: event.description,
          location: event.location,
          eventDate: this.formatDateForInput(event.eventDate),
          totalSeats: event.totalSeats
        });
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load event. Please try again.';
        this.isLoading = false;
        console.error('Error loading event:', err);
      }
    });
  }

  formatDateForInput(date: Date | string): string {
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
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

    this.eventService.updateEvent(this.eventId, this.eventForm.value).subscribe({
      next: () => {
        this.router.navigate(['/organizer/events', this.eventId, 'dashboard']);
      },
      error: (err: any) => {
        this.error = 'Failed to update event. Please try again.';
        this.isSubmitting = false;
        console.error('Error updating event:', err);
      }
    });
  }
}
