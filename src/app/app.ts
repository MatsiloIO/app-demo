import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div [class.w-64]="isOpen" [class.w-20]="!isOpen" class="bg-base-200 transition-all duration-300 flex flex-col">

          <!-- Header -->
          <div class="flex items-center justify-between p-4">
            @if(isOpen){<span class="font-bold text-lg">MonApp</span>}
            
            <button class="btn btn-ghost btn-sm" (click)="toggleSidebar()">
              @if(isOpen){
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              @if(!isOpen){
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              }
            </button>
          </div>

          <!-- Menu -->
          <ul class="menu flex-1">
  <!-- Clients -->
  <li>
    <a 
      routerLink="/clients"
      class="flex items-center transition-all duration-300"
      [class.justify-start]="isOpen"
      [class.justify-center]="!isOpen"
      [class.gap-2]="isOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M5.121 17.804A6.977 6.977 0 0112 15c1.933 0 3.683.784 4.879 2.047M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
      <span [class.hidden]="!isOpen">Clients</span>
    </a>
  </li>

  <!-- Produits -->
  <li>
    <a 
      routerLink="/products"
      class="flex items-center transition-all duration-300"
      [class.justify-start]="isOpen"
      [class.justify-center]="!isOpen"
      [class.gap-2]="isOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M20 13V9a1 1 0 00-1-1h-3V4a1 1 0 00-1-1H9a1 1 0 00-1 1v4H5a1 1 0 00-1 1v4h16zM4 15h16v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
      </svg>
      <span [class.hidden]="!isOpen">Produits</span>
    </a>
  </li>

  <!-- Orders -->
  <li>
    <a 
      routerLink="/orders"
      class="flex items-center transition-all duration-300"
      [class.justify-start]="isOpen"
      [class.justify-center]="!isOpen"
      [class.gap-2]="isOpen"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 12h6m2 4H7a2 2 0 01-2-2V7a2 2 0 012-2h10a2 2 0 012 2v7a2 2 0 01-2 2z" />
      </svg>
      <span [class.hidden]="!isOpen">Orders</span>
    </a>
  </li>
</ul>




          <!-- Footer -->
          <div class="p-4 border-t">
            <button class="btn btn-outline btn-sm w-full">
              @if(isOpen){
                <span>Logout</span>
              }
            </button>
          </div>
        </div>

        <!-- Contenu principal -->
        <div class="flex-1 p-6 bg-base-100">
          <router-outlet/>
        </div>
    </div>
  `,
  styles: [],
})
export class App {
  protected readonly title = signal('app-demo')

  isOpen = true

  toggleSidebar() {
    this.isOpen = !this.isOpen
  }
}
