import { useEffect, useState } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { fetchDashboard } from "../../api/dashboard";
import { DashboardData } from "../../types/dashboard";

const CARDS: { key: keyof DashboardData["totals"]; label: string }[] = [
  { key: "totalDonations", label: "Total Donations" },
  { key: "totalDonors", label: "Total Donors" },
  { key: "activeCampaigns", label: "Active Campaigns" },
  { key: "pendingDonations", label: "Pending Donations" },
];

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDashboard()
      .then(setData)
      .catch(() => setError("Failed to load dashboard."));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-lg font-semibold text-neutral-900 mb-4">Dashboard</h1>

        {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {CARDS.map((card) => (
            <div key={card.key} className="bg-white border border-neutral-200 rounded-md p-4">
              <p className="text-sm text-neutral-500">{card.label}</p>
              <p className="text-2xl font-semibold text-neutral-900 mt-1">
                {data ? data.totals[card.key] : 0}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h2 className="text-sm font-semibold text-neutral-900 mb-2">Recent Donations</h2>
            <div className="bg-white border border-neutral-200 rounded-md overflow-hidden">
              {!data || data.recentDonations.length === 0 ? (
                <p className="p-4 text-sm text-neutral-500">No data available</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-neutral-600">Donor</th>
                      <th className="text-left px-3 py-2 font-medium text-neutral-600">Campaign</th>
                      <th className="text-left px-3 py-2 font-medium text-neutral-600">Amount</th>
                      <th className="text-left px-3 py-2 font-medium text-neutral-600">Status</th>
                      <th className="text-left px-3 py-2 font-medium text-neutral-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentDonations.map((donation) => (
                      <tr key={donation.id} className="border-b border-neutral-100 last:border-0">
                        <td className="px-3 py-2 text-neutral-900">{donation.donor_name}</td>
                        <td className="px-3 py-2 text-neutral-700">{donation.campaign_title}</td>
                        <td className="px-3 py-2 text-neutral-700">{donation.amount}</td>
                        <td className="px-3 py-2">
                          <StatusBadge status={donation.status} />
                        </td>
                        <td className="px-3 py-2 text-neutral-700">
                          {new Date(donation.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-neutral-900 mb-2">Recent Campaigns</h2>
            <div className="bg-white border border-neutral-200 rounded-md overflow-hidden">
              {!data || data.recentCampaigns.length === 0 ? (
                <p className="p-4 text-sm text-neutral-500">No data available</p>
              ) : (
                <table className="w-full text-sm">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="text-left px-3 py-2 font-medium text-neutral-600">Campaign</th>
                      <th className="text-left px-3 py-2 font-medium text-neutral-600">Target</th>
                      <th className="text-left px-3 py-2 font-medium text-neutral-600">Raised</th>
                      <th className="text-left px-3 py-2 font-medium text-neutral-600">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentCampaigns.map((campaign) => (
                      <tr key={campaign.id} className="border-b border-neutral-100 last:border-0">
                        <td className="px-3 py-2 text-neutral-900">{campaign.title}</td>
                        <td className="px-3 py-2 text-neutral-700">{campaign.target_amount}</td>
                        <td className="px-3 py-2 text-neutral-700">{campaign.current_amount}</td>
                        <td className="px-3 py-2 text-neutral-700 capitalize">{campaign.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
