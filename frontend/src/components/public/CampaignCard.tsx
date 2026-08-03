import { Link } from "react-router-dom";
import { Campaign } from "../../types/campaign";

export function CampaignCard({ campaign }: { campaign: Campaign }) {
  const target = Number(campaign.target_amount);
  const raised = Number(campaign.current_amount);
  const progress = target > 0 ? Math.min(100, Math.round((raised / target) * 100)) : 0;

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col">
      <h3 className="font-semibold text-gray-900">{campaign.title}</h3>
      {campaign.description && (
        <p className="text-sm text-gray-600 mt-1 flex-1">{campaign.description}</p>
      )}

      <div className="mt-4">
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary rounded-full"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-sm">
          <span className="font-medium text-gray-900">
            ₹{raised.toLocaleString("en-IN")} raised
          </span>
          <span className="text-gray-500">of ₹{target.toLocaleString("en-IN")}</span>
        </div>
      </div>

      <Link
        to={`/donate/${campaign.id}`}
        className="mt-4 inline-block text-center bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-md px-4 py-2"
      >
        Donate
      </Link>
    </div>
  );
}
