import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { NoticePopup } from "@/components/customer/NoticePopup";
import { ProductDetailClient } from "@/components/customer/ProductDetailClient";

export default async function ProductDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <>
      <Header />
      <NoticePopup />
      <ProductDetailClient productId={id} />
      <Footer />
    </>
  );
}
