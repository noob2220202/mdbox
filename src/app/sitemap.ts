import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

/** 검색엔진에 노출할 공개 페이지 (어드민·예약 완료 화면은 제외) */
const ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/currencies", priority: 0.9, changeFrequency: "daily" },
  { path: "/checkout", priority: 0.7, changeFrequency: "monthly" },
  { path: "/order/lookup", priority: 0.6, changeFrequency: "monthly" },
  { path: "/stores", priority: 0.7, changeFrequency: "monthly" },
  { path: "/pickup", priority: 0.6, changeFrequency: "monthly" },
  { path: "/cancel", priority: 0.5, changeFrequency: "monthly" },
  { path: "/denominations", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.5, changeFrequency: "monthly" },
  { path: "/about", priority: 0.5, changeFrequency: "yearly" },
  { path: "/sustainability", priority: 0.4, changeFrequency: "yearly" },
  { path: "/careers", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((route) => ({
    url: `${SITE_URL}${route.path}`,
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
