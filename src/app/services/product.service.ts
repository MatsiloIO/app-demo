import { Injectable, signal } from '@angular/core';
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { environment } from '../../environment/environment';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private supabase: SupabaseClient
  // signal pour stocker des données reactives
  public products = signal<Product[]>([]);

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, { auth: { persistSession: false } })
  }

  async loadProducts() {
    const { data, error } = await this.supabase.from("products").select('*').order('created_at', { ascending: false })
    if (error)
      throw error
    this.products.set(data || [])
  }

  async addProduct(name: string, price: number) {
    const { data, error } = await this.supabase.from('products').insert([{ name, price }]).select()
    if (error)
      throw error
    this.products.update((old) => [data![0] as Product, ...old])
  }

  getClient() {
    return this.supabase
  }
}
