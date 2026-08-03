import { pool } from "../config/db";
import { AppError } from "../middleware/error.middleware";
import { generateCertificateCode, generateVerificationId } from "../utils/idGenerator.util";
import { Certificate } from "../models/certificate.model";
import { Donation } from "../models/donation.model";
import { getDonationById } from "./donation.service";

export interface CertificateDetails {
  certificate: Certificate;
  donorName: string;
  campaignTitle: string;
  amount: string;
  transactionId: string;
  donationDate: Date;
}

async function getCampaignTitle(campaignId: number): Promise<string> {
  const result = await pool.query<{ title: string }>("SELECT title FROM campaigns WHERE id = $1", [campaignId]);
  return result.rows[0]?.title ?? "Unknown Campaign";
}

async function buildCertificateDetails(certificate: Certificate, donation: Donation): Promise<CertificateDetails> {
  return {
    certificate,
    donorName: donation.donor_name,
    campaignTitle: await getCampaignTitle(donation.campaign_id),
    amount: donation.amount,
    transactionId: donation.transaction_id,
    donationDate: donation.created_at,
  };
}

async function getOrCreateCertificate(donationId: number): Promise<Certificate> {
  const existing = await pool.query<Certificate>(
    "SELECT * FROM certificates WHERE donation_id = $1",
    [donationId]
  );

  if (existing.rows.length > 0) {
    return existing.rows[0];
  }

  const result = await pool.query<Certificate>(
    `INSERT INTO certificates (donation_id, certificate_code, verification_id)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [donationId, generateCertificateCode(), generateVerificationId()]
  );
  return result.rows[0];
}

export async function getCertificateForDonation(donationId: number): Promise<CertificateDetails> {
  const donation = await getDonationById(donationId);
  const certificate = await getOrCreateCertificate(donationId);
  return buildCertificateDetails(certificate, donation);
}

export async function getCertificateByVerificationId(verificationId: string): Promise<CertificateDetails> {
  const certResult = await pool.query<Certificate>(
    "SELECT * FROM certificates WHERE verification_id = $1",
    [verificationId]
  );
  const certificate = certResult.rows[0];

  if (!certificate) {
    throw new AppError("Certificate not found", 404);
  }

  const donation = await getDonationById(certificate.donation_id);
  return buildCertificateDetails(certificate, donation);
}
