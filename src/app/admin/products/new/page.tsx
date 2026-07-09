import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboardLayout } from "@/components/admin/DashboardClient";
import { ProductFormClient } from "@/components/admin/ProductFormClient";

export default function NewProductPage() {
  return (
    <AdminShell>
      <AdminDashboardLayout title="Add Product" description="Create a new product. Image upload will use Supabase Storage later.">
        <ProductFormClient />
      </AdminDashboardLayout>
    </AdminShell>
  );
}
