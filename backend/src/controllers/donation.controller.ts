import { NextFunction, Request, Response } from "express";
import { AppError } from "../middleware/error.middleware";
import * as donationService from "../services/donation.service";
import { DonationStatus } from "../models/donation.model";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_STATUSES: DonationStatus[] = ["pending", "verified", "rejected"];

function validateDonationInput(body: any) {
  const { campaign_id, donor_name, donor_email, donor_phone, amount } = body;

  if (!campaign_id || !donor_name || !donor_email || !donor_phone || !amount) {
    throw new AppError("campaign_id, donor_name, donor_email, donor_phone, and amount are required", 400);
  }

  if (!EMAIL_REGEX.test(donor_email)) {
    throw new AppError("A valid email address is required", 400);
  }

  if (Number(amount) <= 0) {
    throw new AppError("amount must be greater than 0", 400);
  }
}

export async function createDonationHandler(req: Request, res: Response, next: NextFunction) {
  try {
    validateDonationInput(req.body);
    const donation = await donationService.createDonation(req.body);
    res.status(201).json({ donation });
  } catch (err) {
    next(err);
  }
}

export async function listDonationsHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const search = typeof req.query.search === "string" ? req.query.search : undefined;
    const status = typeof req.query.status === "string" ? (req.query.status as DonationStatus) : undefined;

    if (status && !VALID_STATUSES.includes(status)) {
      throw new AppError(`status must be one of: ${VALID_STATUSES.join(", ")}`, 400);
    }

    const donations = await donationService.listDonations({ search, status });
    res.json({ donations });
  } catch (err) {
    next(err);
  }
}

export async function updateDonationStatusHandler(req: Request, res: Response, next: NextFunction) {
  try {
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      throw new AppError(`status must be one of: ${VALID_STATUSES.join(", ")}`, 400);
    }

    const donation = await donationService.updateDonationStatus(Number(req.params.id), status);
    res.json({ donation });
  } catch (err) {
    next(err);
  }
}
