import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <div class="max-w-2xl mx-auto my-5">
      <router-outlet />
    </div>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('app-demo')
}
