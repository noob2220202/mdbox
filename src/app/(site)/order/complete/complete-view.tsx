"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

import { createStorageStore, hydratedStore } from "@/lib/client-store";
import { RECEIVE_METHOD_LABELS, type OrderItem, type ReceiveMethod } from "@/lib/types";
import { dateTime, foreign, krw } from "@/lib/format";

type LastOrder = {
  orderNo: string;
  createdAt: string;
  total: number;
  deposit: number;
  receiveDate: string;
  receiveTime: string;
  receiveMethod: ReceiveMethod;
  address: string;
  name: string;
  items: OrderItem[];
};

function parseOrder(raw: string | null): LastOrder | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw) as LastOrder;
  } catch {
    return null;
  }
}

const lastOrderStore = createStorageStore<LastOrder | null>(
  "session",
  "md-last-order",
  parseOrder,
  null,
);

export function CompleteView() {
  const order = useSyncExternalStore(
    lastOrderStore.subscribe,
    lastOrderStore.getSnapshot,
    lastOrderStore.getServerSnapshot,
  );
  const loaded = useSyncExternalStore(
    hydratedStore.subscribe,
    hydratedStore.getSnapshot,
    hydratedStore.getServerSnapshot,
  );

  if (!loaded) {
    return <div className="md-shell py-24 text-center text-sm text-muted">불러오는 중입니다...</div>;
  }

  if (!order) {
    return (
      <div className="md-shell py-20">
        <div className="mx-auto max-w-lg rounded-token-lg border border-line bg-surface px-8 py-14 text-center">
          <h2 className="text-lg font-bold text-ink">표시할 예약 정보가 없습니다</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            예약번호와 연락처로 언제든 진행 상황을 확인하실 수 있습니다.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Link
              href="/order/lookup"
              className="rounded-token-sm bg-ink px-5 py-3 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
            >
              예약 내역 확인
            </Link>
            <Link
              href="/currencies"
              className="rounded-token-sm border border-line px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-gold hover:text-gold"
            >
              통화 시세 보기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="md-shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <div className="rounded-token-lg border border-line bg-surface p-8 text-center">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-up-soft text-up">
            <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" aria-hidden>
              <path
                d="m5 12.5 4.5 4.5L19 7.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1 className="mt-5 text-2xl font-bold text-ink">예약이 접수되었습니다</h1>
          <p className="mt-2 text-sm text-muted">
            {order.name}님, 아래 예약번호로 진행 상황을 확인하실 수 있습니다.
          </p>
          <p
            className="md-tabular mt-6 inline-block rounded-token border border-gold bg-gold-3/40 px-6 py-3 font-display text-xl font-extrabold text-ink"
            data-testid="order-no"
          >
            {order.orderNo}
          </p>
          <p className="md-tabular mt-3 text-xs text-muted">접수 {dateTime(order.createdAt)}</p>
        </div>

        <div className="mt-6 rounded-token-lg border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-base font-bold text-ink">예약 상세</h2>

          <ul className="mt-4 divide-y divide-line">
            {order.items.map((item) => (
              <li key={item.code} className="flex items-start justify-between gap-3 py-3">
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {item.name} × {item.qty}
                  </p>
                  <p className="md-tabular mt-0.5 text-xs text-muted">
                    {foreign(item.amount, item.code)}
                  </p>
                </div>
                <p className="md-tabular text-sm font-bold text-ink">{krw(item.krw)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2.5 border-t border-line pt-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">수령 방법</dt>
              <dd className="text-right font-semibold text-ink">
                {RECEIVE_METHOD_LABELS[order.receiveMethod]}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="shrink-0 text-muted">
                {order.receiveMethod === "pickup" ? "수령 지점" : "배송지"}
              </dt>
              <dd className="text-right text-ink">{order.address}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">수령 일시</dt>
              <dd className="md-tabular text-right font-semibold text-ink">
                {order.receiveDate} {order.receiveTime}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-line pt-3">
              <dt className="text-muted">환전 합계</dt>
              <dd className="md-tabular text-right font-bold text-ink">{krw(order.total)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">입금하실 예약금</dt>
              <dd className="md-tabular text-right text-lg font-extrabold text-gold">
                {krw(order.deposit)}
              </dd>
            </div>
          </dl>

          <p className="mt-5 rounded-token-sm bg-surface-2 px-4 py-3.5 text-xs leading-relaxed text-muted">
            예약금 입금 안내는 등록하신 연락처로 발송됩니다. 입금이 확인되면 상태가 결제완료로
            변경되며, 수령 시 예약금은 전액 돌려드립니다.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/order/lookup"
              className="flex-1 rounded-token-sm bg-ink px-5 py-3 text-center text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
            >
              예약 내역 확인
            </Link>
            <Link
              href="/pickup"
              className="flex-1 rounded-token-sm border border-line px-5 py-3 text-center text-sm font-semibold text-text transition-colors hover:border-gold hover:text-gold"
            >
              수령 안내 보기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
