import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-b border-neutral-200">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-semibold text-neutral-900 text-sm">NGO Donation Portal</span>
          <Link to="/dashboard" className="text-sm text-neutral-600 hover:text-neutral-900">
            Dashboard
          </Link>
          <Link to="/campaigns" className="text-sm text-neutral-600 hover:text-neutral-900">
            Campaigns
          </Link>
          <Link to="/donations" className="text-sm text-neutral-600 hover:text-neutral-900">
            Donations
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-neutral-500">
            {user?.name} ({user?.role})
          </span>
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
