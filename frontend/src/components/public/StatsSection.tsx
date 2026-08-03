import { Campaign } from "../../types/campaign";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function StatsSection({ campaigns }: { campaigns: Campaign[] }) {
  const totalRaised = campaigns.reduce((sum, c) => sum + Number(c.current_amount), 0);

  const stats = [
    { label: "Total Donations", value: formatCurrency(totalRaised) },
    { label: "Active Campaigns", value: String(campaigns.length) },
    { label: "Lives Impacted", value: "10,000+" },
  ];

  return (
    <section className="bg-white border-y border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold text-primary">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
