import { useEffect, useState } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { createCampaign, fetchCampaigns, updateCampaign } from "../../api/campaigns";
import { Campaign, CampaignInput, CampaignStatus } from "../../types/campaign";

const EMPTY_FORM: CampaignInput = {
  title: "",
  description: "",
  target_amount: 0,
  status: "active",
  start_date: "",
  end_date: "",
};

export function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CampaignInput>(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  async function loadCampaigns(searchTerm?: string) {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCampaigns(searchTerm);
      setCampaigns(data);
    } catch {
      setError("Failed to load campaigns.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCampaigns();
  }, []);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadCampaigns(search || undefined);
  }

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowForm(true);
  }

  function openEditForm(campaign: Campaign) {
    setEditingId(campaign.id);
    setForm({
      title: campaign.title,
      description: campaign.description ?? "",
      target_amount: Number(campaign.target_amount),
      status: campaign.status,
      start_date: campaign.start_date.slice(0, 10),
      end_date: campaign.end_date.slice(0, 10),
    });
    setFormError("");
    setShowForm(true);
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault();
    setFormError("");

    if (!form.title || !form.target_amount || !form.start_date || !form.end_date) {
      setFormError("Title, target amount, start date, and end date are required.");
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateCampaign(editingId, form);
      } else {
        await createCampaign(form);
      }
      setShowForm(false);
      await loadCampaigns(search || undefined);
    } catch (err: any) {
      setFormError(err.response?.data?.message || "Failed to save campaign.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-lg font-semibold text-neutral-900">Campaigns</h1>
          <button
            onClick={openCreateForm}
            className="text-sm font-medium bg-neutral-900 text-white rounded-md px-3 py-1.5"
          >
            New Campaign
          </button>
        </div>

        <form onSubmit={handleSearchSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm flex-1 max-w-xs"
          />
          <button
            type="submit"
            className="text-sm font-medium border border-neutral-300 rounded-md px-3 py-1.5"
          >
            Search
          </button>
        </form>

        {showForm && (
          <div className="bg-white border border-neutral-200 rounded-md p-5 mb-6">
            <h2 className="text-sm font-semibold text-neutral-900 mb-3">
              {editingId ? "Edit Campaign" : "New Campaign"}
            </h2>
            <form onSubmit={handleFormSubmit} className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Target Amount</label>
                <input
                  type="number"
                  value={form.target_amount}
                  onChange={(e) => setForm({ ...form, target_amount: Number(e.target.value) })}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value as CampaignStatus })}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
                >
                  <option value="active">Active</option>
                  <option value="closed">Closed</option>
                  <option value="draft">Draft</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={form.start_date}
                  onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={form.end_date}
                  onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                  className="w-full border border-neutral-300 rounded-md px-3 py-2 text-sm"
                />
              </div>

              {formError && <p className="col-span-2 text-sm text-red-600">{formError}</p>}

              <div className="col-span-2 flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="text-sm font-medium bg-neutral-900 text-white rounded-md px-4 py-2 disabled:opacity-60"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="text-sm font-medium border border-neutral-300 rounded-md px-4 py-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white border border-neutral-200 rounded-md overflow-hidden">
          {loading ? (
            <p className="p-4 text-sm text-neutral-500">Loading...</p>
          ) : error ? (
            <p className="p-4 text-sm text-red-600">{error}</p>
          ) : campaigns.length === 0 ? (
            <p className="p-4 text-sm text-neutral-500">No campaigns found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Title</th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Target</th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Raised</th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Status</th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Dates</th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600"></th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-2 text-neutral-900">{campaign.title}</td>
                    <td className="px-4 py-2 text-neutral-700">{campaign.target_amount}</td>
                    <td className="px-4 py-2 text-neutral-700">{campaign.current_amount}</td>
                    <td className="px-4 py-2 text-neutral-700 capitalize">{campaign.status}</td>
                    <td className="px-4 py-2 text-neutral-700">
                      {campaign.start_date.slice(0, 10)} to {campaign.end_date.slice(0, 10)}
                    </td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openEditForm(campaign)}
                        className="text-sm font-medium text-neutral-700 border border-neutral-300 rounded-md px-3 py-1"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
