export interface Order {
  id: string;
  customer_id: string;
  status: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  product_img: string | null;
  unit_price: string; // numeric columns come back as strings from pg
  quantity: number;
  created_at: string;
}

/** Shape of a single item as sent from the client when placing an order. */
export interface OrderItemInput {
  productName: string;
  productImg?: string | null;
  unitPrice: number;
  quantity: number;
}

/** An order with its line items nested — what /orders reads and renders. */
export interface OrderWithItems extends Order {
  items: OrderItem[];
}