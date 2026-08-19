import { pool } from "../config/db";
import { AppError } from "../middleware/error.middleware";
import { Campaign, CampaignStatus } from "../models/campaign.model";

export interface CampaignInput {
  title: string;
  description?: string;
  target_amount: number;
  status?: CampaignStatus;
  start_date: string;
  end_date: string;
}

export async function listCampaigns(options: { search?: string; publicOnly?: boolean }): Promise<Campaign[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (options.publicOnly) {
    conditions.push("status = 'active'");
  }

  if (options.search) {
    values.push(`%${options.search}%`);
    conditions.push(`title ILIKE $${values.length}`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await pool.query<Campaign>(
    `SELECT * FROM campaigns ${where} ORDER BY created_at DESC`,
    values
  );
  return result.rows;
}

export async function getCampaignById(id: number): Promise<Campaign> {
  const result = await pool.query<Campaign>("SELECT * FROM campaigns WHERE id = $1", [id]);
  const campaign = result.rows[0];

  if (!campaign) {
    throw new AppError("Campaign not found", 404);
  }

  return campaign;
}

export async function createCampaign(input: CampaignInput, createdBy: number): Promise<Campaign> {
  const result = await pool.query<Campaign>(
    `INSERT INTO campaigns (title, description, target_amount, status, start_date, end_date, created_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [
      input.title,
      input.description ?? null,
      input.target_amount,
      input.status ?? "active",
      input.start_date,
      input.end_date,
      createdBy,
    ]
  );
  return result.rows[0];
}

export async function updateCampaign(id: number, input: Partial<CampaignInput>): Promise<Campaign> {
  await getCampaignById(id);

  const fields: string[] = [];
  const values: unknown[] = [];

  for (const [key, value] of Object.entries(input)) {
    if (value !== undefined) {
      values.push(value);
      fields.push(`${key} = $${values.length}`);
    }
  }

  if (fields.length === 0) {
    throw new AppError("No fields provided to update", 400);
  }

  fields.push("updated_at = NOW()");
  values.push(id);

  const result = await pool.query<Campaign>(
    `UPDATE campaigns SET ${fields.join(", ")} WHERE id = $${values.length} RETURNING *`,
    values
  );
  return result.rows[0];
}
