import { pool } from "../config/db";

export interface DashboardTotals {
  totalDonations: number;
  totalDonors: number;
  activeCampaigns: number;
  pendingDonations: number;
}

export interface RecentDonation {
  id: number;
  donor_name: string;
  campaign_title: string;
  amount: string;
  status: string;
  created_at: Date;
}

export interface RecentCampaign {
  id: number;
  title: string;
  target_amount: string;
  current_amount: string;
  status: string;
}

export async function getDashboardData() {
  const [totalsResult, recentDonationsResult, recentCampaignsResult] = await Promise.all([
    pool.query<{
      total_donations: string;
      total_donors: string;
      active_campaigns: string;
      pending_donations: string;
    }>(`
      SELECT
        (SELECT COUNT(*) FROM donations) AS total_donations,
        (SELECT COUNT(DISTINCT donor_email) FROM donations) AS total_donors,
        (SELECT COUNT(*) FROM campaigns WHERE status = 'active') AS active_campaigns,
        (SELECT COUNT(*) FROM donations WHERE status = 'pending') AS pending_donations
    `),
    pool.query<RecentDonation>(`
      SELECT donations.id, donations.donor_name, campaigns.title AS campaign_title,
             donations.amount, donations.status, donations.created_at
      FROM donations
      JOIN campaigns ON campaigns.id = donations.campaign_id
      ORDER BY donations.created_at DESC
      LIMIT 5
    `),
    pool.query<RecentCampaign>(`
      SELECT id, title, target_amount, current_amount, status
      FROM campaigns
      ORDER BY created_at DESC
      LIMIT 5
    `),
  ]);

  const row = totalsResult.rows[0];

  const totals: DashboardTotals = {
    totalDonations: Number(row.total_donations),
    totalDonors: Number(row.total_donors),
    activeCampaigns: Number(row.active_campaigns),
    pendingDonations: Number(row.pending_donations),
  };

  return {
    totals,
    recentDonations: recentDonationsResult.rows,
    recentCampaigns: recentCampaignsResult.rows,
  };
}
