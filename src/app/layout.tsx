import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cheta Homemade | Cakes, Pastries & Craft",
  description: "Homemade cakes, pastries, desserts, roti, and crafts made with love."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
