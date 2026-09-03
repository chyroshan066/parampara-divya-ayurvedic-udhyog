import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";
import readline from "node:readline/promises";
import { stdin, stdout } from "node:process";

async function main() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "DATABASE_URL is not set. Run this with your .env loaded, e.g.\n" +
        "  node --env-file=.env scripts/create-admin.mjs"
    );
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const rl = readline.createInterface({ input: stdin, output: stdout });

  const email = (await rl.question("Admin email: ")).trim().toLowerCase();
  const name = (await rl.question("Admin name (optional): ")).trim() || null;
  const password = await rl.question("Admin password: ");
  rl.close();

  if (!email || !password) {
    console.error("Email and password are required.");
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await sql`
    insert into admins (email, password_hash, name)
    values (${email}, ${passwordHash}, ${name})
    on conflict (email) do update
      set password_hash = excluded.password_hash,
          name = excluded.name
  `;

  console.log(`Admin account ready for ${email}.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});