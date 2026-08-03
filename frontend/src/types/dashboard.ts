import { CampaignStatus } from "./campaign";
import { DonationStatus } from "./donation";

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
  status: DonationStatus;
  created_at: string;
}

export interface RecentCampaign {
  id: number;
  title: string;
  target_amount: string;
  current_amount: string;
  status: CampaignStatus;
}

export interface DashboardData {
  totals: DashboardTotals;
  recentDonations: RecentDonation[];
  recentCampaigns: RecentCampaign[];
}
