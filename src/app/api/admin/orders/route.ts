import { getAdmin, unauthorized } from "@/lib/admin-session";
import { readStore } from "@/lib/store";
import { NON_REVENUE_STATUSES, ORDER_STATUSES, type OrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

/** 주문 목록 + 대시보드 통계 */
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return unauthorized();

  const store = await readStore();
  const orders = [...store.orders].sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  const counts = ORDER_STATUSES.reduce<Record<OrderStatus, number>>(
    (acc, status) => {
      acc[status] = orders.filter((order) => order.status === status).length;
      return acc;
    },
    {
      pending: 0,
      paid: 0,
      preparing: 0,
      shipping: 0,
      delivered: 0,
      cancelled: 0,
    },
  );

  const revenue = orders
    .filter((order) => !NON_REVENUE_STATUSES.includes(order.status))
    .reduce((sum, order) => sum + order.total, 0);

  return Response.json({
    ok: true,
    admin,
    orders,
    stats: {
      totalOrders: orders.length,
      revenue,
      pending: counts.pending,
      members: store.members.length,
    },
    counts,
  });
}
