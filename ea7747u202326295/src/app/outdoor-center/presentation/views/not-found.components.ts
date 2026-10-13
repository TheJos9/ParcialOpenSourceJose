import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [TranslateModule],
  template: `
    <section class="not-found">
      <div class="not-found-code">404</div>
      <h1>Page not found</h1>
      <p>{{ 'not-found' | translate }} <code>{{ currentUrl }}</code></p>
      <button class="button-primary" (click)="goHome()">{{ 'back-home' | translate }}</button>
    </section>
  `
})
export class NotFoundComponent {
  currentUrl = this.location.path() || window.location.pathname;
  constructor(private location: Location, private router: Router) {}
  goHome(): void { void this.router.navigate(['/home']); }
}
