import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { BUSINESS, businessFields } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description: "명동 환전소가 수집하는 개인정보 항목과 이용 목적, 보유 기간을 안내합니다.",
};

const SECTIONS = [
  {
    title: "1. 수집하는 개인정보 항목",
    items: [
      "필수: 성명, 연락처, 이메일 주소, 수령 지점 또는 배송 주소",
      "환전 예약 처리 과정에서 생성되는 정보: 예약번호, 예약 통화·금액, 수령 일시",
      "환율 알림 신청 시: 이메일 주소",
    ],
  },
  {
    title: "2. 개인정보의 이용 목적",
    items: [
      "환전 예약 접수, 준비 상태 안내, 수령 확인",
      "예약 변경·취소 및 예약금 환불 처리",
      "외국환거래규정에 따른 거래 확인 및 보고",
      "환율 알림 신청자에 대한 고시 환율 변동 안내",
    ],
  },
  {
    title: "3. 보유 및 이용 기간",
    items: [
      "환전 예약 정보: 관련 법령에 따라 거래 종료일로부터 5년간 보관 후 파기",
      "환율 알림 수신 정보: 수신 거부 요청 시 지체 없이 파기",
      "보유 기간이 끝난 정보는 복구할 수 없는 방법으로 삭제합니다",
    ],
  },
  {
    title: "4. 제3자 제공",
    items: [
      "법령에 근거하거나 수사기관의 적법한 요청이 있는 경우를 제외하고 제3자에게 제공하지 않습니다",
      "안심 배송을 선택하신 경우, 배송에 필요한 최소 정보만 배송 위탁사에 제공합니다",
    ],
  },
  {
    title: "5. 정보주체의 권리",
    items: [
      "언제든지 개인정보의 열람, 정정, 삭제, 처리 정지를 요청하실 수 있습니다",
      "요청은 이메일로 접수하며, 접수일로부터 10일 이내에 처리합니다",
    ],
  },
  {
    title: "6. 안전성 확보 조치",
    items: [
      "예약 정보는 접근 권한이 부여된 담당자만 조회할 수 있습니다",
      "관리자 계정은 별도 인증 절차를 거치며 접속 세션은 8시간 후 만료됩니다",
      "비밀번호는 복호화가 불가능한 방식으로 저장합니다",
    ],
  },
];

export default function PrivacyPage() {
  const fields = businessFields();

  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="개인정보처리방침"
        description={`${BUSINESS.legalName}은 환전 예약에 필요한 최소한의 정보만 수집하며, 목적이 달성되면 지체 없이 파기합니다.`}
        breadcrumb={[{ href: "/privacy", label: "개인정보처리방침" }]}
      />

      <section className="md-shell py-16 lg:py-20">
        <div className="mx-auto max-w-3xl space-y-8">
          {SECTIONS.map((section) => (
            <div key={section.title} className="rounded-token-lg border border-line bg-surface p-7">
              <h2 className="text-base font-bold text-ink">{section.title}</h2>
              <ul className="mt-4 space-y-2">
                {section.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-muted">
                    <span className="mt-1 text-gold" aria-hidden>
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="rounded-token-lg border border-line bg-surface-2 p-7">
            <h2 className="text-base font-bold text-ink">7. 문의처</h2>
            <dl className="mt-4 space-y-2">
              {fields.map((field) => (
                <div key={field.label} className="flex gap-4 text-sm">
                  <dt className="w-32 shrink-0 text-xs font-semibold text-muted">{field.label}</dt>
                  <dd className="text-text">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </>
  );
}
