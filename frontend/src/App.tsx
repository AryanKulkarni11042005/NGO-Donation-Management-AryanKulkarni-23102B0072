import { Navigate, Route, BrowserRouter, Routes } from "react-router-dom";
import { ProtectedRoute } from "./components/layout/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";
import { CampaignsPage } from "./pages/admin/CampaignsPage";
import { DashboardPage } from "./pages/admin/DashboardPage";
import { DonationsPage } from "./pages/admin/DonationsPage";
import { LoginPage } from "./pages/auth/LoginPage";
import { CampaignListPage } from "./pages/public/CampaignListPage";
import { DonatePage } from "./pages/public/DonatePage";
import { DonationSuccessPage } from "./pages/public/DonationSuccessPage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<CampaignListPage />} />
          <Route path="/donate/success" element={<DonationSuccessPage />} />
          <Route path="/donate/:campaignId" element={<DonatePage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/donations" element={<DonationsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
