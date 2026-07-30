"use client";

import { useState, type FormEvent } from "react";

import { StatusBadge } from "@/components/ui/status-badge";
import { dateTime, foreign, krw } from "@/lib/format";
import { RECEIVE_METHOD_LABELS, type OrderItem, type OrderStatus, type ReceiveMethod } from "@/lib/types";

type LookupResult = {
  orderNo: string;
  createdAt: string;
  status: OrderStatus;
  name: string;
  address: string;
  receiveMethod: ReceiveMethod;
  receiveDate: string;
  receiveTime: string;
  items: OrderItem[];
  total: number;
  deposit: number;
  memo: string;
};

export function LookupForm() {
  const [orderNo, setOrderNo] = useState("");
  const [phone, setPhone] = useState("");
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setResult(null);
    setLoading(true);
    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo, phone }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; order?: LookupResult };
      if (!res.ok || !data.ok || !data.order) {
        setError(data.error ?? "조회에 실패했습니다.");
        return;
      }
      setResult(data.order);
    } catch {
      setError("네트워크 오류로 조회하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="md-shell py-12 lg:py-16">
      <div className="mx-auto max-w-2xl">
        <form onSubmit={onSubmit} className="rounded-token-lg border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-bold text-ink">예약 내역 조회</h2>
          <p className="mt-1 text-xs text-muted">
            예약 시 발급된 예약번호와 등록하신 연락처를 입력해 주세요.
          </p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-muted">예약번호</span>
              <input
                value={orderNo}
                onChange={(e) => setOrderNo(e.target.value)}
                placeholder="MD20260101-001"
                className="mt-1.5 w-full rounded-token-sm border border-line bg-surface px-3.5 py-3 text-sm outline-none focus:border-gold"
              />
            </label>
            <label className="block">
              <span className="text-xs font-semibold text-muted">연락처</span>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                inputMode="tel"
                placeholder="010-0000-0000"
                className="mt-1.5 w-full rounded-token-sm border border-line bg-surface px-3.5 py-3 text-sm outline-none focus:border-gold"
              />
            </label>
          </div>

          {error && (
            <p role="alert" className="mt-4 rounded-token-sm bg-down-soft px-3.5 py-3 text-xs font-medium text-down">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="mt-5 w-full rounded-token-sm bg-ink px-5 py-3.5 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2 disabled:opacity-60"
          >
            {loading ? "조회 중..." : "조회하기"}
          </button>
        </form>

        {result && (
          <div className="md-anim-fade-up mt-6 rounded-token-lg border border-line bg-surface p-6 sm:p-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="md-eyebrow">Reservation</p>
                <p className="md-tabular mt-1 font-display text-xl font-extrabold text-ink">
                  {result.orderNo}
                </p>
              </div>
              <StatusBadge status={result.status} />
            </div>

            <ul className="mt-5 divide-y divide-line border-t border-line pt-2">
              {result.items.map((item) => (
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
                <dt className="text-muted">접수 일시</dt>
                <dd className="md-tabular text-right text-ink">{dateTime(result.createdAt)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">수령 방법</dt>
                <dd className="text-right font-semibold text-ink">
                  {RECEIVE_METHOD_LABELS[result.receiveMethod]}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="shrink-0 text-muted">
                  {result.receiveMethod === "pickup" ? "수령 지점" : "배송지"}
                </dt>
                <dd className="text-right text-ink">{result.address}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">수령 일시</dt>
                <dd className="md-tabular text-right font-semibold text-ink">
                  {result.receiveDate} {result.receiveTime}
                </dd>
              </div>
              {result.memo && (
                <div className="flex justify-between gap-4">
                  <dt className="shrink-0 text-muted">요청 사항</dt>
                  <dd className="text-right text-ink">{result.memo}</dd>
                </div>
              )}
              <div className="flex justify-between gap-4 border-t border-line pt-3">
                <dt className="text-muted">환전 합계</dt>
                <dd className="md-tabular text-right font-bold text-ink">{krw(result.total)}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted">예약금</dt>
                <dd className="md-tabular text-right font-bold text-gold">{krw(result.deposit)}</dd>
              </div>
            </dl>
          </div>
        )}
      </div>
    </div>
  );
}
