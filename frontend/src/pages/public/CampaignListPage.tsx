import { useEffect, useState } from "react";
import { AboutSection } from "../../components/public/AboutSection";
import { ContactSection } from "../../components/public/ContactSection";
import { FeaturedCampaignsSection } from "../../components/public/FeaturedCampaignsSection";
import { Hero } from "../../components/public/Hero";
import { HowItWorksSection } from "../../components/public/HowItWorksSection";
import { PublicFooter } from "../../components/public/PublicFooter";
import { PublicHeader } from "../../components/public/PublicHeader";
import { StatsSection } from "../../components/public/StatsSection";
import { fetchCampaigns } from "../../api/campaigns";
import { Campaign } from "../../types/campaign";

export function CampaignListPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchCampaigns()
      .then(setCampaigns)
      .catch(() => setError("Failed to load campaigns."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <PublicHeader />
      <Hero />
      <StatsSection campaigns={campaigns} />
      <AboutSection />
      <HowItWorksSection />
      <FeaturedCampaignsSection campaigns={campaigns} loading={loading} error={error} />
      <ContactSection />
      <PublicFooter />
    </div>
  );
}
