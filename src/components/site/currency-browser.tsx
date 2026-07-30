"use client";

import { useMemo, useState } from "react";

import { useCart } from "@/components/site/cart-context";
import { CurrencyCard } from "@/components/site/currency-card";
import {
  CATEGORIES,
  CURRENCIES,
  currenciesByCategory,
  displayRate,
  toKrw,
  type CurrencyCategory,
} from "@/lib/currencies";
import { foreign, krw, rate } from "@/lib/format";

type Tab = "all" | CurrencyCategory;
type Sort = "recommended" | "code" | "rate-desc" | "rate-asc";
type View = "grid" | "table";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "전체" },
  ...CATEGORIES.map((c) => ({ id: c.id as Tab, label: c.label })),
];

const SORTS: { id: Sort; label: string }[] = [
  { id: "recommended", label: "추천순" },
  { id: "code", label: "통화 코드순" },
  { id: "rate-desc", label: "환율 높은순" },
  { id: "rate-asc", label: "환율 낮은순" },
];

export function CurrencyBrowser({ initialTab = "all" }: { initialTab?: Tab }) {
  const { add, openQuickView } = useCart();
  const [tab, setTab] = useState<Tab>(initialTab);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<Sort>("recommended");
  const [view, setView] = useState<View>("grid");

  const list = useMemo(() => {
    const base = tab === "all" ? CURRENCIES : currenciesByCategory(tab);
    const q = query.trim().toLowerCase();
    const filtered = q
      ? base.filter(
          (c) =>
            c.code.toLowerCase().includes(q) ||
            c.name.toLowerCase().includes(q) ||
            c.nameEn.toLowerCase().includes(q) ||
            c.country.toLowerCase().includes(q),
        )
      : base;

    const sorted = [...filtered];
    if (sort === "code") sorted.sort((a, b) => a.code.localeCompare(b.code));
    if (sort === "rate-desc") sorted.sort((a, b) => displayRate(b, "buy") - displayRate(a, "buy"));
    if (sort === "rate-asc") sorted.sort((a, b) => displayRate(a, "buy") - displayRate(b, "buy"));
    return sorted;
  }, [tab, query, sort]);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setTab(item.id)}
            data-testid={`tab-${item.id}`}
            aria-pressed={tab === item.id}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              tab === item.id
                ? "border-ink bg-ink text-on-ink"
                : "border-line bg-surface text-text hover:border-gold hover:text-gold"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-0 flex-1 sm:max-w-xs">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="통화명 · 코드 · 국가 검색"
            aria-label="통화 검색"
            className="w-full rounded-token-sm border border-line bg-surface py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-gold"
          />
          <svg
            viewBox="0 0 20 20"
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
            fill="none"
            aria-hidden
          >
            <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          aria-label="정렬"
          className="rounded-token-sm border border-line bg-surface px-3.5 py-2.5 text-sm font-semibold text-text outline-none focus:border-gold"
        >
          {SORTS.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label}
            </option>
          ))}
        </select>

        <div className="ml-auto flex rounded-token-sm border border-line p-1" role="group" aria-label="보기 방식">
          {(
            [
              { id: "grid", label: "카드" },
              { id: "table", label: "시세표" },
            ] as const
          ).map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setView(option.id)}
              aria-pressed={view === option.id}
              className={`rounded-token-sm px-3 py-1.5 text-xs font-bold transition-colors ${
                view === option.id ? "bg-ink text-on-ink" : "text-muted hover:text-ink"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-4 text-xs text-muted" data-testid="currency-count">
        {list.length}개 통화
      </p>

      {list.length === 0 ? (
        <p className="mt-10 rounded-token-lg border border-line bg-surface px-6 py-12 text-center text-sm text-muted">
          검색 조건에 맞는 통화가 없습니다. 다른 키워드로 찾아보세요.
        </p>
      ) : view === "grid" ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((currency) => (
            <CurrencyCard key={currency.code} currency={currency} />
          ))}
        </div>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-token-lg border border-line bg-surface">
          <table className="w-full min-w-[52rem] text-sm">
            <thead className="bg-surface-2 text-xs text-muted">
              <tr>
                <th scope="col" className="px-5 py-3.5 text-left font-semibold">통화</th>
                <th scope="col" className="px-5 py-3.5 text-right font-semibold">매매기준율</th>
                <th scope="col" className="px-5 py-3.5 text-right font-semibold">사실 때</th>
                <th scope="col" className="px-5 py-3.5 text-right font-semibold">파실 때</th>
                <th scope="col" className="px-5 py-3.5 text-right font-semibold">1단위 예약가</th>
                <th scope="col" className="px-5 py-3.5 text-right font-semibold">예약</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {list.map((currency) => (
                <tr key={currency.code} className="transition-colors hover:bg-canvas">
                  <th scope="row" className="px-5 py-4 text-left font-normal">
                    <button
                      type="button"
                      onClick={() => openQuickView(currency.code)}
                      className="flex items-center gap-3 text-left"
                    >
                      <span className="text-xl" aria-hidden>
                        {currency.flag}
                      </span>
                      <span>
                        <span className="block font-bold text-ink">{currency.name}</span>
                        <span className="md-tabular block text-xs text-muted">
                          {currency.code} · {currency.per === 100 ? "100단위 고시" : "1단위 고시"}
                        </span>
                      </span>
                    </button>
                  </th>
                  <td className="md-tabular px-5 py-4 text-right text-muted">
                    {rate(displayRate(currency, "base"))}
                  </td>
                  <td className="md-tabular px-5 py-4 text-right font-bold text-ink">
                    {rate(displayRate(currency, "buy"))}
                  </td>
                  <td className="md-tabular px-5 py-4 text-right text-muted">
                    {rate(displayRate(currency, "sell"))}
                  </td>
                  <td className="md-tabular px-5 py-4 text-right text-xs text-ink">
                    <span className="block font-semibold">
                      {krw(toKrw(currency.buy, currency.unit))}
                    </span>
                    <span className="block text-muted">{foreign(currency.unit, currency.code)}</span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => add(currency.code, 1)}
                      data-testid={`table-add-${currency.code}`}
                      className="rounded-token-sm bg-ink px-3.5 py-2 text-xs font-bold text-on-ink transition-colors hover:bg-ink-2"
                    >
                      담기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
