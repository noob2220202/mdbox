"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { useCart } from "@/components/site/cart-context";
import { displayRate, getCurrency, toKrw, type Currency } from "@/lib/currencies";
import { foreign, krw, num, rate } from "@/lib/format";

export function QuickViewModal() {
  const { quickView, closeQuickView } = useCart();

  useEffect(() => {
    if (!quickView) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeQuickView();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [quickView, closeQuickView]);

  if (!quickView) return null;
  const currency = getCurrency(quickView);
  if (!currency) return null;

  // key 를 통화 코드로 주어, 다른 통화를 열면 수량이 자동으로 초기화됩니다.
  return <QuickViewPanel key={currency.code} currency={currency} />;
}

function QuickViewPanel({ currency }: { currency: Currency }) {
  const { closeQuickView, add } = useCart();
  const [qty, setQty] = useState(1);

  const amount = currency.unit * qty;
  const price = toKrw(currency.buy, amount);
  const unitLabel = currency.per === 100 ? `100${currency.code}` : `1${currency.code}`;

  return (
    <div
      className="fixed inset-0 z-[75] flex items-end justify-center p-0 sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-label={`${currency.name} 상세 정보`}
    >
      <button type="button" aria-label="닫기" onClick={closeQuickView} className="absolute inset-0 bg-overlay" />

      <div
        data-testid="quick-view"
        className="md-anim-pop relative w-full max-w-2xl overflow-hidden rounded-t-token-xl border border-line bg-surface shadow-token-lg sm:rounded-token-xl"
      >
        <button
          type="button"
          onClick={closeQuickView}
          aria-label="퀵뷰 닫기"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-token-sm border border-line bg-surface text-muted transition-colors hover:border-gold hover:text-gold"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
            <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </button>

        <div className="grid gap-0 sm:grid-cols-[0.9fr_1.1fr]">
          <div className="md-guilloche flex flex-col items-center justify-center gap-3 border-b border-line px-6 py-10 sm:border-b-0 sm:border-r">
            <span className="text-6xl" aria-hidden>
              {currency.flag}
            </span>
            <p className="md-tabular font-display text-3xl font-extrabold text-ink">{currency.code}</p>
            <p className="text-sm font-semibold text-muted">{currency.nameEn}</p>
          </div>

          <div className="px-6 py-7">
            <p className="md-eyebrow">{currency.country}</p>
            <h2 className="mt-1 text-2xl font-bold text-ink">{currency.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{currency.blurb}</p>

            <dl className="mt-5 grid grid-cols-2 gap-3">
              <div className="rounded-token-sm border border-line bg-canvas px-3.5 py-3">
                <dt className="text-xs font-semibold text-muted">사실 때 ({unitLabel})</dt>
                <dd className="md-tabular mt-1 text-lg font-bold text-ink">
                  {rate(displayRate(currency, "buy"))}
                </dd>
              </div>
              <div className="rounded-token-sm border border-line bg-canvas px-3.5 py-3">
                <dt className="text-xs font-semibold text-muted">파실 때 ({unitLabel})</dt>
                <dd className="md-tabular mt-1 text-lg font-bold text-muted">
                  {rate(displayRate(currency, "sell"))}
                </dd>
              </div>
            </dl>

            <ul className="mt-4 space-y-1.5">
              {currency.notes.map((note) => (
                <li key={note} className="flex gap-2 text-xs text-muted">
                  <span className="text-gold" aria-hidden>
                    ·
                  </span>
                  {note}
                </li>
              ))}
            </ul>

            <div className="mt-6 rounded-token border border-line bg-surface-2 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-semibold text-ink">
                  수량{" "}
                  <span className="text-xs font-normal text-muted">
                    ({num(currency.unit)} {currency.code} / 단위)
                  </span>
                </span>
                <div className="flex items-center rounded-token-sm border border-line bg-surface">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-9 w-9 text-lg leading-none text-muted transition-colors hover:text-gold"
                    aria-label="수량 줄이기"
                  >
                    −
                  </button>
                  <span className="md-tabular w-10 text-center text-sm font-bold text-ink">{qty}</span>
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.min(999, q + 1))}
                    className="h-9 w-9 text-lg leading-none text-muted transition-colors hover:text-gold"
                    aria-label="수량 늘리기"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="mt-3 flex items-baseline justify-between">
                <span className="md-tabular text-sm font-semibold text-muted">
                  {foreign(amount, currency.code)}
                </span>
                <span className="md-tabular text-xl font-extrabold text-ink">{krw(price)}</span>
              </div>
            </div>

            <div className="mt-4 flex gap-2">
              <button
                type="button"
                onClick={() => {
                  add(currency.code, qty);
                  closeQuickView();
                }}
                className="flex-1 rounded-token-sm bg-gold px-4 py-3 text-sm font-bold text-gold-contrast transition-opacity hover:opacity-90"
              >
                바구니에 담기
              </button>
              <Link
                href="/denominations"
                onClick={closeQuickView}
                className="rounded-token-sm border border-line px-4 py-3 text-sm font-semibold text-text transition-colors hover:border-gold hover:text-gold"
              >
                권종 안내
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
