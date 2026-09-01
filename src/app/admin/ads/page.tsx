import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";
import AdCampaignForm from "@/components/AdCampaignForm";
import AdminAdsTable from "@/components/AdminAdsTable";
import { Megaphone, PlusCircle, DollarSign, MousePointerClick, TrendingUp } from "lucide-react";
import "../../admin.css";

export default async function AdsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: campaigns } = await supabase
    .from("ad_campaigns")
    .select("*")
    .order("date_recorded", { ascending: false });

  const totalSpend = campaigns?.reduce((sum: number, c: any) => sum + Number(c.spend_usd || 0), 0) || 0;
  const totalClicks = campaigns?.reduce((sum: number, c: any) => sum + (c.clicks || 0), 0) || 0;
  const totalConversions = campaigns?.reduce((sum: number, c: any) => sum + (c.conversions || 0), 0) || 0;

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <AdminHeader
          title="Ad Campaigns & ROAS"
          subtitle="Track paid acquisition spend, cost per click, and conversions across Meta & Google"
        />

        {/* Stats Grid */}
        <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Ad Spend</span>
              <div className="admin-stat-icon-wrapper red">
                <DollarSign size={20} />
              </div>
            </div>
            <div className="value">${totalSpend.toFixed(2)}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge neutral">Lifetime</span>
              <span>Paid media investment</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Clicks</span>
              <div className="admin-stat-icon-wrapper blue">
                <MousePointerClick size={20} />
              </div>
            </div>
            <div className="value">{totalClicks}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge neutral">
                ${totalClicks > 0 ? (totalSpend / totalClicks).toFixed(2) : "0.00"} CPC
              </span>
              <span>Inbound ad traffic</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Ad Conversions</span>
              <div className="admin-stat-icon-wrapper green">
                <TrendingUp size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--green)" }}>{totalConversions}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Attributed</span>
              <span>Purchases from campaigns</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <PlusCircle size={18} />
              <span>Log Campaign Spend</span>
            </h2>
          </div>
          <AdCampaignForm />
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <Megaphone size={18} />
              <span>Logged Campaigns ({campaigns?.length || 0})</span>
            </h2>
          </div>
          <AdminAdsTable campaigns={(campaigns as any) || []} />
        </div>
      </main>
    </div>
  );
}
