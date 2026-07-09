import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboardLayout } from "@/components/admin/DashboardClient";
import { NoticesAdminClient } from "@/components/admin/NoticesAdminClient";

export default function AdminNoticesPage() {
  return (
    <AdminShell>
      <AdminDashboardLayout title="Manage Notices" description="Add day off notices, fully booked messages, or order announcements for the popup.">
        <NoticesAdminClient />
      </AdminDashboardLayout>
    </AdminShell>
  );
}
