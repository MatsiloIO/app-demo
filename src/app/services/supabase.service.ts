import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root' // service singleton
})
export class SupabaseService {
  private static supabase: SupabaseClient

  constructor() {
    if (!SupabaseService.supabase)
      SupabaseService.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, { auth: { persistSession: true, autoRefreshToken: true } })
  }

  get client(): SupabaseClient {
    return SupabaseService.supabase
  }
}
