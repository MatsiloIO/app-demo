import { inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export class GenericService<T> {
  private supabase = inject(SupabaseService);

  // pas d'@Injectable params ici → juste des propriétés privées
  constructor(
    private table: string,
    private searchableFields: string[] = []
  ) { }

  async create(data: Partial<T>): Promise<T | null> {
    const { data: res, error } = await this.supabase.client
      .from(this.table)
      .insert([data])
      .select()
      .single();
    if (error) throw error;
    return res as T;
  }

  async update(id: string, data: Partial<T>): Promise<T | null> {
    const { data: res, error } = await this.supabase.client
      .from(this.table)
      .update(data)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return res as T;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.client
      .from(this.table)
      .delete()
      .eq('id', id);
    if (error) throw error;
  }

  async allWithoutPagination(): Promise<T[]> {
    const { data, error } = await this.supabase.client.from(this.table).select('*');
    if (error) throw error
    return data
  }

  async all(page = 1, pageSize = 10, search = ''): Promise<{ data: T[]; count: number }> {
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = this.supabase.client
      .from(this.table)
      .select('*', { count: 'exact' })
      .range(from, to)
      .order('created_at', { ascending: false });

    if (search && this.searchableFields.length > 0) {
      const filters = this.searchableFields.map(f => `${f}.ilike.%${search}%`).join(',');
      query = query.or(filters);
    }

    const { data, count, error } = await query;
    if (error) throw error;
    return { data: (data ?? []) as T[], count: count ?? 0 };
  }
}
