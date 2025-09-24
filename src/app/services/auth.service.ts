import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthResponse, Session } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  supabaseService = inject(SupabaseService)

  async signIn(email: string, password: string): Promise<AuthResponse> {
    return await this.supabaseService.client.auth.signInWithPassword({ email, password })
  }

  async signOut(): Promise<void> {
    await this.supabaseService.client.auth.signOut()
  }

  async getSession(): Promise<Session | null> {
    const { data } = await this.supabaseService.client.auth.getSession()
    return data.session
  }

  async getUser() {
    const { data } = await this.supabaseService.client.auth.getUser()
    return data?.user
  }
}
