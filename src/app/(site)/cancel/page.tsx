import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "예약 변경 · 환불",
  description: "환전 예약의 변경, 취소, 예약금 환불 규정을 안내합니다.",
};

const RULES = [
  {
    title: "수령일 변경",
    body: "예약 내역 확인 화면에서 요청하시거나 지점으로 연락 주시면 최초 예약일로부터 3일 이내 범위에서 변경해 드립니다. 변경 수수료는 없습니다.",
    tone: "기본",
  },
  {
    title: "수령 전 취소",
    body: "수령일 전날 18시까지 취소하시면 예약금을 전액 환불해 드립니다. 환불은 입금 계좌로 영업일 기준 2~3일 내에 처리됩니다.",
    tone: "전액 환불",
  },
  {
    title: "수령일 당일 취소",
    body: "지점에서 이미 권종을 준비한 상태이므로 예약금의 50%가 차감됩니다. 잔액은 동일하게 계좌로 환불됩니다.",
    tone: "50% 차감",
  },
  {
    title: "미수령",
    body: "연락 없이 수령일로부터 3일이 지나면 예약이 자동 취소되며 예약금은 환불되지 않습니다.",
    tone: "환불 불가",
  },
];

const RETURNS = [
  "수령한 외화의 반품은 불가하며, 재환전(외화 → 원화) 절차로 처리됩니다.",
  "재환전 시에는 그 시점의 파실 때 환율이 적용됩니다.",
  "권종 오류나 훼손권 등 매장 귀책 사유는 수령일로부터 7일 이내 무상 교환해 드립니다.",
  "동전(주화)은 환전 및 재환전 대상이 아닙니다.",
];

export default function CancelPage() {
  return (
    <>
      <PageHero
        eyebrow="Change & Refund"
        title="예약 변경 · 환불 안내"
        description="예약금은 수령 시 전액 돌려드립니다. 부득이하게 일정이 바뀌었을 때의 처리 기준을 미리 확인하세요."
        breadcrumb={[{ href: "/cancel", label: "예약 변경 · 환불" }]}
      />

      <section className="md-shell py-16 lg:py-20">
        <div className="grid gap-4 lg:grid-cols-2">
          {RULES.map((rule) => (
            <div key={rule.title} className="rounded-token-lg border border-line bg-surface p-7">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-base font-bold text-ink">{rule.title}</h2>
                <span className="shrink-0 rounded-full border border-line bg-canvas px-3 py-1 text-xs font-bold text-gold">
                  {rule.tone}
                </span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-muted">{rule.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="rounded-token-lg border border-line bg-surface p-7">
            <h2 className="text-lg font-bold text-ink">수령 후 교환 · 재환전</h2>
            <ul className="mt-4 space-y-2.5">
              {RETURNS.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-text">
                  <span className="mt-1 text-gold" aria-hidden>
                    ·
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="md-guilloche rounded-token-lg border border-line p-7">
            <h2 className="text-lg font-bold text-ink">변경 · 취소 신청</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">
              예약번호와 연락처만 있으면 진행 상황을 확인하고 변경을 요청하실 수 있습니다.
            </p>
            <Link
              href="/order/lookup"
              className="mt-6 inline-block rounded-token-sm bg-ink px-5 py-3 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
            >
              예약 내역 확인하기
            </Link>
            <Link
              href="/faq"
              className="mt-3 block text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              자주 묻는 질문 보기 →
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
