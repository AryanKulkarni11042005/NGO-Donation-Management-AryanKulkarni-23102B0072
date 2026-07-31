import { Router } from "express";
import { loginHandler, profileHandler } from "../controllers/auth.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

router.post("/login", loginHandler);
router.get("/profile", authMiddleware, profileHandler);

export default router;
