import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export function PublicHeader() {
  const { token } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-semibold text-lg text-primary">
          MICF
        </Link>
        <nav className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-600">
          <a href="#about" className="hover:text-primary">About</a>
          <a href="#campaigns" className="hover:text-primary">Campaigns</a>
          <a href="#contact" className="hover:text-primary">Contact</a>
        </nav>
        <Link
          to={token ? "/dashboard" : "/login"}
          className="text-sm font-medium text-gray-600 hover:text-primary"
        >
          Staff Login
        </Link>
      </div>
    </header>
  );
}
