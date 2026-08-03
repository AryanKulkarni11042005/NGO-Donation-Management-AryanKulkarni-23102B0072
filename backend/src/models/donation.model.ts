export type PaymentStatus = "SUCCESS" | "FAILED";
export type DonationStatus = "pending" | "verified" | "rejected";

export interface Donation {
  id: number;
  campaign_id: number;
  donor_name: string;
  donor_email: string;
  donor_phone: string;
  amount: string;
  transaction_id: string;
  payment_status: PaymentStatus;
  status: DonationStatus;
  created_at: Date;
}
