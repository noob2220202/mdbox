import type { Metadata } from "next";

import { CompleteView } from "@/app/(site)/order/complete/complete-view";

export const metadata: Metadata = {
  title: "예약 접수 완료",
  robots: { index: false, follow: false },
};

export default function OrderCompletePage() {
  return <CompleteView />;
}
