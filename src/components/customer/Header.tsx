import Link from "next/link";

export function Header() {
  return (
    <header className="site-header">
      <div className="container navbar">
        <Link className="brand" href="/">
          <span className="brand-mark">CH</span>
          <span>
            Cheta Homemade
            <small>Cakes • Pastries • Craft</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <Link href="/">Home</Link>

          <details className="nav-dropdown">
            <summary>
              <span>Products</span>
              <span className="dropdown-chevron" aria-hidden="true" />
            </summary>

            <div className="dropdown-menu">
              <Link href="/products">
                <span className="dropdown-icon dropdown-icon-all" aria-hidden="true" />
                <span>All products</span>
              </Link>

              <Link href="/products/kek">
                <span className="dropdown-icon dropdown-icon-cakes" aria-hidden="true" />
                <span>Cakes</span>
              </Link>

              <Link href="/products/desserts">
                <span className="dropdown-icon dropdown-icon-desserts" aria-hidden="true" />
                <span>Desserts</span>
              </Link>

              <Link href="/products/roti">
                <span className="dropdown-icon dropdown-icon-roti" aria-hidden="true" />
                <span>Roti</span>
              </Link>

              <Link href="/products/craft">
                <span className="dropdown-icon dropdown-icon-craft" aria-hidden="true" />
                <span>Craft</span>
              </Link>
            </div>
          </details>

          <Link href="/contact">Contact</Link>
        </nav>
      </div>
    </header>
  );
}
