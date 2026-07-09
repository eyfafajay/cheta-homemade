import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { NoticePopup } from "@/components/customer/NoticePopup";
import { ProductGridClient } from "@/components/customer/ProductGridClient";

export default function CategoryPage({ params }: { params: { category: string } }) {
  return (
    <>
      <Header />
      <NoticePopup />
      <main className="container section">
        <span className="eyebrow">🛍️ Category</span>
        <h1 style={{ textTransform: "capitalize" }}>{params.category.replaceAll("-", " ")}</h1>
        <p className="lead">
          Browse items under this category. Product data can be managed by admin later.
        </p>
        <ProductGridClient categorySlug={params.category} />
      </main>
      <Footer />
    </>
  );
}
