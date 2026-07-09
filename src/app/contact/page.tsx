import { Header } from "@/components/customer/Header";
import { Footer } from "@/components/customer/Footer";
import { NoticePopup } from "@/components/customer/NoticePopup";
import { ContactClient } from "@/components/customer/ContactClient";

export default function ContactPage() {
  return (
    <>
      <Header />
      <NoticePopup />
      <ContactClient />
      <Footer />
    </>
  );
}
