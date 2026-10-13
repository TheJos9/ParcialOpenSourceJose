import { Component, OnInit, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { OutdoorCenterService } from '../../application/outdoor-center.service';
import { ReservationService } from '../../../shared/application/reservation.service';
import { OutdoorCenterEntity } from '../../domain/entities/outdoor-center.entity';
import { ReservationEntity } from '../../../shared/domain/entities/reservation.entity';
import { OutdoorCenterSummaryComponent } from '../components/outdoor-center-summary.component';

@Component({
  standalone: true,
  imports: [TranslateModule, OutdoorCenterSummaryComponent],
  template: `
    <section class="page-heading">
      <p class="eyebrow">TRAILGO / DASHBOARD</p>
      <h1>{{ 'home' | translate }}</h1>
      <p>{{ 'smart-subtitle' | translate }}</p>
    </section>
    @if (error()) { <div class="error-banner">{{ error() }}</div> }
    <section class="section-block">
      <div class="section-heading"><h2>{{ 'my-outdoor-centers' | translate }}</h2><span>{{ centers().length }} centers</span></div>
      <div class="centers-grid">
        @for (center of centers(); track center.id) {
          <app-outdoor-center-summary [center]="center" [reservations]="reservations()" />
        }
      </div>
    </section>
  `
})
export class HomeComponent implements OnInit {
  centers = signal<OutdoorCenterEntity[]>([]);
  reservations = signal<ReservationEntity[]>([]);
  error = signal('');
  constructor(private centerService: OutdoorCenterService, private reservationService: ReservationService) {}
  ngOnInit(): void {
    this.centerService.getAll().subscribe({
      next: centers => this.centers.set(centers),
      error: () => this.error.set('Could not load outdoor centers. Start the JSON server on port 3000.')
    });
    this.reservationService.getAll().subscribe({
      next: reservations => this.reservations.set(reservations),
      error: () => this.error.set('Could not load reservations. Start the JSON server on port 3000.')
    });
  }
}
