import type { Metadata } from "next";

import { CheckoutForm, type ReceiveDateOption } from "@/app/(site)/checkout/checkout-form";
import { PageHero } from "@/components/site/page-hero";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "예약 신청서",
  description: "바구니에 담은 통화로 환전 예약을 신청합니다.",
};

const WEEKDAY = ["일", "월", "화", "수", "목", "금", "토"];

/** 오늘부터 3일간의 수령 가능일 (KST 기준) — 서버에서 계산해 하이드레이션 차이를 없앱니다. */
function receiveDates(): ReceiveDateOption[] {
  const options: ReceiveDateOption[] = [];
  for (let i = 0; i < 3; i += 1) {
    const kst = new Date(Date.now() + (9 + i * 24) * 60 * 60 * 1000);
    const value = kst.toISOString().slice(0, 10);
    const suffix = i === 0 ? " · 오늘" : i === 1 ? " · 내일" : "";
    options.push({ value, label: `${value} (${WEEKDAY[kst.getUTCDay()]})${suffix}` });
  }
  return options;
}

export default function CheckoutPage() {
  return (
    <>
      <PageHero
        eyebrow="Reservation"
        title="환전 예약 신청서"
        description="예약 시점의 환율이 그대로 확정됩니다. 신청 후 안내되는 가상계좌로 예약금을 입금하시면 예약이 확정됩니다."
        breadcrumb={[
          { href: "/currencies", label: "환전 예약" },
          { href: "/checkout", label: "예약 신청서" },
        ]}
      />
      <CheckoutForm dateOptions={receiveDates()} />
    </>
  );
}
