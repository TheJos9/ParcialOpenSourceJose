import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {Layout} from './shared/presentation/components/layout/layout';

@Component({
  selector: 'app-root',
  imports: [Layout],
  templateUrl: './app.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './app.css'
})
/**
 * Root component hosting the shared layout shell.
 */
export class App {
  /** Application title signal used by templates and tests. */
  protected readonly title = signal('catch-up');
}
