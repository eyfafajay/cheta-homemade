import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboardLayout } from "@/components/admin/DashboardClient";
import { CategoriesAdminClient } from "@/components/admin/CategoriesAdminClient";

export default function AdminCategoriesPage() {
  return (
    <AdminShell>
      <AdminDashboardLayout title="Manage Categories" description="Create and manage product categories shown on the customer website.">
        <CategoriesAdminClient />
      </AdminDashboardLayout>
    </AdminShell>
  );
}
