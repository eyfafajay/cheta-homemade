import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboardLayout } from "@/components/admin/DashboardClient";
import { ContactAdminClient } from "@/components/admin/ContactAdminClient";

export default function AdminContactPage() {
  return (
    <AdminShell>
      <AdminDashboardLayout title="Contact Settings" description="Update WhatsApp number, social links, pickup area, and order instructions.">
        <ContactAdminClient />
      </AdminDashboardLayout>
    </AdminShell>
  );
}
