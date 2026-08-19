import { apiClient } from "./client";
import { Donation, DonationInput, DonationStatus } from "../types/donation";

export async function createDonation(input: DonationInput): Promise<Donation> {
  const response = await apiClient.post<{ donation: Donation }>("/donations", input);
  return response.data.donation;
}

export async function fetchDonations(params: { search?: string; status?: DonationStatus }): Promise<Donation[]> {
  const response = await apiClient.get<{ donations: Donation[] }>("/donations", { params });
  return response.data.donations;
}

export async function updateDonationStatus(id: number, status: DonationStatus): Promise<Donation> {
  const response = await apiClient.patch<{ donation: Donation }>(`/donations/${id}/status`, { status });
  return response.data.donation;
}
