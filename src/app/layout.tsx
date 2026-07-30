import type { Metadata, Viewport } from "next";
import { Manrope, Noto_Sans_KR } from "next/font/google";

import { BUSINESS, SITE_URL } from "@/lib/site";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  display: "swap",
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS.brand} · 명동 한복판의 환전 예약`,
    template: `%s | ${BUSINESS.brand}`,
  },
  description:
    "명동 환전소는 16개 통화를 온라인으로 미리 예약하고 매장에서 바로 수령하는 환전 서비스입니다. 오늘 고시 환율을 확인하고 예약하세요.",
  keywords: ["명동 환전소", "환전", "환율", "명동 환전", "외화 예약", "머니박스 명동"],
  openGraph: {
    title: `${BUSINESS.brand} · 명동 한복판의 환전 예약`,
    description: "16개 통화, 오늘 고시 환율로 미리 예약하고 명동에서 바로 수령하세요.",
    type: "website",
    locale: "ko_KR",
    url: SITE_URL,
    siteName: BUSINESS.brand,
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#0a1226",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-canvas text-text antialiased">{children}</body>
    </html>
  );
}
