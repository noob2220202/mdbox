"use client";

import { useState } from "react";

import { useCart } from "@/components/site/cart-context";
import { CURRENCIES, depositFor, getCurrency, toKrw } from "@/lib/currencies";
import { foreign, krw, num, rate } from "@/lib/format";

type Direction = "buy" | "sell";

export function ExchangeCalculator() {
  const { add } = useCart();
  const [code, setCode] = useState("USD");
  const [direction, setDirection] = useState<Direction>("buy");
  const [qty, setQty] = useState(5);

  const currency = getCurrency(code) ?? CURRENCIES[0];
  const amount = currency.unit * qty;
  const appliedRate = direction === "buy" ? currency.buy : currency.sell;
  const result = toKrw(appliedRate, amount);
  const unitLabel = currency.per === 100 ? `100${currency.code}` : `1${currency.code}`;

  return (
    <div className="w-full rounded-token-lg border border-line bg-surface p-6 shadow-token-lg sm:p-7">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="md-eyebrow">Rate Calculator</p>
          <h2 className="mt-1 text-lg font-bold text-ink">환전 금액 계산</h2>
        </div>
        <div className="flex rounded-token-sm border border-line p-1" role="group" aria-label="환전 방향">
          {(
            [
              { id: "buy", label: "사실 때" },
              { id: "sell", label: "파실 때" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setDirection(tab.id)}
              aria-pressed={direction === tab.id}
              className={`rounded-token-sm px-3 py-1.5 text-xs font-bold transition-colors ${
                direction === tab.id ? "bg-ink text-on-ink" : "text-muted hover:text-ink"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-xs font-semibold text-muted">통화 선택</span>
          <select
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="mt-1.5 w-full rounded-token-sm border border-line bg-surface px-3.5 py-3 text-sm font-semibold text-ink outline-none focus:border-gold"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.flag} {c.name} ({c.code})
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="text-xs font-semibold text-muted">
            수량 · 단위 {num(currency.unit)} {currency.code}
          </span>
          <div className="mt-1.5 flex items-center rounded-token-sm border border-line bg-surface">
            <button
              type="button"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              className="h-12 w-12 text-xl leading-none text-muted transition-colors hover:text-gold"
              aria-label="수량 줄이기"
            >
              −
            </button>
            <input
              type="number"
              min={1}
              max={999}
              value={qty}
              onChange={(e) => setQty(Math.min(999, Math.max(1, Number(e.target.value) || 1)))}
              className="md-tabular w-full min-w-0 border-0 bg-transparent text-center text-base font-bold text-ink outline-none"
              aria-label="수량"
            />
            <button
              type="button"
              onClick={() => setQty((q) => Math.min(999, q + 1))}
              className="h-12 w-12 text-xl leading-none text-muted transition-colors hover:text-gold"
              aria-label="수량 늘리기"
            >
              +
            </button>
          </div>
        </label>
      </div>

      <dl className="mt-5 space-y-2 border-t border-line pt-5 text-sm">
        <div className="flex justify-between">
          <dt className="text-muted">
            적용 환율 <span className="text-xs">({unitLabel})</span>
          </dt>
          <dd className="md-tabular font-semibold text-ink">
            {rate(appliedRate * currency.per)}원
          </dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">외화 금액</dt>
          <dd className="md-tabular font-semibold text-ink">{foreign(amount, currency.code)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-line pt-3">
          <dt className="font-bold text-ink">{direction === "buy" ? "지급하실 금액" : "받으실 금액"}</dt>
          <dd className="md-tabular text-2xl font-extrabold text-gold" data-testid="calc-result">
            {krw(result)}
          </dd>
        </div>
        {direction === "buy" && (
          <div className="flex justify-between text-xs">
            <dt className="text-muted">예약금 (3%, 수령 시 환급)</dt>
            <dd className="md-tabular font-semibold text-muted">{krw(depositFor(result))}</dd>
          </div>
        )}
      </dl>

      {direction === "buy" ? (
        <button
          type="button"
          onClick={() => add(currency.code, qty)}
          className="mt-5 w-full rounded-token-sm bg-gold px-5 py-3.5 text-sm font-bold text-gold-contrast transition-opacity hover:opacity-90"
        >
          이 조건으로 바구니에 담기
        </button>
      ) : (
        <p className="mt-5 rounded-token-sm border border-line bg-surface-2 px-4 py-3.5 text-xs leading-relaxed text-muted">
          외화를 파실 때는 온라인 예약 없이 매장에 방문해 주세요. 신분증을 지참하시면 위 환율로 바로
          매입해 드립니다.
        </p>
      )}
    </div>
  );
}
