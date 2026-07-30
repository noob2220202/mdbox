"use client";

import Link from "next/link";
import { useEffect } from "react";

import { useCart } from "@/components/site/cart-context";
import { displayRate } from "@/lib/currencies";
import { foreign, krw, num, rate } from "@/lib/format";

export function CartDrawer() {
  const { lines, drawerOpen, closeDrawer, setQty, remove, total, deposit, count } = useCart();

  useEffect(() => {
    if (!drawerOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;

  return (
    <div className="fixed inset-0 z-[70]" role="dialog" aria-modal="true" aria-label="환전 바구니">
      <button
        type="button"
        aria-label="닫기"
        onClick={closeDrawer}
        className="absolute inset-0 bg-overlay"
      />

      <aside
        data-testid="cart-drawer"
        className="md-anim-slide-in absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-line bg-surface shadow-token-lg"
      >
        <header className="flex items-center justify-between border-b border-line px-6 py-5">
          <div>
            <p className="md-eyebrow">Exchange Basket</p>
            <h2 className="mt-1 text-lg font-bold text-ink">환전 바구니 ({count})</h2>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="flex h-9 w-9 items-center justify-center rounded-token-sm border border-line text-muted transition-colors hover:border-gold hover:text-gold"
            aria-label="바구니 닫기"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <p className="text-sm text-muted">바구니에 담긴 통화가 없습니다.</p>
            <Link
              href="/currencies"
              onClick={closeDrawer}
              className="rounded-token-sm bg-ink px-5 py-2.5 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
            >
              통화 시세 보러 가기
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.code} className="py-5" data-testid={`cart-line-${line.code}`}>
                  <div className="flex items-start gap-3">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-token-sm bg-canvas text-xl" aria-hidden>
                      {line.currency.flag}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-ink">
                        {line.currency.name}{" "}
                        <span className="md-tabular text-xs font-semibold text-muted">
                          {line.currency.code}
                        </span>
                      </p>
                      <p className="md-tabular mt-0.5 text-xs text-muted">
                        {rate(displayRate(line.currency, "buy"))}원 / {line.currency.per === 100 ? "100" : "1"}
                        {line.currency.code} · 취급 단위 {num(line.currency.unit)}
                      </p>
                      <p className="md-tabular mt-1 text-sm font-semibold text-ink">
                        {foreign(line.amount, line.currency.code)}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => remove(line.code)}
                      className="shrink-0 text-xs font-semibold text-muted underline-offset-4 transition-colors hover:text-down hover:underline"
                    >
                      삭제
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center rounded-token-sm border border-line">
                      <button
                        type="button"
                        onClick={() => setQty(line.code, line.qty - 1)}
                        className="h-9 w-9 text-lg leading-none text-muted transition-colors hover:text-gold"
                        aria-label={`${line.currency.name} 수량 줄이기`}
                      >
                        −
                      </button>
                      <span
                        className="md-tabular w-10 text-center text-sm font-bold text-ink"
                        data-testid={`cart-qty-${line.code}`}
                      >
                        {line.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(line.code, line.qty + 1)}
                        className="h-9 w-9 text-lg leading-none text-muted transition-colors hover:text-gold"
                        aria-label={`${line.currency.name} 수량 늘리기`}
                      >
                        +
                      </button>
                    </div>
                    <p className="md-tabular text-base font-bold text-ink">{krw(line.krw)}</p>
                  </div>
                </li>
              ))}
            </ul>

            <footer className="border-t border-line bg-surface-2 px-6 py-5">
              <dl className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted">환전 합계</dt>
                  <dd className="md-tabular font-bold text-ink" data-testid="cart-total">
                    {krw(total)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted">예약금 (3%)</dt>
                  <dd className="md-tabular font-semibold text-gold">{krw(deposit)}</dd>
                </div>
              </dl>
              <p className="mt-3 text-xs leading-relaxed text-muted">
                예약금은 수령 시 전액 돌려드립니다. 잔액은 매장에서 결제합니다.
              </p>
              <Link
                href="/checkout"
                onClick={closeDrawer}
                className="mt-4 block rounded-token-sm bg-gold px-5 py-3.5 text-center text-sm font-bold text-gold-contrast transition-opacity hover:opacity-90"
              >
                예약 신청서 작성
              </Link>
              <Link
                href="/currencies"
                onClick={closeDrawer}
                className="mt-2 block py-2 text-center text-xs font-semibold text-muted underline-offset-4 hover:underline"
              >
                통화 더 담기
              </Link>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
