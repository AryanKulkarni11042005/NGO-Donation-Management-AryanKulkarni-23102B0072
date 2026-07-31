import { useAuth } from "../../context/AuthContext";

export function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-neutral-50 p-8">
      <div className="max-w-3xl mx-auto bg-white border border-neutral-200 rounded-md p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-semibold text-neutral-900">Dashboard</h1>
            <p className="text-sm text-neutral-500">
              Logged in as {user?.name} ({user?.role})
            </p>
          </div>
          <button
            onClick={logout}
            className="text-sm font-medium text-neutral-700 border border-neutral-300 rounded-md px-3 py-1.5"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
