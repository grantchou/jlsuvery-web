import { redirect } from "next/navigation";
import { AdminEditor } from "@/components/admin-editor";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getSiteContent } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }

  const content = await getSiteContent();
  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">網站內容後台</h1>
        <p className="mt-2 text-slate-700">可直接編輯首頁主文案與檔案下載清單。</p>
      </div>
      <AdminEditor initialContent={content} />
    </section>
  );
}
