import { Router } from "express";
import {
  createCampaignHandler,
  getCampaignHandler,
  listCampaignsHandler,
  updateCampaignHandler,
} from "../controllers/campaign.controller";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const router = Router();

router.get("/", optionalAuthMiddleware, listCampaignsHandler);
router.get("/:id", getCampaignHandler);
router.post("/", authMiddleware, requireAdmin, createCampaignHandler);
router.put("/:id", authMiddleware, requireAdmin, updateCampaignHandler);

export default router;
