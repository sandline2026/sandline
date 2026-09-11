import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import AdminHeader from "@/components/AdminHeader";
import { CouponCreateForm, ToggleCouponButton, DeleteCouponButton } from "@/components/CouponFormUI";
import { Tag, PlusCircle, Percent, CheckCircle2 } from "lucide-react";
import "../../admin.css";

export default async function CouponsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: coupons } = await supabase
    .from("coupons")
    .select("*")
    .order("created_at", { ascending: false });

  const totalCoupons = coupons?.length || 0;
  const activeCoupons = coupons?.filter((c: any) => c.is_active).length || 0;
  const totalTimesUsed = coupons?.reduce((sum: number, c: any) => sum + (c.used_count || 0), 0) || 0;

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <AdminHeader
          title="Promo Codes & Discounts"
          subtitle="Create discount coupons, set usage limits, and track redemption activity"
        />

        {/* Stats Grid */}
        <div className="admin-stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Total Codes</span>
              <div className="admin-stat-icon-wrapper blue">
                <Tag size={20} />
              </div>
            </div>
            <div className="value">{totalCoupons}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge neutral">Created</span>
              <span>All promotional campaigns</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Active Promo Codes</span>
              <div className="admin-stat-icon-wrapper green">
                <CheckCircle2 size={20} />
              </div>
            </div>
            <div className="value" style={{ color: "var(--green)" }}>{activeCoupons}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Enabled</span>
              <span>Redeemable at checkout</span>
            </div>
          </div>

          <div className="admin-stat-card">
            <div className="admin-stat-header">
              <span className="label">Times Redeemed</span>
              <div className="admin-stat-icon-wrapper purple">
                <Percent size={20} />
              </div>
            </div>
            <div className="value">{totalTimesUsed}</div>
            <div className="admin-stat-footer">
              <span className="admin-stat-badge positive">Conversions</span>
              <span>Orders with applied promo</span>
            </div>
          </div>
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <PlusCircle size={18} />
              <span>Create New Promo Code</span>
            </h2>
          </div>
          <CouponCreateForm />
        </div>

        <div className="admin-section">
          <div className="admin-section-header">
            <h2>
              <Tag size={18} />
              <span>Active & Past Promo Codes ({totalCoupons})</span>
            </h2>
          </div>
          {coupons && coupons.length > 0 ? (
            <table className="admin-data-table">
              <thead>
                <tr>
                  <th>Promo Code</th>
                  <th>Discount Type</th>
                  <th>Value</th>
                  <th>Redemptions</th>
                  <th>Max Limit</th>
                  <th>Status</th>
                  <th style={{ textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {coupons.map((c: any) => (
                  <tr key={c.id}>
                    <td>
                      <code
                        style={{
                          background: "var(--sand)",
                          color: "var(--ink)",
                          padding: "4px 8px",
                          borderRadius: "6px",
                          fontFamily: "'Space Mono', monospace",
                          fontWeight: 700,
                          fontSize: "13px",
                          letterSpacing: "0.05em",
                        }}
                      >
                        {c.code}
                      </code>
                    </td>
                    <td style={{ textTransform: "capitalize" }}>{c.discount_type}</td>
                    <td>
                      <strong style={{ color: "var(--green)" }}>
                        {c.discount_type === "percentage"
                          ? `${c.discount_value}% OFF`
                          : `$${c.discount_value} OFF`}
                      </strong>
                    </td>
                    <td>
                      <strong>{c.used_count || 0}</strong> uses
                    </td>
                    <td>{c.max_uses ? `${c.max_uses} max` : <span style={{ color: "var(--text-muted)" }}>Unlimited</span>}</td>
                    <td>
                      <ToggleCouponButton id={c.id} isActive={c.is_active} />
                    </td>
                    <td style={{ textAlign: "right" }}>
                      <DeleteCouponButton id={c.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="admin-empty">
              <Tag size={32} />
              <p>No promo codes created yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
