import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || "5000",
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: Number(process.env.DB_PORT) || 5433,
    name: process.env.DB_NAME || "ngo-donation-portal",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "dev_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  },
  ngoName: process.env.NGO_NAME || "NGO",
};
