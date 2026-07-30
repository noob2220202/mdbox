"use client";

import { useCart } from "@/components/site/cart-context";
import { displayRate, toKrw, type Currency } from "@/lib/currencies";
import { foreign, krw, rate } from "@/lib/format";

export function CurrencyCard({ currency }: { currency: Currency }) {
  const { add, openQuickView } = useCart();
  const unitPrice = toKrw(currency.buy, currency.unit);
  const unitLabel = currency.per === 100 ? `100${currency.code}` : `1${currency.code}`;

  return (
    <article
      data-testid={`currency-card-${currency.code}`}
      className="group flex flex-col overflow-hidden rounded-token-lg border border-line bg-surface shadow-token-sm transition-shadow hover:shadow-token"
    >
      <div className="md-guilloche relative flex items-center justify-between border-b border-line px-5 py-6">
        <div>
          <p className="md-tabular font-display text-2xl font-extrabold text-ink">{currency.code}</p>
          <p className="mt-0.5 text-xs font-semibold text-muted">{currency.nameEn}</p>
        </div>
        <span className="text-4xl transition-transform group-hover:scale-110" aria-hidden>
          {currency.flag}
        </span>
        <button
          type="button"
          onClick={() => openQuickView(currency.code)}
          className="absolute bottom-3 right-4 rounded-token-sm border border-line-2 bg-surface/90 px-2.5 py-1 text-[0.7rem] font-bold text-ink opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100"
        >
          퀵뷰
        </button>
      </div>

      <div className="flex flex-1 flex-col px-5 py-5">
        <h3 className="text-base font-bold text-ink">{currency.name}</h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{currency.blurb}</p>

        <dl className="mt-4 space-y-1.5 border-t border-line pt-4 text-sm">
          <div className="flex items-baseline justify-between">
            <dt className="text-xs text-muted">사실 때 ({unitLabel})</dt>
            <dd className="md-tabular font-bold text-ink">{rate(displayRate(currency, "buy"))}</dd>
          </div>
          <div className="flex items-baseline justify-between">
            <dt className="text-xs text-muted">1단위 예약가</dt>
            <dd className="md-tabular text-xs font-semibold text-gold">
              {foreign(currency.unit, currency.code)} · {krw(unitPrice)}
            </dd>
          </div>
        </dl>

        <div className="mt-5 flex gap-2">
          <button
            type="button"
            onClick={() => add(currency.code, 1)}
            data-testid={`add-${currency.code}`}
            className="flex-1 rounded-token-sm bg-ink px-3 py-2.5 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
          >
            바구니 담기
          </button>
          <button
            type="button"
            onClick={() => openQuickView(currency.code)}
            className="rounded-token-sm border border-line px-3 py-2.5 text-sm font-semibold text-text transition-colors hover:border-gold hover:text-gold"
          >
            상세
          </button>
        </div>
      </div>
    </article>
  );
}
