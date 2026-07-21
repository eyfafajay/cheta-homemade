import { AdminShell } from "@/components/admin/AdminShell";
import { AdminDashboardLayout } from "@/components/admin/DashboardClient";
import { ProductFormClient } from "@/components/admin/ProductFormClient";

export default async function EditProductPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <AdminShell>
      <AdminDashboardLayout title="Edit Product" description="Update product details, price options, and availability.">
        <ProductFormClient productId={id} />
      </AdminDashboardLayout>
    </AdminShell>
  );
}
