import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { CURRENCIES, displayRate, toKrw } from "@/lib/currencies";
import { foreign, krw, num, rate } from "@/lib/format";

export const metadata: Metadata = {
  title: "권종 가이드",
  description: "통화별 취급 권종과 예약 단위, 고시 기준을 한눈에 확인하세요.",
};

const TIPS = [
  {
    title: "고액권 vs 소액권",
    body: "호텔·항공 결제는 고액권이 편하지만, 현지 시장·택시에서는 소액권이 필요합니다. 요청 사항에 적어주시면 가능한 범위에서 맞춰드립니다.",
  },
  {
    title: "신권 요청",
    body: "중국 위안과 일부 동남아 통화는 구권이 현지에서 거절되는 경우가 있어 신권 위주로 보유합니다.",
  },
  {
    title: "폴리머 지폐",
    body: "호주 달러, 뉴질랜드 달러, 영국 파운드 일부는 폴리머 재질입니다. 접힘에 강하지만 열에 약하니 보관에 유의하세요.",
  },
];

export default function DenominationsPage() {
  return (
    <>
      <PageHero
        eyebrow="Denomination Guide"
        title="권종 가이드"
        description="통화마다 예약 단위와 취급 권종이 다릅니다. 예약 전에 어떤 지폐를 받게 되는지 미리 확인하세요."
        breadcrumb={[{ href: "/denominations", label: "권종 가이드" }]}
      />

      <section className="md-shell py-16 lg:py-20">
        <div className="overflow-x-auto rounded-token-lg border border-line bg-surface">
          <table className="w-full min-w-[56rem] text-sm">
            <thead className="bg-surface-2 text-xs text-muted">
              <tr>
                <th scope="col" className="px-6 py-4 text-left font-semibold">통화</th>
                <th scope="col" className="px-6 py-4 text-left font-semibold">고시 기준</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">사실 때</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">예약 단위</th>
                <th scope="col" className="px-6 py-4 text-right font-semibold">1단위 예약가</th>
                <th scope="col" className="px-6 py-4 text-left font-semibold">취급 권종</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {CURRENCIES.map((currency) => (
                <tr key={currency.code} className="transition-colors hover:bg-canvas">
                  <th scope="row" className="px-6 py-4 text-left font-normal">
                    <span className="flex items-center gap-3">
                      <span className="text-xl" aria-hidden>
                        {currency.flag}
                      </span>
                      <span>
                        <span className="block font-bold text-ink">{currency.name}</span>
                        <span className="md-tabular block text-xs text-muted">{currency.code}</span>
                      </span>
                    </span>
                  </th>
                  <td className="md-tabular px-6 py-4 text-xs text-muted">
                    {currency.per === 100 ? `100${currency.code} 당` : `1${currency.code} 당`}
                  </td>
                  <td className="md-tabular px-6 py-4 text-right font-bold text-ink">
                    {rate(displayRate(currency, "buy"))}
                  </td>
                  <td className="md-tabular px-6 py-4 text-right text-xs text-muted">
                    {num(currency.unit)} {currency.code}
                  </td>
                  <td className="md-tabular px-6 py-4 text-right text-xs">
                    <span className="block font-semibold text-ink">
                      {krw(toKrw(currency.buy, currency.unit))}
                    </span>
                    <span className="block text-muted">{foreign(currency.unit, currency.code)}</span>
                  </td>
                  <td className="px-6 py-4 text-xs leading-relaxed text-muted">
                    {currency.notes.join(" · ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {TIPS.map((tip) => (
            <div key={tip.title} className="rounded-token-lg border border-line bg-surface p-7">
              <h2 className="text-base font-bold text-ink">{tip.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted">{tip.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-6 rounded-token-lg border border-line bg-surface-2 px-6 py-5 text-xs leading-relaxed text-muted">
          권종은 지점 보유 현황에 따라 제공되며, 특정 권종을 보장해 드리지는 않습니다. 반드시 특정
          권종이 필요하신 경우 예약 전에 지점으로 문의해 주세요.
        </p>
      </section>
    </>
  );
}
