import Link from "next/link";

import { CURRENCIES, displayRate } from "@/lib/currencies";
import { rate } from "@/lib/format";

const TICKER = CURRENCIES.filter((c) => c.popular);

export function PromoBar() {
  return (
    <div className="bg-ink text-on-ink">
      <div className="md-shell flex h-10 items-center justify-between gap-4 overflow-hidden">
        <p className="hidden shrink-0 text-xs font-medium text-on-ink sm:block">
          오늘 15시 이전 예약 시 <span className="text-gold-2">명동 본점 당일 수령</span> 가능
        </p>

        <div className="relative flex min-w-0 flex-1 overflow-hidden" aria-hidden>
          <div className="md-marquee-track flex shrink-0 items-center gap-6 whitespace-nowrap">
            {[...TICKER, ...TICKER].map((currency, index) => (
              <span
                key={`${currency.code}-${index}`}
                className="md-tabular flex items-center gap-2 text-xs text-on-ink-muted"
              >
                <span aria-hidden>{currency.flag}</span>
                <span className="font-semibold text-on-ink">{currency.code}</span>
                <span>{rate(displayRate(currency, "buy"))}</span>
              </span>
            ))}
          </div>
        </div>

        <Link
          href="/order/lookup"
          className="hidden shrink-0 text-xs font-semibold text-gold-2 underline-offset-4 hover:underline md:block"
        >
          예약 내역 확인
        </Link>
      </div>
    </div>
  );
}
