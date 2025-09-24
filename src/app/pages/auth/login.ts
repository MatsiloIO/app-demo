import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  imports: [FormsModule],
  template: `
    <form (ngSubmit)="onLogin()" class="flex flex-col items-center gap-5 justify-center">
      <img src="assets/images/authentication.png" alt="secret" class="w-15"/>
      <label class="input">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <rect width="20" height="16" x="2" y="4" rx="2"></rect>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
          </g>
        </svg>
        <input type="email" name="email" [(ngModel)]="email" placeholder="Adresse email" required autocomplete="off" />
      </label>
      <label class="input">
        <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2.5"
            fill="none"
            stroke="currentColor"
          >
            <path
              d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"
            ></path>
            <circle cx="16.5" cy="7.5" r=".5" fill="currentColor"></circle>
          </g>
        </svg>
        <input
          type="password"
          name="password"
          required
          placeholder="Mot de passe"
          [(ngModel)]="password"
        />
      </label>
      <button type="submit" class="btn btn-primary">Se connecter</button>
      @if (error) {
        <div role="alert" class="alert alert-error">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{error}}</span>
        </div>
      }
    </form>
  `,
  styles: ``
})
export default class Login {

  email: string = ''
  password: string = ''
  error: string = ''

  //constructor(private authService: AuthService, private router: Router) { }
  authService = inject(AuthService)
  router = inject(Router)
  async onLogin() {
    this.error = ''
    const { error } = await this.authService.signIn(this.email, this.password)
    if (error) {
      this.error = error.message
    }
    else {
      this.router.navigate(['/'])
    }
  }

}
