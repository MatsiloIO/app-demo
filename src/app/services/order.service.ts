import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private table = 'orders'
  supabaseService = inject(SupabaseService)

  async addOrder(order: Partial<Order>): Promise<Order[] | null> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .insert([order])
      .select()
      .single()

    if (error)
      throw error
    return data
  }

  async getOrders(): Promise<Order[]> {
    const { data, error } = await this.supabaseService.client.from(this.table)
      .select(`
        *,
        client:clients( id, name, email ),
        items:order_items(
          id,
          quantity,
          product:products(id,name,price)
        )
      `);
    if (error) throw error
    return data ?? []
  }

  async getOrderById(id: string): Promise<Order | null> {
    const { data, error } = await this.supabaseService.client.from(this.table)
      .select(`
        *,
        client:clients(id,name,email),
        items:order_items(
          *,
          product:products(id,name,price)
        )
      `)
      .eq('id', id)
      .single()
    if (error) throw error
    return data
  }

  async deleteOrder(id: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('orders')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
}
