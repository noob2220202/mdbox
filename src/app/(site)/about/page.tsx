import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { BRANCHES } from "@/lib/branches";
import { CURRENCIES } from "@/lib/currencies";
import { BUSINESS, businessFields } from "@/lib/site";

export const metadata: Metadata = {
  title: "회사 소개",
  description: "2021년부터 명동에서 16개 통화를 취급해 온 환전 전문 매장, 명동 환전소입니다.",
};

const VALUES = [
  {
    title: "고시 환율 그대로",
    body: "예약 화면에 표시된 환율이 곧 적용 환율입니다. 방문 당일 환율이 올라도 예약 시점 환율로 정산합니다.",
  },
  {
    title: "기다리지 않는 창구",
    body: "예약 건은 별도 창구에서 처리합니다. 신분증 확인과 수령까지 평균 3분이면 끝납니다.",
  },
  {
    title: "정직한 권종 안내",
    body: "보유 권종을 예약 단계에서 미리 공개합니다. 현장에서 원하지 않는 권종을 받는 일이 없습니다.",
  },
  {
    title: "다국어 응대",
    body: "한국어·영어·일본어·중국어 응대가 가능한 직원이 상시 근무합니다.",
  },
];

const TIMELINE = [
  { year: "2021", title: "명동 본점 개점", body: "남대문로 52-1에서 첫 창구를 열었습니다." },
  { year: "2022", title: "취급 통화 16종 확대", body: "동남아·오세아니아 통화를 상시 보유하기 시작했습니다." },
  { year: "2023", title: "온라인 예약 도입", body: "예약 환율 고정 서비스를 시작했습니다." },
  { year: "2025", title: "명동 일대 4개 지점", body: "명동역·을지로입구·남대문시장으로 창구를 넓혔습니다." },
];

export default function AboutPage() {
  const fields = businessFields();

  return (
    <>
      <PageHero
        eyebrow="About"
        title="명동에서 가장 가까운 환전 창구"
        description={`${BUSINESS.brand}는 ${BUSINESS.establishedAt}부터 명동 남대문로에서 외화 환전을 전문으로 해왔습니다. 여행객과 출장자가 가장 빠르게 외화를 손에 쥘 수 있는 방법을 만듭니다.`}
        breadcrumb={[{ href: "/about", label: "회사 소개" }]}
      />

      <section className="md-shell py-16 lg:py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="md-eyebrow">Our promise</p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
              환전은 단순해야 합니다
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              환율을 확인하고, 금액을 정하고, 받아가는 것. 이 세 가지 외의 모든 절차를 덜어내는 것이
              저희의 일입니다. 온라인 예약으로 환율을 먼저 고정하고, 매장에서는 확인과 수령만
              남깁니다.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              현재 {CURRENCIES.length}개 통화를 상시 보유하며, 명동 일대 {BRANCHES.length}개 지점에서
              동일한 환율로 응대합니다.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {VALUES.map((value) => (
              <div key={value.title} className="rounded-token-lg border border-line bg-surface p-6">
                <h3 className="text-base font-bold text-ink">{value.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-surface py-16 lg:py-20">
        <div className="md-shell">
          <p className="md-eyebrow">History</p>
          <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">걸어온 길</h2>

          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {TIMELINE.map((item) => (
              <li key={item.year} className="rounded-token-lg border border-line bg-canvas p-6">
                <span className="md-tabular font-display text-2xl font-extrabold text-gold">
                  {item.year}
                </span>
                <h3 className="mt-3 text-sm font-bold text-ink">{item.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="md-shell py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <p className="md-eyebrow">Business</p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">사업자 정보</h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              {BUSINESS.legalName}은 관할 세무서에 등록된 환전 영업자입니다. 아래 정보는 사업자등록증
              기재 사항과 동일합니다.
            </p>
            <Link
              href="/stores"
              className="mt-6 inline-block rounded-token-sm bg-ink px-5 py-3 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
            >
              매장 찾아오시는 길
            </Link>
          </div>

          <dl className="divide-y divide-line rounded-token-lg border border-line bg-surface">
            {fields.map((field) => (
              <div key={field.label} className="flex gap-4 px-6 py-4">
                <dt className="w-32 shrink-0 text-xs font-semibold text-muted">{field.label}</dt>
                <dd className="text-sm text-ink">{field.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
