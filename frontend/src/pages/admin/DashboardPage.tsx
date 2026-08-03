import { Navbar } from "../../components/layout/Navbar";

export function DashboardPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-lg font-semibold text-neutral-900">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-1">Summary coming soon.</p>
      </div>
    </div>
  );
}
