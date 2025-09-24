import { Client } from "./client.model"
import { OrderItem } from "./order-item.model"

export interface Order {
    id?: string,
    client_id: string,
    created_at?: string
    client?: Client // relation 1-1
    items?: OrderItem[] // relation 1-n
}