import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { OutdoorCenterService } from '../../application/outdoor-center.service';
import { ReservationService } from '../../../shared/application/reservation.service';
import { WeatherService } from '../../../weather/application/weather.service';
import { OutdoorCenterEntity } from '../../domain/entities/outdoor-center.entity';
import { ActivityType, ReservationEntity } from '../../../shared/domain/entities/reservation.entity';

function nonBlank(control: AbstractControl): ValidationErrors | null {
  return String(control.value ?? '').trim().length > 0 ? null : { blank: true };
}

@Component({
  standalone: true,
  imports: [ReactiveFormsModule, TranslateModule],
  template: `
    <section class="page-heading">
      <p class="eyebrow">TRAILGO / RESERVATIONS</p>
      <h1>{{ 'new-reservation' | translate }}</h1>
      <p>{{ 'reservation-subtitle' | translate }}</p>
    </section>
    <section class="form-card">
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>{{ 'select-center' | translate }}
          <select formControlName="outdoorCenterId" (change)="onCenterChange()">
            <option [ngValue]="null" disabled>Select a center</option>
            @for (center of centers(); track center.id) { <option [ngValue]="center.id">{{ center.name }}</option> }
          </select>
        </label>
        <label>{{ 'activity-type' | translate }}
          <select formControlName="activityType" (change)="onActivityChange()">
            <option value="hiking">{{ 'hiking' | translate }}</option>
            <option value="running">{{ 'running' | translate }}</option>
            <option value="cycling">{{ 'cycling' | translate }}</option>
            <option value="trekking">{{ 'trekking' | translate }}</option>
          </select>
        </label>
        <label>{{ 'participant-name' | translate }}
          <input formControlName="participantName" placeholder="e.g. Alex Morgan" autocomplete="name">
          @if (form.controls.participantName.touched && form.controls.participantName.invalid) {
            <small class="field-error">{{ 'required-name' | translate }}</small>
          }
        </label>
        <label>{{ 'participants-count' | translate }}
          <input type="number" min="1" step="1" formControlName="participants">
          @if (form.controls.participants.touched && form.controls.participants.invalid) {
            <small class="field-error">{{ 'invalid-count' | translate }}</small>
          }
        </label>
        <div class="weather-panel">
          <div class="weather-symbol">☀</div>
          <div><span>{{ 'temperature' | translate }}</span>
            @if (weatherLoading()) { <strong>{{ 'loading-weather' | translate }}</strong> }
            @else if (temperature() !== null) { <strong>{{ temperature() }} °C</strong> }
            @else { <strong>—</strong> }
          </div>
        </div>
        @if (weatherError()) { <div class="error-banner">{{ 'weather-error' | translate }}</div> }
        @if (capacityError()) { <div class="error-banner">{{ 'capacity-error' | translate }}</div> }
        @if (serverError()) { <div class="error-banner">{{ 'server-error' | translate }}</div> }
        <div class="form-actions">
          <button type="button" class="button-secondary" (click)="cancel()">{{ 'cancel' | translate }}</button>
          <button type="submit" class="button-primary" [disabled]="form.invalid || weatherLoading() || weatherError() || temperature() === null || saving()">{{ 'create' | translate }}</button>
        </div>
      </form>
    </section>
  `
})
export class NewReservationComponent implements OnInit {
  centers = signal<OutdoorCenterEntity[]>([]);
  temperature = signal<number | null>(null);
  weatherLoading = signal(false);
  weatherError = signal(false);
  capacityError = signal(false);
  serverError = signal(false);
  saving = signal(false);
  private weatherRequestId = 0;

  form = this.fb.group({
    outdoorCenterId: [null as number | null, Validators.required],
    activityType: ['hiking' as ActivityType, Validators.required],
    participantName: ['', [Validators.required, nonBlank]],
    participants: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\\d*$/)]]
  });

  constructor(
    private fb: FormBuilder,
    private centerService: OutdoorCenterService,
    private reservationService: ReservationService,
    private weatherService: WeatherService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.centerService.getAll().subscribe({
      next: centers => {
        this.centers.set(centers);
        const initial = centers.find(center => center.activityType === this.form.controls.activityType.value) ?? centers[0];
        if (initial) {
          this.form.controls.outdoorCenterId.setValue(initial.id);
          this.form.controls.activityType.setValue(initial.activityType);
          this.loadWeather(initial);
        }
      },
      error: () => this.serverError.set(true)
    });
  }

  onCenterChange(): void {
    const center = this.selectedCenter();
    if (center) {
      this.form.controls.activityType.setValue(center.activityType);
      this.loadWeather(center);
    }
  }

  onActivityChange(): void {
    const activity = this.form.controls.activityType.value;
    const center = this.centers().find(item => item.activityType === activity) ?? this.selectedCenter();
    if (center) {
      this.form.controls.outdoorCenterId.setValue(center.id);
      this.loadWeather(center);
    }
  }

  private selectedCenter(): OutdoorCenterEntity | undefined {
    return this.centers().find(center => center.id === Number(this.form.controls.outdoorCenterId.value));
  }

  private loadWeather(center: OutdoorCenterEntity): void {
    const requestId = ++this.weatherRequestId;
    this.temperature.set(null);
    this.weatherError.set(false);
    this.weatherLoading.set(true);
    this.weatherService.getCurrentTemperature(center.latitude, center.longitude).subscribe({
      next: weather => {
        if (requestId !== this.weatherRequestId) return;
        this.temperature.set(weather.temperature);
        this.weatherLoading.set(false);
      },
      error: () => {
        if (requestId !== this.weatherRequestId) return;
        this.weatherError.set(true);
        this.weatherLoading.set(false);
      }
    });
  }

  submit(): void {
    this.form.markAllAsTouched();
    this.capacityError.set(false);
    this.serverError.set(false);
    if (this.form.invalid || this.temperature() === null || this.weatherError() || this.weatherLoading()) return;
    const center = this.selectedCenter();
    if (!center) return;
    const participantName = this.form.controls.participantName.value?.trim() ?? '';
    const participants = Number(this.form.controls.participants.value);
    if (!participantName || !Number.isInteger(participants) || participants <= 0) return;

    this.saving.set(true);
    // Refresh reservations immediately before the POST to avoid relying on stale UI state.
    this.reservationService.getAll().subscribe({
      next: reservations => {
        const alreadyReserved = reservations
          .filter(item => item.outdoorCenterId === center.id)
          .reduce((total, item) => total + Number(item.participants || 0), 0);
        if (participants > center.capacity - alreadyReserved) {
          this.capacityError.set(true);
          this.saving.set(false);
          return;
        }
        const reservation: ReservationEntity = {
          outdoorCenterId: center.id,
          activityType: this.form.controls.activityType.value as ActivityType,
          participantName,
          participants
        };
        this.reservationService.create(reservation).subscribe({
          next: () => { this.saving.set(false); void this.router.navigate(['/home']); },
          error: () => { this.serverError.set(true); this.saving.set(false); }
        });
      },
      error: () => { this.serverError.set(true); this.saving.set(false); }
    });
  }

  cancel(): void { void this.router.navigate(['/home']); }
}
