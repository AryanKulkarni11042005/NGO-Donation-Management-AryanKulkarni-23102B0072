import { NextFunction, Request, Response } from "express";
import { AppError } from "../middleware/error.middleware";
import * as campaignService from "../services/campaign.service";

const VALID_STATUSES = ["active", "closed", "draft"];

function validateCampaignInput(body: any, isUpdate: boolean) {
  const { title, target_amount, start_date, end_date, status } = body;

  if (!isUpdate) {
    if (!title || !target_amount || !start_date || !end_date) {
      throw new AppError("title, target_amount, start_date, and end_date are required", 400);
    }
  }

  if (target_amount !== undefined && Number(target_amount) <= 0) {
    throw new AppError("target_amount must be greater than 0", 400);
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    throw new AppError(`status must be one of: ${VALID_STATUSES.join(", ")}`, 400);
  }

  if (start_date && end_date && new Date(start_date) > new Date(end_date)) {
    throw new AppError("start_date must be before end_date", 400);
  }
}

export async function listCampaignsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const isAdmin = req.user?.role === "admin" || req.user?.role === "volunteer";
    const search = typeof req.query.search === "string" ? req.query.search : undefined;

    const campaigns = await campaignService.listCampaigns({
      search,
      publicOnly: !isAdmin,
    });
    res.json({ campaigns });
  } catch (err) {
    next(err);
  }
}

export async function getCampaignHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const campaign = await campaignService.getCampaignById(Number(req.params.id));
    res.json({ campaign });
  } catch (err) {
    next(err);
  }
}

export async function createCampaignHandler(req: Request, res: Response, next: NextFunction) {
  try {
    validateCampaignInput(req.body, false);
    const campaign = await campaignService.createCampaign(req.body, req.user!.id);
    res.status(201).json({ campaign });
  } catch (err) {
    next(err);
  }
}

export async function updateCampaignHandler(req: Request, res: Response, next: NextFunction) {
  try {
    validateCampaignInput(req.body, true);
    const campaign = await campaignService.updateCampaign(Number(req.params.id), req.body);
    res.json({ campaign });
  } catch (err) {
    next(err);
  }
}
