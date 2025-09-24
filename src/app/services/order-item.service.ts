import { inject, Injectable } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { OrderItem } from '../models/order-item.model';

@Injectable({
  providedIn: 'root'
})
export class OrderItemService {
  private table = 'order-items'
  supabaseService = inject(SupabaseService)

  async addItem(item: Partial<OrderItem>): Promise<OrderItem | null> {
    const { data, error } = await this.supabaseService.client.from(this.table)
      .insert([item])
      .select('*')
      .single()

    if (error) throw error
    return data
  }

  async getItemsByOrder(orderId: string): Promise<OrderItem[]> {
    const { data, error } = await this.supabaseService.client
      .from(this.table)
      .select(`
        *,
        product:products(id, name, price)
      `)
      .eq('order_id', orderId)
    if (error)
      throw error
    return data ?? []
  }

  async updateItemQuantity(itemId: string, quantity: number): Promise<OrderItem | null> {
    const { data, error } = await this.supabaseService.client
      .from('order_items')
      .update({ quantity })
      .eq('id', itemId)
      .select('*, product:products(id, name, price)')
      .single();

    if (error) throw error;
    return data;
  }

  async deleteItem(itemId: string): Promise<void> {
    const { error } = await this.supabaseService.client
      .from('order_items')
      .delete()
      .eq('id', itemId);

    if (error) throw error;
  }
}
