export type UserRole = "admin" | "volunteer";

export interface User {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: UserRole;
  created_at: Date;
}

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}
