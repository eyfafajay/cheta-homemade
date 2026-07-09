import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboardLayout } from "@/components/admin/DashboardClient";
import { ProductFormClient } from "@/components/admin/ProductFormClient";

export default function EditProductPage({ params }: { params: { id: string } }) {
  return (
    <AdminShell>
      <AdminDashboardLayout title="Edit Product" description="Update product details, price options, and availability.">
        <ProductFormClient productId={params.id} />
      </AdminDashboardLayout>
    </AdminShell>
  );
}
