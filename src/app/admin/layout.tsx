import type { Metadata } from "next";

import { ToastProvider } from "@/components/ui/toast";

export const metadata: Metadata = {
  title: "주문 관리",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div className="min-h-screen bg-canvas-2">{children}</div>
    </ToastProvider>
  );
}
