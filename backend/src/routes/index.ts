import { Router } from "express";
import { pool } from "../config/db";
import authRoutes from "./auth.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

router.use("/auth", authRoutes);

router.get("/db-check", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "connected" });
  } catch (err) {
    res.status(500).json({ status: "error", message: (err as Error).message });
  }
});

export default router;
