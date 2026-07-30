import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "지속가능성",
  description: "종이 없는 예약, 지폐 재순환, 지역 상생 — 명동 환전소가 지키는 원칙입니다.",
};

const PILLARS = [
  {
    title: "종이 없는 예약",
    body: "예약 확인서와 영수증을 문자·이메일로 발송합니다. 온라인 예약 도입 이후 창구 출력물이 크게 줄었습니다.",
    metric: "출력물 82% 감소",
  },
  {
    title: "지폐 재순환",
    body: "매입한 외화를 폐기 없이 재검수해 다시 유통합니다. 훼손권만 발권 기관을 통해 정상 폐기합니다.",
    metric: "재순환율 96%",
  },
  {
    title: "지역 상생",
    body: "명동·남대문 상권의 소상공인 대상 소액 환전 수수료를 면제하고, 지역 관광 안내를 함께 제공합니다.",
    metric: "제휴 상점 40여 곳",
  },
  {
    title: "안전한 개인정보",
    body: "예약에 필요한 최소 정보만 수집하고, 목적 달성 후에는 지체 없이 파기합니다.",
    metric: "수집 항목 5개",
  },
];

const PRACTICES = [
  "지점 조명·냉난방을 영업시간에 맞춰 자동 제어합니다.",
  "예약 안내는 종이 대신 문자와 이메일로만 발송합니다.",
  "창구 비품은 재생 용지와 리필 가능한 문구류로 통일했습니다.",
  "폐기 대상 지폐는 한국은행 절차에 따라 처리합니다.",
];

export default function SustainabilityPage() {
  return (
    <>
      <PageHero
        eyebrow="Sustainability"
        title="오래 남을 방식으로 일합니다"
        description="환전은 종이와 현금을 다루는 일입니다. 그만큼 낭비를 줄이는 방법도 분명합니다. 명동 환전소가 실제로 지키고 있는 원칙을 공개합니다."
        breadcrumb={[{ href: "/sustainability", label: "지속가능성" }]}
      />

      <section className="md-shell py-16 lg:py-20">
        <div className="grid gap-5 sm:grid-cols-2">
          {PILLARS.map((pillar) => (
            <article key={pillar.title} className="rounded-token-lg border border-line bg-surface p-7">
              <p className="md-tabular font-display text-2xl font-extrabold text-gold">
                {pillar.metric}
              </p>
              <h2 className="mt-4 text-base font-bold text-ink">{pillar.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{pillar.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-token-lg border border-line bg-surface p-7">
            <h2 className="text-lg font-bold text-ink">매장에서 실천하는 것들</h2>
            <ul className="mt-4 space-y-2.5">
              {PRACTICES.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-text">
                  <span className="mt-0.5 text-gold" aria-hidden>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="md-guilloche rounded-token-lg border border-line p-7">
            <h2 className="text-lg font-bold text-ink">예약이 곧 절약입니다</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              온라인으로 미리 예약하면 창구 대기와 재고 과잉 보유가 함께 줄어듭니다. 가장 간단한
              방식이 가장 효율적인 방식이기도 합니다.
            </p>
            <Link
              href="/currencies"
              className="mt-6 inline-block rounded-token-sm bg-ink px-5 py-3 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
            >
              통화 시세 보러 가기
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
