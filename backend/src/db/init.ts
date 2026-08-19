import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";
import { pool } from "../config/db";

const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@ngo.org";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "Admin@123";

const VOLUNTEER_NAME = process.env.VOLUNTEER_NAME || "Volunteer";
const VOLUNTEER_EMAIL = process.env.VOLUNTEER_EMAIL || "volunteer@ngo.org";
const VOLUNTEER_PASSWORD = process.env.VOLUNTEER_PASSWORD || "Volunteer@123";

async function seedUser(name: string, email: string, password: string, role: "admin" | "volunteer") {
  const existing = await pool.query("SELECT id FROM users WHERE email = $1", [email]);

  if (existing.rows.length === 0) {
    const passwordHash = await bcrypt.hash(password, 10);
    await pool.query(
      "INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4)",
      [name, email, passwordHash, role]
    );
    console.log(`Seeded ${role} user: ${email}`);
  } else {
    console.log(`${role} user already exists, skipping seed.`);
  }
}

async function run() {
  const schema = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf-8");
  await pool.query(schema);
  console.log("Schema created.");

  await seedUser(ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, "admin");
  await seedUser(VOLUNTEER_NAME, VOLUNTEER_EMAIL, VOLUNTEER_PASSWORD, "volunteer");

  await pool.end();
}

run().catch((err) => {
  console.error("Database initialization failed:", err);
  process.exit(1);
});
