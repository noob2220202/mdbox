import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "자주 묻는 질문",
  description: "환전 예약, 수령, 환율 적용에 대해 가장 많이 받는 질문을 모았습니다.",
};

const GROUPS = [
  {
    title: "예약",
    items: [
      {
        q: "예약하면 환율이 정말 고정되나요?",
        a: "네. 예약 화면에 표시된 환율이 그대로 적용됩니다. 방문일에 환율이 올라도 예약 시점 환율로 정산하며, 반대로 내려가더라도 예약 환율이 유지됩니다.",
      },
      {
        q: "하루에 얼마까지 예약할 수 있나요?",
        a: "1인 1일 환산 450만원 이하로 신청해 주세요. 그 이상은 지점으로 문의하시면 사전 상담 후 처리해 드립니다.",
      },
      {
        q: "여러 통화를 한 번에 예약할 수 있나요?",
        a: "가능합니다. 바구니에 여러 통화를 담아 한 건으로 신청하시면 하나의 예약번호로 관리됩니다.",
      },
      {
        q: "예약금은 왜 필요한가요?",
        a: "지점이 미리 권종을 확보하기 위한 확인 절차입니다. 환전 금액의 3%이며 수령 시 전액 돌려드립니다.",
      },
    ],
  },
  {
    title: "수령",
    items: [
      {
        q: "당일 수령이 가능한가요?",
        a: "15시 이전에 예약하시면 명동 본점 기준 당일 수령이 가능합니다. 일부 통화는 재고 사정에 따라 익일 수령으로 안내될 수 있습니다.",
      },
      {
        q: "가족이 대신 받아도 되나요?",
        a: "지점 수령은 위임장과 대리인 신분증을 지참하시면 가능합니다. 안심 배송은 본인 확인이 필요해 대리 수령이 불가합니다.",
      },
      {
        q: "잔액은 어떻게 결제하나요?",
        a: "수령 시 현금으로 결제합니다. 반드시 현금을 지참해 주세요.",
      },
    ],
  },
  {
    title: "환율 · 권종",
    items: [
      {
        q: "엔화 환율은 왜 100엔 기준인가요?",
        a: "일본 엔, 베트남 동, 인도네시아 루피아는 단위가 작아 100단위로 고시하는 것이 국내 관행입니다. 계산은 실제 금액 기준으로 정확히 처리됩니다.",
      },
      {
        q: "원하는 권종을 지정할 수 있나요?",
        a: "요청 사항에 적어주시면 보유 범위 내에서 맞춰드립니다. 다만 특정 권종을 보장해 드리지는 않습니다.",
      },
      {
        q: "동전도 환전되나요?",
        a: "동전(주화)은 환전 대상이 아닙니다. 지폐만 취급합니다.",
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="FAQ"
        title="자주 묻는 질문"
        description="예약 전에 확인하면 좋은 내용을 모았습니다. 여기에 없는 질문은 대표전화로 문의해 주세요."
        breadcrumb={[{ href: "/faq", label: "자주 묻는 질문" }]}
      />

      <section className="md-shell py-16 lg:py-20">
        <div className="space-y-10">
          {GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="text-lg font-bold text-ink">{group.title}</h2>
              <div className="mt-4 divide-y divide-line overflow-hidden rounded-token-lg border border-line bg-surface">
                {group.items.map((item) => (
                  <details key={item.q} className="group px-6 py-5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold text-ink">
                      {item.q}
                      <span
                        className="shrink-0 text-lg text-gold transition-transform group-open:rotate-45"
                        aria-hidden
                      >
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="md-guilloche mt-10 flex flex-col items-start justify-between gap-6 rounded-token-lg border border-line px-8 py-10 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold text-ink">원하는 답을 못 찾으셨나요?</h2>
            <p className="mt-2 text-sm text-muted">
              예약 진행 상황은 예약번호로 바로 확인하실 수 있습니다.
            </p>
          </div>
          <Link
            href="/order/lookup"
            className="shrink-0 rounded-token-sm bg-ink px-5 py-3 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
          >
            예약 내역 확인
          </Link>
        </div>
      </section>
    </>
  );
}
