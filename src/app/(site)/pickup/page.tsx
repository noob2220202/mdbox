import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { BRANCHES } from "@/lib/branches";

export const metadata: Metadata = {
  title: "수령 안내",
  description: "지점 수령과 안심 배송 절차, 준비물과 소요 시간을 안내합니다.",
};

const STEPS = [
  {
    no: "01",
    title: "예약금 입금",
    body: "신청 직후 안내되는 가상계좌로 예약금(환전 금액의 3%)을 입금하시면 예약이 확정됩니다. 가상계좌는 발급 후 20분간 유효합니다.",
  },
  {
    no: "02",
    title: "준비 완료 안내",
    body: "지점에서 권종을 확인해 준비를 마치면 문자로 안내드립니다. 통화에 따라 준비에 하루가 걸릴 수 있습니다.",
  },
  {
    no: "03",
    title: "방문 · 수령",
    body: "예약번호와 신분증을 지참해 방문하시면 예약 창구에서 바로 수령하실 수 있습니다. 잔액은 현금으로 결제합니다.",
  },
];

const CHECKLIST = [
  "예약번호 (문자 또는 예약 내역 확인 화면)",
  "본인 명의 신분증 (주민등록증 · 운전면허증 · 여권)",
  "환전 잔액에 해당하는 현금",
  "대리 수령 시 위임장과 대리인 신분증",
];

export default function PickupPage() {
  return (
    <>
      <PageHero
        eyebrow="Pickup & Delivery"
        title="수령 안내"
        description="지점 수령은 수수료가 없고, 안심 배송은 본인 확인 후 등기로 발송합니다. 예약 확정부터 수령까지의 절차를 안내합니다."
        breadcrumb={[{ href: "/pickup", label: "수령 안내" }]}
      />

      <section className="md-shell py-16 lg:py-20">
        <ol className="grid gap-4 lg:grid-cols-3">
          {STEPS.map((step) => (
            <li key={step.no} className="rounded-token-lg border border-line bg-surface p-7">
              <span className="md-tabular font-display text-3xl font-extrabold text-gold-3">
                {step.no}
              </span>
              <h2 className="mt-3 text-base font-bold text-ink">{step.title}</h2>
              <p className="mt-2 text-xs leading-relaxed text-muted">{step.body}</p>
            </li>
          ))}
        </ol>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-token-lg border border-line bg-surface p-7">
            <h2 className="text-lg font-bold text-ink">지점 수령</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              수수료가 없고 가장 빠른 방법입니다. 예약 창구가 따로 운영되어 대기 시간이 거의
              없습니다.
            </p>
            <ul className="mt-5 space-y-2 text-xs leading-relaxed text-muted">
              <li>· 수령 가능 시간: 각 지점 영업시간 내</li>
              <li>· 소요 시간: 신분증 확인 포함 평균 3분</li>
              <li>· 수령 수수료: 없음</li>
              <li>· 15시 이전 예약 시 본점 당일 수령 가능</li>
            </ul>
            <Link
              href="/stores"
              className="mt-6 inline-block text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              지점별 영업시간 보기 →
            </Link>
          </div>

          <div className="rounded-token-lg border border-line bg-surface p-7">
            <h2 className="text-lg font-bold text-ink">안심 배송</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              방문이 어려우신 경우 본인 확인 절차를 거쳐 등기로 발송합니다.
            </p>
            <ul className="mt-5 space-y-2 text-xs leading-relaxed text-muted">
              <li>· 배송료: 건당 3,000원 (예약금과 함께 결제)</li>
              <li>· 발송: 예약금 입금 확인 후 영업일 기준 1~2일</li>
              <li>· 수령: 본인 확인 후 전달 (대리 수령 불가)</li>
              <li>· 환산 100만원 이상은 지점 수령만 가능합니다</li>
            </ul>
            <Link
              href="/checkout"
              className="mt-6 inline-block text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              예약 신청서 작성하기 →
            </Link>
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <div className="rounded-token-lg border border-line bg-surface p-7">
            <h2 className="text-lg font-bold text-ink">수령 준비물</h2>
            <ul className="mt-4 space-y-2.5">
              {CHECKLIST.map((item) => (
                <li key={item} className="flex gap-2.5 text-sm text-text">
                  <span className="mt-0.5 text-gold" aria-hidden>
                    ✓
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="overflow-x-auto rounded-token-lg border border-line bg-surface">
            <table className="w-full min-w-[32rem] text-sm">
              <caption className="border-b border-line px-6 py-4 text-left text-base font-bold text-ink">
                지점별 수령 가능 시간
              </caption>
              <thead className="bg-surface-2 text-xs text-muted">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">지점</th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">영업시간</th>
                  <th scope="col" className="px-6 py-3 text-left font-semibold">휴무</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {BRANCHES.map((branch) => (
                  <tr key={branch.id}>
                    <th scope="row" className="px-6 py-4 text-left font-bold text-ink">
                      {branch.name}
                    </th>
                    <td className="md-tabular px-6 py-4 text-xs text-muted">{branch.hours}</td>
                    <td className="px-6 py-4 text-xs text-muted">{branch.holiday}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
