import Link from "next/link";

import { CurrencyCard } from "@/components/site/currency-card";
import { ExchangeCalculator } from "@/components/site/exchange-calculator";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { BRANCHES } from "@/lib/branches";
import { CATEGORIES, CURRENCIES, currenciesByCategory } from "@/lib/currencies";
import { dateTime } from "@/lib/format";
import { BUSINESS } from "@/lib/site";

export const dynamic = "force-dynamic";

const STEPS = [
  {
    no: "01",
    title: "통화를 담습니다",
    body: "오늘 고시된 환율로 필요한 통화를 바구니에 담습니다. 여러 통화를 한 번에 예약할 수 있습니다.",
  },
  {
    no: "02",
    title: "예약금을 결제합니다",
    body: "환전 금액의 3%를 예약금으로 결제하면 예약 환율이 확정됩니다. 예약금은 수령 시 돌려드립니다.",
  },
  {
    no: "03",
    title: "매장에서 수령합니다",
    body: "예약번호와 신분증을 지참해 방문하시면 대기 없이 바로 수령하실 수 있습니다.",
  },
];

const FACTS = [
  { value: "16", unit: "개 통화", label: "명동 본점 상시 취급" },
  { value: "4", unit: "개 지점", label: "명동 · 을지로 · 남대문" },
  { value: "0", unit: "원", label: "온라인 예약 수수료" },
  { value: "2021", unit: "년", label: "명동에서 영업 시작" },
];

export default function HomePage() {
  const best = currenciesByCategory("popular");
  const now = dateTime(new Date().toISOString());

  return (
    <>
      {/* 히어로 */}
      <section className="relative overflow-hidden border-b border-line-dark bg-ink">
        <div className="md-ink-grid absolute inset-0 opacity-40" aria-hidden />
        <div
          className="absolute -right-40 -top-40 h-[32rem] w-[32rem] rounded-full bg-gold opacity-10 blur-3xl"
          aria-hidden
        />
        <div className="md-shell relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-24">
          <div>
            <p className="md-eyebrow text-gold-2">Myeongdong · Since 2021</p>
            <h1 className="mt-4 text-4xl font-bold leading-[1.15] text-on-ink sm:text-5xl lg:text-6xl">
              명동 한복판에서,
              <br />
              <span className="text-gold-2">오늘 환율</span>로 미리 예약하세요.
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-on-ink-muted">
              {BUSINESS.brand}는 16개 통화를 상시 보유합니다. 온라인으로 예약하면 환율이 그 자리에서
              고정되고, 매장에서는 대기 없이 수령만 하시면 됩니다.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/currencies"
                className="rounded-token-sm bg-gold px-6 py-3.5 text-sm font-bold text-gold-contrast transition-opacity hover:opacity-90"
              >
                전체 통화 시세 보기
              </Link>
              <Link
                href="/stores"
                className="rounded-token-sm border border-line-dark px-6 py-3.5 text-sm font-bold text-on-ink transition-colors hover:border-gold-2 hover:text-gold-2"
              >
                매장 찾기
              </Link>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4">
              {FACTS.map((fact) => (
                <div key={fact.label}>
                  <dt className="md-tabular font-display text-3xl font-extrabold text-on-ink">
                    {fact.value}
                    <span className="ml-1 text-sm font-bold text-gold-2">{fact.unit}</span>
                  </dt>
                  <dd className="mt-1 text-xs text-on-ink-muted">{fact.label}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:pl-4">
            <ExchangeCalculator />
            <p className="md-tabular mt-3 text-center text-xs text-on-ink-muted">
              고시 기준 {now} · 예약 시점의 환율이 적용됩니다
            </p>
          </div>
        </div>
      </section>

      {/* 카테고리 */}
      <section className="md-shell py-16 lg:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="md-eyebrow">Categories</p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">여행지별로 골라보세요</h2>
          </div>
          <Link
            href="/currencies"
            className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
          >
            전체 {CURRENCIES.length}개 통화 보기 →
          </Link>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES.map((category) => {
            const list = currenciesByCategory(category.id);
            return (
              <Link
                key={category.id}
                href={`/currencies?tab=${category.id}`}
                className="group flex flex-col justify-between rounded-token-lg border border-line bg-surface p-6 shadow-token-sm transition-all hover:-translate-y-0.5 hover:border-gold hover:shadow-token"
              >
                <div>
                  <div className="flex gap-1 text-2xl" aria-hidden>
                    {list.slice(0, 4).map((c) => (
                      <span key={c.code}>{c.flag}</span>
                    ))}
                  </div>
                  <h3 className="mt-4 text-lg font-bold text-ink">{category.label}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">{category.description}</p>
                </div>
                <p className="md-tabular mt-6 text-xs font-bold text-gold">
                  {list.length}개 통화 <span className="transition-transform group-hover:translate-x-1">→</span>
                </p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 베스트셀러 */}
      <section className="border-y border-line bg-canvas-2 py-16 lg:py-20">
        <div className="md-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="md-eyebrow">Best Sellers</p>
              <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
                이번 주 가장 많이 예약된 통화
              </h2>
              <p className="mt-2 text-sm text-muted">
                명동 본점 기준, 최근 7일간 예약 건수가 많은 순서입니다.
              </p>
            </div>
            <Link
              href="/currencies"
              className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              시세표 전체 보기 →
            </Link>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {best.map((currency) => (
              <CurrencyCard key={currency.code} currency={currency} />
            ))}
          </div>
        </div>
      </section>

      {/* 이용 절차 */}
      <section className="md-shell py-16 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="md-eyebrow">How it works</p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
              예약부터 수령까지, 세 단계면 끝납니다
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              창구에서 환율을 확인하고 기다리는 시간을 없앴습니다. 예약 시점의 환율이 그대로
              적용되므로, 방문 당일 환율이 올라도 손해가 없습니다.
            </p>
            <Link
              href="/pickup"
              className="mt-6 inline-block rounded-token-sm border border-line px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-gold hover:text-gold"
            >
              수령 절차 자세히 보기
            </Link>
          </div>

          <ol className="grid gap-4 sm:grid-cols-3">
            {STEPS.map((step) => (
              <li key={step.no} className="rounded-token-lg border border-line bg-surface p-6">
                <span className="md-tabular font-display text-3xl font-extrabold text-gold-3">
                  {step.no}
                </span>
                <h3 className="mt-3 text-base font-bold text-ink">{step.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 매장 */}
      <section className="border-y border-line bg-surface py-16 lg:py-20">
        <div className="md-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="md-eyebrow">Stores</p>
              <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">명동 일대 4개 지점</h2>
            </div>
            <Link
              href="/stores"
              className="text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              오시는 길 →
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {BRANCHES.map((branch) => (
              <div
                key={branch.id}
                className="rounded-token-lg border border-line bg-canvas p-5 transition-colors hover:border-gold"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-ink">{branch.name}</h3>
                  {branch.featured && (
                    <span className="rounded-token-sm bg-gold-3 px-2 py-0.5 text-[0.65rem] font-bold text-gold-contrast">
                      본점
                    </span>
                  )}
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted">{branch.address}</p>
                <p className="md-tabular mt-3 text-xs font-semibold text-ink">{branch.hours}</p>
                <p className="mt-1 text-xs text-muted">{branch.subway}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 뉴스레터 */}
      <section className="md-shell py-16 lg:py-20">
        <div className="md-guilloche flex flex-col items-start justify-between gap-8 rounded-token-xl border border-line px-8 py-12 lg:flex-row lg:items-center lg:px-12">
          <div className="max-w-lg">
            <p className="md-eyebrow">Rate Alert</p>
            <h2 className="mt-2 text-2xl font-bold text-ink sm:text-3xl">
              환율이 좋아지면 알려드릴까요?
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              관심 통화의 고시 환율이 변동되면 이메일로 안내해 드립니다. 광고성 메일은 보내지
              않습니다.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </>
  );
}
