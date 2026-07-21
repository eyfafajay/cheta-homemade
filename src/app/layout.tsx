import type { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "@/components/customer/LanguageProvider";

export const metadata: Metadata = {
  title: "Cheta Homemade | Cakes, Pastries & Craft",
  description: "Homemade cakes, pastries, desserts, roti, and crafts made with love."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ms">
      <body>
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
