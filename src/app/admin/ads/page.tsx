import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import AdCampaignForm from "@/components/AdCampaignForm";
import "../../admin.css";

export default async function AdsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: campaigns } = await supabase.from("ad_campaigns").select("*").order("date_recorded", { ascending: false });

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Ad Campaigns</h1>
          <p>Enter spend manually until Meta Business Manager is connected</p>
        </div>

        <div className="admin-section">
          <AdCampaignForm />
          {campaigns && campaigns.length > 0 ? (
            <table className="admin-data-table">
              <thead><tr><th>Campaign</th><th>Platform</th><th>Spend</th><th>Reach</th><th>Clicks</th><th>Conversions</th><th>Date</th></tr></thead>
              <tbody>
                {campaigns.map((c: any) => (
                  <tr key={c.id}>
                    <td>{c.campaign_name}</td>
                    <td>{c.platform}</td>
                    <td>${Number(c.spend_usd).toFixed(2)}</td>
                    <td>{c.reach}</td>
                    <td>{c.clicks}</td>
                    <td>{c.conversions}</td>
                    <td>{new Date(c.date_recorded).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="admin-empty">No campaigns logged yet.</div>}
        </div>
      </main>
    </div>
  );
}
