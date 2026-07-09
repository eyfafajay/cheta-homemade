import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { NoticePopup } from "@/components/customer/NoticePopup";
import { ProductDetailClient } from "@/components/customer/ProductDetailClient";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Header />
      <NoticePopup />
      <ProductDetailClient productId={params.id} />
      <Footer />
    </>
  );
}
