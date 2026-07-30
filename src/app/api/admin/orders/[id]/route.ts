import { getAdmin, unauthorized } from "@/lib/admin-session";
import { mutateStore } from "@/lib/store";
import { isOrderStatus } from "@/lib/types";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/** 주문 상태 변경 */
export async function PATCH(request: Request, { params }: Params) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;

  let body: { status?: unknown };
  try {
    body = (await request.json()) as { status?: unknown };
  } catch {
    return Response.json({ ok: false, error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  if (!isOrderStatus(body.status)) {
    return Response.json({ ok: false, error: "지원하지 않는 상태입니다." }, { status: 400 });
  }
  const status = body.status;

  const updated = await mutateStore((store) => {
    const order = store.orders.find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    return order;
  });

  if (!updated) {
    return Response.json({ ok: false, error: "주문을 찾을 수 없습니다." }, { status: 404 });
  }

  return Response.json({ ok: true, order: updated });
}

/** 주문 삭제 */
export async function DELETE(_request: Request, { params }: Params) {
  const admin = await getAdmin();
  if (!admin) return unauthorized();

  const { id } = await params;

  const removed = await mutateStore((store) => {
    const index = store.orders.findIndex((o) => o.id === id);
    if (index === -1) return false;
    store.orders.splice(index, 1);
    return true;
  });

  if (!removed) {
    return Response.json({ ok: false, error: "주문을 찾을 수 없습니다." }, { status: 404 });
  }

  return Response.json({ ok: true });
}
