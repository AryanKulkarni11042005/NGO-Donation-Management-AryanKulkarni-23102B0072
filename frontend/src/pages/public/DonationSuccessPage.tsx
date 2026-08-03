import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { downloadCertificate } from "../../api/certificates";
import { Donation } from "../../types/donation";

interface LocationState {
  donation: Donation;
  campaignTitle?: string;
}

export function DonationSuccessPage() {
  const location = useLocation();
  const state = location.state as LocationState | undefined;
  const [certificateError, setCertificateError] = useState("");

  if (!state?.donation) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-sm text-neutral-500">No donation to show.</p>
          <Link to="/" className="text-sm font-medium text-neutral-900 underline mt-2 inline-block">
            Back to campaigns
          </Link>
        </div>
      </div>
    );
  }

  const { donation, campaignTitle } = state;

  async function handleDownload() {
    setCertificateError("");
    try {
      const blob = await downloadCertificate(donation.id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `certificate-${donation.transaction_id}.pdf`;
      link.click();
      window.URL.revokeObjectURL(url);
    } catch {
      setCertificateError("Failed to download certificate.");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-md p-8 text-center">
        <h1 className="text-lg font-semibold text-neutral-900">Donation Successful</h1>

        <div className="text-left mt-6 space-y-2 text-sm">
          <p>
            <span className="text-neutral-500">Donor:</span> {donation.donor_name}
          </p>
          <p>
            <span className="text-neutral-500">Campaign:</span> {campaignTitle ?? donation.campaign_id}
          </p>
          <p>
            <span className="text-neutral-500">Amount:</span> {donation.amount}
          </p>
          <p>
            <span className="text-neutral-500">Transaction ID:</span> {donation.transaction_id}
          </p>
          <p>
            <span className="text-neutral-500">Date:</span> {new Date(donation.created_at).toLocaleString()}
          </p>
        </div>

        {certificateError && (
          <p className="text-sm text-red-600 mt-4">{certificateError}</p>
        )}

        <button
          onClick={handleDownload}
          className="w-full mt-6 border border-neutral-300 text-sm font-medium py-2 rounded-md"
        >
          Download Certificate
        </button>

        <Link to="/" className="block mt-4 text-sm font-medium text-neutral-900 underline">
          Back to campaigns
        </Link>
      </div>
    </div>
  );
}
