import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "이용약관",
  description: "명동 환전소 온라인 환전 예약 서비스의 이용약관입니다.",
};

const ARTICLES = [
  {
    title: "제1조 (목적)",
    body: `이 약관은 ${BUSINESS.legalName}(이하 "회사")이 제공하는 온라인 환전 예약 서비스의 이용 조건과 절차, 회사와 이용자의 권리·의무를 정함을 목적으로 합니다.`,
  },
  {
    title: "제2조 (예약의 성립)",
    body: "이용자가 예약 신청서를 제출하고 회사가 안내한 가상계좌로 예약금을 입금하면 예약이 성립합니다. 예약금 미입금 상태의 신청은 회사가 임의로 취소할 수 있습니다.",
  },
  {
    title: "제3조 (환율의 적용)",
    body: "예약 시점에 화면에 표시된 고시 환율이 적용됩니다. 수령일의 환율 변동은 이미 성립한 예약에 영향을 주지 않습니다.",
  },
  {
    title: "제4조 (예약금)",
    body: "예약금은 환전 금액의 3%(원화 기준, 1,000원 단위 올림)이며 수령 시 전액 반환됩니다. 취소 시점에 따른 차감 기준은 예약 변경·환불 안내에 따릅니다.",
  },
  {
    title: "제5조 (수령)",
    body: "이용자는 예약일로부터 3일 이내에 신분증을 지참해 수령해야 합니다. 기간 내 수령하지 않으면 예약은 자동 취소되며 예약금은 반환되지 않습니다.",
  },
  {
    title: "제6조 (거래 한도)",
    body: "외국환거래규정에 따라 1인 1일 환산 450만원 이하로 신청할 수 있습니다. 초과 거래가 필요한 경우 지점의 사전 확인이 필요합니다.",
  },
  {
    title: "제7조 (회사의 의무)",
    body: "회사는 예약된 통화와 금액을 약정한 일시에 제공하기 위해 노력하며, 재고 사정으로 제공이 어려운 경우 즉시 통지하고 예약금을 전액 반환합니다.",
  },
  {
    title: "제8조 (이용자의 의무)",
    body: "이용자는 본인의 정확한 정보를 제공해야 하며, 타인의 명의로 예약할 수 없습니다. 허위 정보로 인한 불이익은 이용자에게 있습니다.",
  },
  {
    title: "제9조 (분쟁의 해결)",
    body: "이 약관에 명시되지 않은 사항은 관계 법령과 상관례에 따릅니다. 분쟁이 발생한 경우 회사의 소재지를 관할하는 법원을 관할 법원으로 합니다.",
  },
];

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="이용약관"
        description="온라인 환전 예약 서비스를 이용하시기 전에 아래 내용을 확인해 주세요."
        breadcrumb={[{ href: "/terms", label: "이용약관" }]}
      />

      <section className="md-shell py-16 lg:py-20">
        <div className="mx-auto max-w-3xl divide-y divide-line rounded-token-lg border border-line bg-surface">
          {ARTICLES.map((article) => (
            <article key={article.title} className="px-7 py-6">
              <h2 className="text-base font-bold text-ink">{article.title}</h2>
              <p className="mt-2.5 text-sm leading-relaxed text-muted">{article.body}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
