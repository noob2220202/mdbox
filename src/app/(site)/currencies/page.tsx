import type { Metadata } from "next";

import { CurrencyBrowser } from "@/components/site/currency-browser";
import { PageHero } from "@/components/site/page-hero";
import { CURRENCIES, type CurrencyCategory } from "@/lib/currencies";
import { dateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "전체 통화 시세",
  description: "명동 환전소가 취급하는 16개 통화의 오늘 고시 환율과 예약가를 확인하세요.",
};

const VALID_TABS = ["all", "popular", "asia", "europe", "americas"] as const;
type Tab = "all" | CurrencyCategory;

function parseTab(value: string | string[] | undefined): Tab {
  const raw = Array.isArray(value) ? value[0] : value;
  return (VALID_TABS as readonly string[]).includes(raw ?? "") ? (raw as Tab) : "all";
}

export default async function CurrenciesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const tab = parseTab(params.tab);
  const now = dateTime(new Date().toISOString());

  return (
    <>
      <PageHero
        eyebrow="Exchange Rates"
        title="오늘의 고시 환율"
        description={`${CURRENCIES.length}개 통화를 상시 취급합니다. 예약 시점의 환율이 그대로 확정되며, 매장 방문일의 환율 변동과 무관하게 적용됩니다.`}
        breadcrumb={[{ href: "/currencies", label: "환전 예약" }]}
      >
        <p className="md-tabular text-xs text-on-ink-muted">고시 기준 {now}</p>
      </PageHero>

      <section className="md-shell py-12 lg:py-16">
        <CurrencyBrowser initialTab={tab} />
      </section>

      <section className="md-shell pb-16">
        <div className="rounded-token-lg border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-base font-bold text-ink">환율 표기 안내</h2>
          <ul className="mt-4 grid gap-2.5 text-xs leading-relaxed text-muted sm:grid-cols-2">
            <li>· 일본 엔, 베트남 동, 인도네시아 루피아는 100단위 기준으로 고시합니다.</li>
            <li>· 원화 지급액은 10원 단위로 반올림해 계산합니다.</li>
            <li>· 1인 1일 환산 450만원 이하로 신청해 주세요.</li>
            <li>· 동전(주화)은 환전 대상이 아닙니다.</li>
            <li>· 권종은 지점 보유 현황에 따라 제공됩니다.</li>
            <li>· 일부 통화는 당일 수령이 어려울 수 있습니다.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
