import type { Metadata } from "next";

import { LookupForm } from "@/app/(site)/order/lookup/lookup-form";
import { PageHero } from "@/components/site/page-hero";

export const metadata: Metadata = {
  title: "예약 내역 확인",
  description: "예약번호와 연락처로 환전 예약 진행 상황을 확인하세요.",
};

export default function LookupPage() {
  return (
    <>
      <PageHero
        eyebrow="Order Status"
        title="예약 내역 확인"
        description="접수부터 수령까지 진행 상황을 실시간으로 확인하실 수 있습니다."
        breadcrumb={[
          { href: "/currencies", label: "환전 예약" },
          { href: "/order/lookup", label: "예약 내역 확인" },
        ]}
      />
      <LookupForm />
    </>
  );
}
