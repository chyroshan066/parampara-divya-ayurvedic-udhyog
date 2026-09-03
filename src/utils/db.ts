import { neon } from "@neondatabase/serverless";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL is not set. Add your Neon connection string to .env (see .env.example)."
  );
}

// Tagged-template SQL client. Safe to import in both Node route handlers
// and Edge middleware/runtime code.
export const sql = neon(process.env.DATABASE_URL);