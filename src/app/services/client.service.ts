import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Client } from '../models/client.model';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private table = 'clients'
  supabaseService = inject(SupabaseService)

  async create(client: Partial<Client>): Promise<Client | null> {
    const { data, error } = await this.supabaseService.client.from(this.table)
      .insert([client])
      .select()
      .single()
    if (error)
      throw error
    return data
  }

  async update(id: string, client: Partial<Client>): Promise<Client | null> {
    const { data, error } = await this.supabaseService.client.from(this.table)
      .update([client])
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return data
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabaseService.client.from(this.table)
      .delete()
      .eq('id', id)
    if (error) throw error
  }

  async all(page: number = 1, pageSize: number = 5, search?: string): Promise<{ data: Client[], count: number }> {
    const from = (page - 1) * pageSize
    const to = from + pageSize - 1
    let query = this.supabaseService.client.from(this.table)
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false })

    if (search)
      query = query.or(`name.ilike.%${search}%, email.ilike.%${search}%`)

    const { data, error, count } = await query
    if (error) throw error
    return { data: data ?? [], count: count ?? 0 }
  }
}
