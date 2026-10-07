import { apiClient } from "./client";
import { DashboardData } from "../types/dashboard";

export async function fetchDashboard(): Promise<DashboardData> {
  const response = await apiClient.get<DashboardData>("/dashboard");
  return response.data;
}
