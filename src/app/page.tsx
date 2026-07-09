import Link from "next/link";
import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { CategoryCards } from "@/components/customer/CategoryCards";
import { NoticePopup } from "@/components/customer/NoticePopup";
import { ProductGridClient } from "@/components/customer/ProductGridClient";

export default function Home() {
  return (
    <>
      <Header />
      <NoticePopup />
      <main>
        <section className="hero">
          <div className="container hero-grid">
            <div className="hero-copy">
              <span className="eyebrow">🍰 Homemade with love</span>
              <h1>Cheta Homemade</h1>
              <p className="lead">
                Homemade cakes, pastries, desserts, roti, and handmade crafts for family gatherings,
                celebrations, and sweet little moments.
              </p>
              <div className="hero-actions">
                <Link className="btn btn-primary" href="/products">
                  Browse products
                </Link>
                <Link className="btn btn-secondary" href="/contact">
                  Contact us
                </Link>
              </div>
            </div>

            <div className="hero-showcase" aria-label="Cheta Homemade product showcase">
              <div className="hero-showcase-card hero-main-card">
                <span className="showcase-tag">Pre-order friendly</span>
                <h2>Freshly made treats for every occasion.</h2>
                <p>
                  Cakes, desserts, roti, and crafts can be browsed by category with prices and order details.
                </p>
              </div>

              <div className="showcase-category-row">
                <Link className="showcase-category" href="/products/kek">
                  <span>🍰</span>
                  <strong>Cakes</strong>
                  <small>Whole cakes and butter cakes</small>
                </Link>
                <Link className="showcase-category" href="/products/desserts">
                  <span>🧁</span>
                  <strong>Desserts</strong>
                  <small>Tarts, puffs, pavlova and more</small>
                </Link>
              </div>

              <div className="showcase-category-row compact">
                <Link className="showcase-category" href="/products/roti">
                  <span>🥐</span>
                  <strong>Roti</strong>
                </Link>
                <Link className="showcase-category" href="/products/craft">
                  <span>🎀</span>
                  <strong>Craft</strong>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="eyebrow">🛍️ Categories</span>
                <h2>Browse by category</h2>
              </div>
              <p>Choose from Kek, Desserts, Roti, and Craft. Admin can add and update products later.</p>
            </div>
            <CategoryCards />
          </div>
        </section>

        <section className="section">
          <div className="container">
            <div className="section-header">
              <div>
                <span className="eyebrow">⭐ Featured</span>
                <h2>Popular picks</h2>
              </div>
              <Link className="btn btn-secondary" href="/products">
                View all products
              </Link>
            </div>
            <ProductGridClient featuredOnly />
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
