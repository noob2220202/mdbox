import { CartDrawer } from "@/components/site/cart-drawer";
import { CartProvider } from "@/components/site/cart-context";
import { Footer } from "@/components/site/footer";
import { Header } from "@/components/site/header";
import { PromoBar } from "@/components/site/promo-bar";
import { QuickViewModal } from "@/components/site/quick-view-modal";
import { ToastProvider } from "@/components/ui/toast";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <ToastProvider>
        <div className="flex min-h-screen flex-col">
          <PromoBar />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <CartDrawer />
        <QuickViewModal />
      </ToastProvider>
    </CartProvider>
  );
}
