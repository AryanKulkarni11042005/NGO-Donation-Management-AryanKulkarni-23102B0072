import { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCampaign } from "../../api/campaigns";
import { createDonation } from "../../api/donations";
import { Campaign } from "../../types/campaign";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function DonatePage() {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loadError, setLoadError] = useState("");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [amount, setAmount] = useState("");
  const [formError, setFormError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!campaignId) return;
    fetchCampaign(Number(campaignId))
      .then(setCampaign)
      .catch(() => setLoadError("Campaign not found."));
  }, [campaignId]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!name || !email || !phone || !amount) {
      setFormError("All fields are required.");
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setFormError("Enter a valid email address.");
      return;
    }

    if (Number(amount) <= 0) {
      setFormError("Amount must be greater than 0.");
      return;
    }

    setProcessing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    try {
      const donation = await createDonation({
        campaign_id: Number(campaignId),
        donor_name: name,
        donor_email: email,
        donor_phone: phone,
        amount: Number(amount),
      });
      navigate("/donate/success", { state: { donation, campaignTitle: campaign?.title } });
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Something went wrong. Please try again.");
      setProcessing(false);
    }
  }

  if (loadError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-sm text-red-600">{loadError}</p>
      </div>
    );
  }

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="bg-white border border-neutral-200 rounded-md p-8 text-center">
          <p className="text-sm font-medium text-neutral-900">Processing Payment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm bg-white border border-neutral-200 rounded-md p-8">
        <h1 className="text-lg font-semibold text-neutral-900 mb-1">Donate</h1>
        <p className="text-sm text-neutral-500 mb-6">{campaign?.title ?? "Loading campaign..."}</p>

        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
            />
          </div>

          {formError && <p className="text-sm text-red-600">{formError}</p>}

          <button
            type="submit"
            className="w-full bg-neutral-900 text-white text-sm font-medium py-2 rounded-md"
          >
            Donate
          </button>
        </form>
      </div>
    </div>
  );
}
