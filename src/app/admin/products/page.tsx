import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboardLayout } from "@/components/admin/DashboardClient";
import { ProductsAdminClient } from "@/components/admin/ProductsAdminClient";

export default function AdminProductsPage() {
  return (
    <AdminShell>
      <AdminDashboardLayout title="Manage Products" description="Add, edit, hide, and delete product listings.">
        <ProductsAdminClient />
      </AdminDashboardLayout>
    </AdminShell>
  );
}
