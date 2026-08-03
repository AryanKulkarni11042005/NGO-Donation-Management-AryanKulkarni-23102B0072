import { useEffect, useState } from "react";
import { Navbar } from "../../components/layout/Navbar";
import { StatusBadge } from "../../components/ui/StatusBadge";
import { fetchDonations, updateDonationStatus } from "../../api/donations";
import { useAuth } from "../../context/AuthContext";
import { Donation, DonationStatus } from "../../types/donation";

const STATUSES: DonationStatus[] = ["pending", "verified", "rejected"];

export function DonationsPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === "admin";

  const [donations, setDonations] = useState<Donation[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<DonationStatus | "">("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDonations() {
    setLoading(true);
    setError("");
    try {
      const data = await fetchDonations({
        search: search || undefined,
        status: statusFilter || undefined,
      });
      setDonations(data);
    } catch {
      setError("Failed to load donations.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleFilterSubmit(e: React.FormEvent) {
    e.preventDefault();
    loadDonations();
  }

  async function handleStatusChange(id: number, status: DonationStatus) {
    try {
      await updateDonationStatus(id, status);
      await loadDonations();
    } catch {
      setError("Failed to update donation status.");
    }
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-lg font-semibold text-neutral-900 mb-4">Donations</h1>

        <form onSubmit={handleFilterSubmit} className="mb-4 flex gap-2">
          <input
            type="text"
            placeholder="Search by name, email, or transaction ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm flex-1 max-w-xs"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as DonationStatus | "")}
            className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm"
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="text-sm font-medium border border-neutral-300 rounded-md px-3 py-1.5"
          >
            Filter
          </button>
        </form>

        <div className="bg-white border border-neutral-200 rounded-md overflow-hidden">
          {loading ? (
            <p className="p-4 text-sm text-neutral-500">Loading...</p>
          ) : error ? (
            <p className="p-4 text-sm text-red-600">{error}</p>
          ) : donations.length === 0 ? (
            <p className="p-4 text-sm text-neutral-500">No donations found.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Donor</th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Email</th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Amount</th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Transaction ID</th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Status</th>
                  <th className="text-left px-4 py-2 font-medium text-neutral-600">Date</th>
                  {isAdmin && <th className="text-left px-4 py-2 font-medium text-neutral-600"></th>}
                </tr>
              </thead>
              <tbody>
                {donations.map((donation) => (
                  <tr key={donation.id} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-2 text-neutral-900">{donation.donor_name}</td>
                    <td className="px-4 py-2 text-neutral-700">{donation.donor_email}</td>
                    <td className="px-4 py-2 text-neutral-700">{donation.amount}</td>
                    <td className="px-4 py-2 text-neutral-700">{donation.transaction_id}</td>
                    <td className="px-4 py-2">
                      <StatusBadge status={donation.status} />
                    </td>
                    <td className="px-4 py-2 text-neutral-700">
                      {new Date(donation.created_at).toLocaleDateString()}
                    </td>
                    {isAdmin && (
                      <td className="px-4 py-2">
                        <select
                          value={donation.status}
                          onChange={(e) => handleStatusChange(donation.id, e.target.value as DonationStatus)}
                          className="border border-neutral-300 rounded-md px-2 py-1 text-sm capitalize"
                        >
                          {STATUSES.map((status) => (
                            <option key={status} value={status} className="capitalize">
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>
                    )}
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
