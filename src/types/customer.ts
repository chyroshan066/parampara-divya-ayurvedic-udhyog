export interface Customer {
  id: string;
  email: string;
  password_hash: string;
  first_name: string;
  last_name: string;
  phone: string | null;
  reset_token_hash: string | null;
  reset_token_expires_at: string | null;
  created_at: string;
}

export interface CustomerSessionPayload {
  sub: string; // customer id
  email: string;
  firstName: string;
  lastName: string;
}
