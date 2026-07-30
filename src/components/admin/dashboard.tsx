"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useToast } from "@/components/ui/toast";
import { getBranch } from "@/lib/branches";
import { dateTime, krw, num, phone as formatPhone } from "@/lib/format";
import { BUSINESS } from "@/lib/site";
import {
  ORDER_STATUSES,
  ORDER_STATUS_LABELS,
  RECEIVE_METHOD_LABELS,
  type Order,
  type OrderStatus,
} from "@/lib/types";
import type { AdminIdentity } from "@/lib/admin-session";

type Stats = { totalOrders: number; revenue: number; pending: number; members: number };
type Counts = Record<OrderStatus, number>;

type Payload = {
  ok: boolean;
  admin: AdminIdentity;
  orders: Order[];
  stats: Stats;
  counts: Counts;
};

const STATUS_SELECT_CLASS: Record<OrderStatus, string> = {
  pending: "border-st-pending/40 bg-st-pending-soft text-st-pending",
  paid: "border-st-paid/40 bg-st-paid-soft text-st-paid",
  preparing: "border-st-preparing/40 bg-st-preparing-soft text-st-preparing",
  shipping: "border-st-shipping/40 bg-st-shipping-soft text-st-shipping",
  delivered: "border-st-delivered/40 bg-st-delivered-soft text-st-delivered",
  cancelled: "border-st-cancelled/40 bg-st-cancelled-soft text-st-cancelled",
};

async function fetchDashboard(): Promise<Payload | "unauthorized"> {
  const res = await fetch("/api/admin/orders", { cache: "no-store" });
  if (res.status === 401) return "unauthorized";
  return (await res.json()) as Payload;
}

export function Dashboard({
  admin,
  onSignedOut,
}: {
  admin: AdminIdentity;
  onSignedOut: () => void;
}) {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<Stats>({ totalOrders: 0, revenue: 0, pending: 0, members: 0 });
  const [counts, setCounts] = useState<Counts | null>(null);
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const apply = useCallback(
    (data: Payload) => {
      setOrders(data.orders);
      setStats(data.stats);
      setCounts(data.counts);
      setLoading(false);
    },
    [],
  );

  const load = useCallback(async () => {
    const data = await fetchDashboard();
    if (data === "unauthorized") {
      onSignedOut();
      return;
    }
    apply(data);
  }, [apply, onSignedOut]);

  useEffect(() => {
    let alive = true;
    (async () => {
      const data = await fetchDashboard();
      if (!alive) return;
      if (data === "unauthorized") {
        onSignedOut();
        return;
      }
      apply(data);
    })();
    return () => {
      alive = false;
    };
  }, [apply, onSignedOut]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return orders
      .filter((order) => (filter === "all" ? true : order.status === filter))
      .filter((order) => {
        if (!q) return true;
        // 숫자와 전화번호 기호로만 이루어진 검색어일 때만 연락처를 대조합니다.
        const phoneQuery = /^[\d\s+()-]+$/.test(q) ? q.replace(/\D/g, "") : "";
        return (
          order.orderNo.toLowerCase().includes(q) ||
          order.customer.name.toLowerCase().includes(q) ||
          order.customer.email.toLowerCase().includes(q) ||
          (phoneQuery.length >= 3 && order.customer.phone.replace(/\D/g, "").includes(phoneQuery))
        );
      });
  }, [orders, filter, query]);

  async function changeStatus(order: Order, status: OrderStatus) {
    if (status === order.status) return;
    setBusyId(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.status === 401) {
        onSignedOut();
        return;
      }
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        toast(data.error ?? "상태를 변경하지 못했습니다.", "error");
        return;
      }
      await load();
      toast(`${order.orderNo} 상태를 ${ORDER_STATUS_LABELS[status]}(으)로 변경했습니다.`);
    } catch {
      toast("네트워크 오류로 상태를 변경하지 못했습니다.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function removeOrder(order: Order) {
    const confirmed = window.confirm(
      `주문 ${order.orderNo} 을(를) 삭제할까요?\n삭제한 주문은 되돌릴 수 없습니다.`,
    );
    if (!confirmed) return;

    setBusyId(order.id);
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, { method: "DELETE" });
      if (res.status === 401) {
        onSignedOut();
        return;
      }
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        toast(data.error ?? "주문을 삭제하지 못했습니다.", "error");
        return;
      }
      await load();
      toast(`주문 ${order.orderNo} 을(를) 삭제했습니다.`);
    } catch {
      toast("네트워크 오류로 주문을 삭제하지 못했습니다.", "error");
    } finally {
      setBusyId(null);
    }
  }

  async function signOut() {
    await fetch("/api/admin/session", { method: "DELETE" });
    toast("로그아웃되었습니다.");
    onSignedOut();
  }

  const chips: { id: OrderStatus | "all"; label: string; count: number }[] = [
    { id: "all", label: "전체", count: orders.length },
    ...ORDER_STATUSES.map((status) => ({
      id: status as OrderStatus | "all",
      label: ORDER_STATUS_LABELS[status],
      count: counts?.[status] ?? 0,
    })),
  ];

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-ink">
        <div className="md-shell flex flex-wrap items-center justify-between gap-4 py-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center justify-center rounded-token-sm bg-surface p-1.5">
              <Image src="/logo-mark.png" alt="" width={540} height={453} className="h-7 w-auto" />
            </span>
            <div>
              <p className="md-eyebrow text-gold-2">{BUSINESS.brandEn} · Admin</p>
              <h1 className="mt-1 text-lg font-bold text-on-ink">주문 관리</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-on-ink">{admin.name}</p>
              <p className="text-xs text-on-ink-muted">{admin.email}</p>
            </div>
            <button
              type="button"
              onClick={signOut}
              data-testid="admin-logout"
              className="rounded-token-sm border border-line-dark px-4 py-2.5 text-sm font-semibold text-on-ink transition-colors hover:border-gold-2 hover:text-gold-2"
            >
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="md-shell py-8">
        {/* 통계 카드 */}
        <section aria-label="요약 통계" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="md-card p-6" data-testid="stat-total-orders">
            <p className="text-xs font-semibold text-muted">총 주문 수</p>
            <p className="md-tabular mt-2 font-display text-3xl font-extrabold text-ink">
              {num(stats.totalOrders)}
              <span className="ml-1 text-sm font-bold text-muted">건</span>
            </p>
          </div>

          <div
            className="rounded-token-lg border border-gold bg-gold p-6 shadow-token"
            data-testid="stat-revenue"
          >
            <p className="text-xs font-semibold text-gold-contrast/70">매출 합계</p>
            <p className="md-tabular mt-2 font-display text-3xl font-extrabold text-gold-contrast">
              {num(stats.revenue)}
              <span className="ml-1 text-sm font-bold">원</span>
            </p>
            <p className="mt-1 text-[0.7rem] text-gold-contrast/70">결제대기 · 취소 건 제외</p>
          </div>

          <div className="md-card p-6" data-testid="stat-pending">
            <p className="text-xs font-semibold text-muted">결제대기</p>
            <p className="md-tabular mt-2 font-display text-3xl font-extrabold text-st-pending">
              {num(stats.pending)}
              <span className="ml-1 text-sm font-bold text-muted">건</span>
            </p>
          </div>

          <div className="md-card p-6" data-testid="stat-members">
            <p className="text-xs font-semibold text-muted">전체 회원 수</p>
            <p className="md-tabular mt-2 font-display text-3xl font-extrabold text-ink">
              {num(stats.members)}
              <span className="ml-1 text-sm font-bold text-muted">명</span>
            </p>
          </div>
        </section>

        {/* 필터 · 검색 */}
        <section className="mt-8 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2" role="group" aria-label="주문 상태 필터">
            {chips.map((chip) => (
              <button
                key={chip.id}
                type="button"
                onClick={() => setFilter(chip.id)}
                aria-pressed={filter === chip.id}
                data-testid={`chip-${chip.id}`}
                className={`rounded-full border px-3.5 py-2 text-xs font-bold transition-colors ${
                  filter === chip.id
                    ? "border-ink bg-ink text-on-ink"
                    : "border-line bg-surface text-text hover:border-gold hover:text-gold"
                }`}
              >
                {chip.label}
                <span
                  className={`md-tabular ml-1.5 ${filter === chip.id ? "text-gold-2" : "text-muted"}`}
                >
                  {chip.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative ml-auto w-full sm:w-72">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="주문번호 · 이름 · 이메일 · 연락처"
              aria-label="주문 검색"
              data-testid="admin-search"
              className="w-full rounded-token-sm border border-line bg-surface py-2.5 pl-10 pr-3.5 text-sm outline-none focus:border-gold"
            />
            <svg
              viewBox="0 0 20 20"
              className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-faint"
              fill="none"
              aria-hidden
            >
              <circle cx="9" cy="9" r="5.5" stroke="currentColor" strokeWidth="1.5" />
              <path d="m13.5 13.5 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
        </section>

        {/* 주문 테이블 */}
        <section className="mt-5">
          <p className="mb-3 text-xs text-muted" data-testid="order-count">
            {loading ? "불러오는 중..." : `${visible.length}건 표시`}
          </p>

          <div className="overflow-x-auto rounded-token-lg border border-line bg-surface">
            <table className="w-full min-w-[68rem] text-sm">
              <thead className="bg-surface-2 text-xs text-muted">
                <tr>
                  <th scope="col" className="px-5 py-3.5 text-left font-semibold">주문번호</th>
                  <th scope="col" className="px-5 py-3.5 text-left font-semibold">주문자</th>
                  <th scope="col" className="px-5 py-3.5 text-left font-semibold">주문 상품</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-semibold">금액</th>
                  <th scope="col" className="px-5 py-3.5 text-left font-semibold">주문일시</th>
                  <th scope="col" className="px-5 py-3.5 text-left font-semibold">상태</th>
                  <th scope="col" className="px-5 py-3.5 text-right font-semibold">관리</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {visible.length === 0 && !loading && (
                  <tr>
                    <td colSpan={7} className="px-5 py-16 text-center text-sm text-muted">
                      조건에 맞는 주문이 없습니다.
                    </td>
                  </tr>
                )}

                {visible.map((order) => {
                  const branch = order.branchId ? getBranch(order.branchId) : undefined;
                  return (
                    <tr
                      key={order.id}
                      data-testid="order-row"
                      className="align-top transition-colors hover:bg-canvas"
                    >
                      <th scope="row" className="px-5 py-4 text-left font-normal">
                        <span className="md-tabular block whitespace-nowrap font-bold text-ink">
                          {order.orderNo}
                        </span>
                        <span className="mt-0.5 block whitespace-nowrap text-xs text-muted">
                          {RECEIVE_METHOD_LABELS[order.receiveMethod]}
                          {branch ? ` · ${branch.name}` : ""}
                        </span>
                      </th>

                      <td className="px-5 py-4">
                        <span className="block font-semibold text-ink">{order.customer.name}</span>
                        <span className="md-tabular mt-0.5 block text-xs text-muted">
                          {formatPhone(order.customer.phone)}
                        </span>
                        <span className="block text-xs text-muted">{order.customer.email}</span>
                      </td>

                      <td className="px-5 py-4">
                        <ul className="space-y-0.5">
                          {order.items.map((item) => (
                            <li key={item.code} className="text-xs font-semibold text-ink">
                              {item.name}
                              <span className="md-tabular text-muted"> × {item.qty}</span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-1.5 max-w-xs text-xs leading-relaxed text-muted">
                          {order.customer.address}
                        </p>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <span className="md-tabular block whitespace-nowrap font-bold text-ink">
                          {krw(order.total)}
                        </span>
                        <span className="md-tabular mt-0.5 block whitespace-nowrap text-xs text-muted">
                          예약금 {krw(order.deposit)}
                        </span>
                      </td>

                      <td className="md-tabular whitespace-nowrap px-5 py-4 text-xs text-muted">
                        {dateTime(order.createdAt)}
                      </td>

                      <td className="px-5 py-4">
                        <select
                          value={order.status}
                          disabled={busyId === order.id}
                          onChange={(e) => changeStatus(order, e.target.value as OrderStatus)}
                          aria-label={`${order.orderNo} 상태 변경`}
                          data-testid={`status-select-${order.orderNo}`}
                          className={`rounded-full border px-3 py-1.5 text-xs font-bold outline-none transition-colors disabled:opacity-60 ${STATUS_SELECT_CLASS[order.status]}`}
                        >
                          {ORDER_STATUSES.map((status) => (
                            <option key={status} value={status}>
                              {ORDER_STATUS_LABELS[status]}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => removeOrder(order)}
                          disabled={busyId === order.id}
                          data-testid={`delete-${order.orderNo}`}
                          className="whitespace-nowrap rounded-token-sm border border-line px-3 py-2 text-xs font-semibold text-muted transition-colors hover:border-down hover:text-down disabled:opacity-60"
                        >
                          주문 삭제
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
