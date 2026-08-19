import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { pool } from "../config/db";
import { AppError } from "../middleware/error.middleware";
import { AuthUser, User } from "../models/user.model";

export async function login(email: string, password: string): Promise<{ token: string; user: AuthUser }> {
  const result = await pool.query<User>("SELECT * FROM users WHERE email = $1", [email]);
  const user = result.rows[0];

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  const authUser: AuthUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  const token = jwt.sign(authUser, env.jwt.secret, { expiresIn: env.jwt.expiresIn } as jwt.SignOptions);

  return { token, user: authUser };
}
