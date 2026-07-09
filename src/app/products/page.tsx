import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { NoticePopup } from "@/components/customer/NoticePopup";
import { ProductGridClient } from "@/components/customer/ProductGridClient";

export default function ProductsPage() {
  return (
    <>
      <Header />
      <NoticePopup />
      <main className="container section">
        <span className="eyebrow">🧁 Menu</span>
        <h1>Products</h1>
        <p className="lead">
          View all available cakes, desserts, roti, pastries, and craft items from Cheta Homemade.
        </p>
        <ProductGridClient />
      </main>
      <Footer />
    </>
  );
}
