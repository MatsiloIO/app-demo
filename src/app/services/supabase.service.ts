import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient
  // signal pour stocker des données reactives
  public data = signal<any[]>([]);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey)
  }

  async fetchData(table: string) {
    const { data, error } = await this.supabase.from(table).select('*')
    if (error)
      throw error
    this.data.set(data || [])
  }

  getClient() {
    return this.supabase
  }
}
