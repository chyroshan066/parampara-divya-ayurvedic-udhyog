export interface CartItem {
  id: string;
  customer_id: string;
  product_name: string;
  product_img: string | null;
  unit_price: string; // numeric columns come back as strings from pg
  quantity: number;
  created_at: string;
  updated_at: string;
}

/** Shape sent from the client when adding a product to the cart. */
export interface AddCartItemInput {
  productName: string;
  productImg?: string | null;
  unitPrice: number;
  quantity: number;
}