import { pool } from "../config/db";
import { AppError } from "../middleware/error.middleware";
import { generateTransactionId } from "../utils/idGenerator.util";
import { Donation, DonationStatus } from "../models/donation.model";

export interface DonationInput {
  campaign_id: number;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: number;
}

export async function createDonation(input: DonationInput): Promise<Donation> {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const campaignResult = await client.query("SELECT id FROM campaigns WHERE id = $1", [input.campaign_id]);
    if (campaignResult.rows.length === 0) {
      throw new AppError("Campaign not found", 404);
    }

    const transactionId = generateTransactionId();

    const donationResult = await client.query<Donation>(
      `INSERT INTO donations (campaign_id, donor_name, donor_email, donor_phone, amount, transaction_id, payment_status, status)
       VALUES ($1, $2, $3, $4, $5, $6, 'SUCCESS', 'pending')
       RETURNING *`,
      [input.campaign_id, input.donor_name, input.donor_email, input.donor_phone, input.amount, transactionId]
    );

    await client.query(
      "UPDATE campaigns SET current_amount = current_amount + $1, updated_at = NOW() WHERE id = $2",
      [input.amount, input.campaign_id]
    );

    await client.query("COMMIT");
    return donationResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

export async function listDonations(options: {
  search?: string;
  status?: DonationStatus;
}): Promise<Donation[]> {
  const conditions: string[] = [];
  const values: unknown[] = [];

  if (options.status) {
    values.push(options.status);
    conditions.push(`status = $${values.length}`);
  }

  if (options.search) {
    values.push(`%${options.search}%`);
    conditions.push(`(donor_name ILIKE $${values.length} OR donor_email ILIKE $${values.length} OR transaction_id ILIKE $${values.length})`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const result = await pool.query<Donation>(
    `SELECT * FROM donations ${where} ORDER BY created_at DESC`,
    values
  );
  return result.rows;
}

export async function getDonationById(id: number): Promise<Donation> {
  const result = await pool.query<Donation>("SELECT * FROM donations WHERE id = $1", [id]);
  const donation = result.rows[0];

  if (!donation) {
    throw new AppError("Donation not found", 404);
  }

  return donation;
}

export async function updateDonationStatus(id: number, status: DonationStatus): Promise<Donation> {
  await getDonationById(id);

  const result = await pool.query<Donation>(
    "UPDATE donations SET status = $1 WHERE id = $2 RETURNING *",
    [status, id]
  );
  return result.rows[0];
}
