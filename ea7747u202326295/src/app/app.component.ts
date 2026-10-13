import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, MatToolbarModule, MatSidenavModule, MatListModule, MatButtonModule, TranslateModule],
  template: `
    <mat-toolbar class="topbar">
      <button mat-button class="menu-button" (click)="sidenav.toggle()" aria-label="Toggle navigation">☰</button>
      <img src="/assets/images/trailgo-logo.svg" alt="TrailGo" class="logo">
      <span class="app-title">{{ 'app-title' | translate }}</span>
      <span class="spacer"></span>
      <button mat-button (click)="setLanguage('en')" [class.active-lang]="language() === 'en'">EN</button>
      <button mat-button (click)="setLanguage('es')" [class.active-lang]="language() === 'es'">ES</button>
    </mat-toolbar>
    <mat-sidenav-container class="layout">
      <mat-sidenav #sidenav mode="side" opened class="sidebar">
        <div class="nav-caption">TRAILGO</div>
        <a mat-list-item routerLink="/home" routerLinkActive="selected" (click)="closeOnMobile(sidenav)">{{ 'home' | translate }}</a>
        <a mat-list-item routerLink="/reservations/new" routerLinkActive="selected" (click)="closeOnMobile(sidenav)">{{ 'new-reservation' | translate }}</a>
      </mat-sidenav>
      <mat-sidenav-content><main class="content"><router-outlet /></main></mat-sidenav-content>
    </mat-sidenav-container>
  `
})
export class AppComponent {
  language = signal('en');
  constructor(private translate: TranslateService) { this.translate.setDefaultLang('en'); this.translate.use('en'); }
  setLanguage(language: string): void { this.language.set(language); this.translate.use(language); }
  closeOnMobile(sidenav: { close: () => void }): void { if (window.innerWidth < 760) sidenav.close(); }
}
