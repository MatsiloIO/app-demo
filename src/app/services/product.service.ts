import { Injectable, signal } from '@angular/core';
import { SupabaseService } from './supabase.service';
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  // signal pour stocker des données reactives
  public products = signal<Product[]>([]);

  constructor(private supabaseService: SupabaseService) { }

  async loadProducts() {
    const { data, error } = await this.supabaseService.client.from("products").select('*').order('created_at', { ascending: false })
    if (error)
      throw error
    this.products.set(data || [])
  }

  async addProduct(name: string, price: number) {
    const { data, error } = await this.supabaseService.client.from('products').insert([{ name, price }]).select()
    if (error)
      throw error
    this.products.update((oldValues) => [data![0] as Product, ...oldValues])
  }
}
