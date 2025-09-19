import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Session } from '@supabase/supabase-js';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-menubar',
  imports: [],
  template: `
  <div class="navbar bg-base-200 px-4 shadow-md">
    <!-- Logo / Icône bidon -->
    <div class="flex-1">
      <a class="btn btn-ghost normal-case text-xl">
        🚀 MonProjet
      </a>
    </div>

    <!-- Boutons -->
    <div class="flex-none gap-2">
      <!-- Si utilisateur non connecté -->
      @if(!session){
        <button class="btn btn-primary" (click)="goToLogin()">
          Connexion
        </button>
      } @else {
         <!-- Si utilisateur connecté -->
        <button class="btn btn-error" (click)="onLogout()">
          Déconnexion
        </button>
      } 
    </div>
  </div>`,
  styles: ``
})
export class Menubar implements OnInit {

  session: Session | null = null

  constructor(private authService: AuthService, private router: Router) { }

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
}
