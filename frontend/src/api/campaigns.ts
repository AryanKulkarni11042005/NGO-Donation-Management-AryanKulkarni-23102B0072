import { apiClient } from "./client";
import { Campaign, CampaignInput } from "../types/campaign";

export async function fetchCampaigns(search?: string): Promise<Campaign[]> {
  const response = await apiClient.get<{ campaigns: Campaign[] }>("/campaigns", {
    params: search ? { search } : undefined,
  });
  return response.data.campaigns;
}

export async function fetchCampaign(id: number): Promise<Campaign> {
  const response = await apiClient.get<{ campaign: Campaign }>(`/campaigns/${id}`);
  return response.data.campaign;
}

export async function createCampaign(input: CampaignInput): Promise<Campaign> {
  const response = await apiClient.post<{ campaign: Campaign }>("/campaigns", input);
  return response.data.campaign;
}

export async function updateCampaign(id: number, input: Partial<CampaignInput>): Promise<Campaign> {
  const response = await apiClient.put<{ campaign: Campaign }>(`/campaigns/${id}`, input);
  return response.data.campaign;
}
