import { Product } from "./product.model";

export interface OrderItem {
    id?: string,
    order_id: string,
    product_id: string,
    quantity: number,
    product?: Product // relation 1-1
}