import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCampaigns } from "../../api/campaigns";
import { Campaign } from "../../types/campaign";

export function CampaignListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns()
      .then(setCampaigns)
      .catch(() => setError("Failed to load campaigns."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <h1 className="font-semibold text-neutral-900">NGO Donation Portal</h1>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        <h2 className="text-lg font-semibold text-neutral-900 mb-4">Active Campaigns</h2>

        {loading ? (
          <p className="text-sm text-neutral-500">Loading...</p>
        ) : error ? (
          <p className="text-sm text-red-600">{error}</p>
        ) : campaigns.length === 0 ? (
          <p className="text-sm text-neutral-500">No active campaigns right now.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {campaigns.map((campaign) => (
              <div key={campaign.id} className="bg-white border border-neutral-200 rounded-md p-4">
                <h3 className="font-medium text-neutral-900">{campaign.title}</h3>
                {campaign.description && (
                  <p className="text-sm text-neutral-500 mt-1">{campaign.description}</p>
                )}
                <p className="text-sm text-neutral-700 mt-3">
                  Raised {campaign.current_amount} of {campaign.target_amount}
                </p>
                <Link
                  to={`/donate/${campaign.id}`}
                  className="inline-block mt-3 text-sm font-medium bg-neutral-900 text-white rounded-md px-3 py-1.5"
                >
                  Donate
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
