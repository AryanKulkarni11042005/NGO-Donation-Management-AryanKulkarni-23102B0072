import { apiClient } from "./client";

export async function downloadCertificate(donationId: number): Promise<Blob> {
  const response = await apiClient.get(`/certificates/${donationId}/download`, {
    responseType: "blob",
  });
  return response.data;
}
