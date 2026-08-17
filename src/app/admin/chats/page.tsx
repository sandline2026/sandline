import { createClient } from "@/../utils/supabase/server";
import { cookies } from "next/headers";
import AdminNav from "@/components/AdminNav";
import "../../admin.css";

export default async function ChatsPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: chats } = await supabase.from("chats").select("*").order("created_at", { ascending: false });

  return (
    <div className="admin-app">
      <AdminNav />
      <main className="admin-main">
        <div className="admin-header">
          <h1>Chats</h1>
          <p>Live chat widget isn't on the site yet — this will populate once it's added</p>
        </div>

        <div className="admin-section">
          {chats && chats.length > 0 ? (
            <table className="admin-data-table">
              <thead><tr><th>Customer email</th><th>Status</th><th>Started</th></tr></thead>
              <tbody>
                {chats.map((c: any) => (
                  <tr key={c.id}>
                    <td>{c.customer_email || "—"}</td>
                    <td>{c.status}</td>
                    <td>{new Date(c.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <div className="admin-empty">No chats yet.</div>}
        </div>
      </main>
    </div>
  );
}
