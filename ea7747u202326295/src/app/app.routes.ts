import { Routes } from '@angular/router';
import { HomeComponent } from './outdoor-center/presentation/views/home.component';
import { NewReservationComponent } from './outdoor-center/presentation/views/new-reservation.component';
import { NotFoundComponent } from './outdoor-center/presentation/views/not-found.component';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'home' },
  { path: 'home', component: HomeComponent },
  { path: 'reservations/new', component: NewReservationComponent },
  { path: '**', component: NotFoundComponent }
];
