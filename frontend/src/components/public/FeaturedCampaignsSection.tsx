import { Campaign } from "../../types/campaign";
import { CampaignCard } from "./CampaignCard";

export function FeaturedCampaignsSection({
  campaigns,
  loading,
  error,
}: {
  campaigns: Campaign[];
  loading: boolean;
  error: string;
}) {
  return (
    <section id="campaigns" className="bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center">Featured Campaigns</h2>
        <p className="text-gray-600 text-center mt-2">
          Support a cause and make a difference today.
        </p>

        <div className="mt-10">
          {loading ? (
            <p className="text-sm text-gray-500 text-center">Loading campaigns...</p>
          ) : error ? (
            <p className="text-sm text-red-600 text-center">{error}</p>
          ) : campaigns.length === 0 ? (
            <p className="text-sm text-gray-500 text-center">No active campaigns right now.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {campaigns.map((campaign) => (
                <CampaignCard key={campaign.id} campaign={campaign} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
