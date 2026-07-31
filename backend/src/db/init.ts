import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { pool } from "../config/db";

const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ngo.org";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

async function run() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await pool.query(schema);
  console.log("Schema created.");

  const existingAdmin = await pool.query("SELECT id FROM users WHERE email = $1", [ADMIN_EMAIL]);

  if (existingAdmin.rows.length === 0) {
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, 'admin')",
      [ADMIN_NAME, ADMIN_EMAIL, passwordHash]
    );
    console.log(`Seeded admin user: ${ADMIN_EMAIL}`);
  } else {
    console.log("Admin user already exists, skipping seed.");
  }

  await pool.end();
}

run().catch((err) => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});
