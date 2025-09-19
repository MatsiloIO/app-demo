import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menubar } from "./shared/menubar/menubar";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menubar],
  template: `
    <app-menubar/>
    <div class="max-w-2xl mx-auto my-5">
      <router-outlet />
    </div>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('app-demo')
}
