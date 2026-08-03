import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function Navbar() {
  const { user, logout } = useAuth();

  return (
    <div className="bg-white border-b border-gray-200">
      <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-primary text-sm">MICF</span>
          <Link to="/dashboard" className="text-sm text-gray-600 hover:text-primary">
            Dashboard
          </Link>
          <Link to="/campaigns" className="text-sm text-gray-600 hover:text-primary">
            Campaigns
          </Link>
          <Link to="/donations" className="text-sm text-gray-600 hover:text-primary">
            Donations
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">
            {user?.name} ({user?.role})
          </span>
          <button
            onClick={logout}
            className="text-sm font-medium text-gray-700 border border-gray-300 rounded-md px-3 py-1.5 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
