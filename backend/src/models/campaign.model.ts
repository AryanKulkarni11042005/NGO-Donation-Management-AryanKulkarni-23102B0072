export type CampaignStatus = "active" | "closed" | "draft";

export interface Campaign {
  id: number;
  title: string;
  description: string | null;
  target_amount: string;
  current_amount: string;
  status: CampaignStatus;
  start_date: string;
  end_date: string;
  created_by: number | null;
  created_at: Date;
  updated_at: Date;
}
