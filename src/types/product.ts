export interface Product {
  id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  image_public_id: string | null;
  price: string; // numeric columns come back as strings from pg
  created_at: string;
  updated_at: string;
}