import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Session } from '@supabase/supabase-js';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  template: `
    <div class="flex h-screen">
        <!-- Sidebar -->
        <div class="fixed left-0 top-0 h-screen bg-base-200 transition-all duration-300 flex flex-col z-50" [class.w-64]="isOpen" [class.w-15]="!isOpen" [class.items-center]="!isOpen" >

          <!-- Header -->
          <div class="flex items-center justify-between p-4">
            <span class="font-bold text-lg" [class.hidden]="!isOpen">MatsApp</span>
            <button class="btn btn-ghost btn-sm" (click)="toggleSidebar()">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" [class.hidden]="!isOpen"
                viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" [class.hidden]="isOpen"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
          </div>

          <!-- Menu -->
          <ul class="menu flex-1 gap-3" [class.w-full]="isOpen">

            <!-- Home -->
            <li [class.tooltip]="!isOpen" [class.tooltip-sm]="!isOpen" [class.tooltip-right]="!isOpen" data-tip="Accueil" class="tooltip">
              <a 
                routerLink="/"
                class="flex items-center transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-green-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 12 8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                <span [class.hidden]="!isOpen">Accueil</span>
              </a>
            </li>

            <!-- Clients -->
            <li [class.tooltip]="!isOpen" [class.tooltip-sm]="!isOpen" [class.tooltip-right]="!isOpen" data-tip="Clients" [class.hidden]="!session">
              <a 
                routerLink="/clients"
                class="flex items-center transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-green-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                </svg>
                <span [class.hidden]="!isOpen">Clients</span>
              </a>
            </li>

            <!-- Produits -->
            <li [class.tooltip]="!isOpen" [class.tooltip-sm]="!isOpen" [class.tooltip-right]="!isOpen" data-tip="Produits" [class.hidden]="!session">
              <a 
                routerLink="/products"
                class="flex items-center transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="size-6 text-green-500" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M20 13V9a1 1 0 00-1-1h-3V4a1 1 0 00-1-1H9a1 1 0 00-1 1v4H5a1 1 0 00-1 1v4h16zM4 15h16v2a1 1 0 01-1 1H5a1 1 0 01-1-1v-2z" />
                </svg>
                <span [class.hidden]="!isOpen">Produits</span>
              </a>
            </li>

            <!-- category -->
            <li [class.tooltip]="!isOpen" [class.tooltip-sm]="!isOpen" [class.tooltip-right]="!isOpen" data-tip="Categories" [class.hidden]="!session">
              <a 
                routerLink="/category"
                class="flex items-center transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-green-500">
                <path fill-rule="evenodd" d="M19.902 4.098a3.75 3.75 0 0 0-5.304 0l-4.5 4.5a3.75 3.75 0 0 0 1.035 6.037.75.75 0 0 1-.646 1.353 5.25 5.25 0 0 1-1.449-8.45l4.5-4.5a5.25 5.25 0 1 1 7.424 7.424l-1.757 1.757a.75.75 0 1 1-1.06-1.06l1.757-1.757a3.75 3.75 0 0 0 0-5.304Zm-7.389 4.267a.75.75 0 0 1 1-.353 5.25 5.25 0 0 1 1.449 8.45l-4.5 4.5a5.25 5.25 0 1 1-7.424-7.424l1.757-1.757a.75.75 0 1 1 1.06 1.06l-1.757 1.757a3.75 3.75 0 1 0 5.304 5.304l4.5-4.5a3.75 3.75 0 0 0-1.035-6.037.75.75 0 0 1-.354-1Z" clip-rule="evenodd" />
              </svg>

                <span [class.hidden]="!isOpen">Categories</span>
              </a>
            </li>

            <!-- Orders -->
            <li [class.tooltip]="!isOpen" [class.tooltip-sm]="!isOpen" [class.tooltip-right]="!isOpen" data-tip="Orders" [class.hidden]="!session">
              <a 
                routerLink="/orders"
                class="flex items-center transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-green-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 11.625h4.5m-4.5 2.25h4.5m2.121 1.527c-1.171 1.464-3.07 1.464-4.242 0-1.172-1.465-1.172-3.84 0-5.304 1.171-1.464 3.07-1.464 4.242 0M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                </svg>
                <span [class.hidden]="!isOpen">Orders</span>
              </a>
            </li>

          <!-- About -->
            <li [class.tooltip]="!isOpen" [class.tooltip-sm]="!isOpen" [class.tooltip-right]="!isOpen" data-tip="A propos de">
              <a 
                routerLink="/about"
                class="flex items-center transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-green-500">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                </svg>
                <span [class.hidden]="!isOpen">A propos</span>
              </a>
            </li>
          </ul>
          <!-- Footer -->
          <div class="p-3 text-center">
            @if(!session){
              <button class="btn btn-ghost btn-xs" (click)="goToLogin()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-success">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0 1 19.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 0 0 4.5 10.5a7.464 7.464 0 0 1-1.15 3.993m1.989 3.559A11.209 11.209 0 0 0 8.25 10.5a3.75 3.75 0 1 1 7.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 0 1-3.6 9.75m6.633-4.596a18.666 18.666 0 0 1-2.485 5.33" />
                </svg>
                <span [class.hidden]="!isOpen">Log In</span>
              </button>
            }@else {
              <button class="btn btn-ghost btn-xs" (click)="onLogout()">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-4 text-error">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" />
                </svg>
                <span [class.hidden]="!isOpen">Log Out</span>
              </button>
            }

          </div>
        </div>

        <!-- Contenu principal -->
        <div class="flex-1 p-6 bg-base-100 ml-15" [class.ml-64]="isOpen" [class.ml-15]="!isOpen">
          <router-outlet/>
        </div>
    </div>
  `,
  styles: `.tooltip-sm[data-tip]::before {font-size:0.85rem;padding:0.50rem;color:green}`,
})
export class App {
  isOpen = false

  session: Session | null = null

  authService = inject(AuthService)
  router = inject(Router)

  async ngOnInit(): Promise<void> {
    this.session = await this.authService.getSession()
    // abonnement aux changements de session (login/logout)
    this.authService['supabaseService'].client.auth.onAuthStateChange((_event, session) => {
      this.session = session
    })
  }

  async onLogout() {
    await this.authService.signOut()
    this.router.navigate(['/login'])
  }

  goToLogin() {
    this.router.navigate(['/login'])
  }

  toggleSidebar() {
    this.isOpen = !this.isOpen
  }
}
