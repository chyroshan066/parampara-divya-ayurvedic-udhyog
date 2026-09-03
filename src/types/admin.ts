export interface Admin {
  id: string;
  email: string;
  password_hash: string;
  name: string | null;
  created_at: string;
}

export interface AdminSessionPayload {
  sub: string; // admin id
  email: string;
  name: string | null;
}