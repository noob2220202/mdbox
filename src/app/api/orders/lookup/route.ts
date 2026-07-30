import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

/** 예약번호 + 연락처(뒤 4자리 이상) 로만 조회할 수 있는 공개 조회 API */
export async function POST(request: Request) {
  let body: { orderNo?: unknown; phone?: unknown };
  try {
    body = (await request.json()) as { orderNo?: unknown; phone?: unknown };
  } catch {
    return Response.json({ ok: false, error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const orderNo = typeof body.orderNo === "string" ? body.orderNo.trim().toUpperCase() : "";
  const phoneDigits = typeof body.phone === "string" ? body.phone.replace(/\D/g, "") : "";

  if (!orderNo || phoneDigits.length < 4) {
    return Response.json(
      { ok: false, error: "예약번호와 연락처를 모두 입력해 주세요." },
      { status: 400 },
    );
  }

  const store = await readStore();
  const order = store.orders.find(
    (o) =>
      o.orderNo.toUpperCase() === orderNo &&
      o.customer.phone.replace(/\D/g, "").endsWith(phoneDigits.slice(-4)),
  );

  if (!order) {
    return Response.json(
      { ok: false, error: "일치하는 예약 내역이 없습니다. 입력하신 정보를 다시 확인해 주세요." },
      { status: 404 },
    );
  }

  return Response.json({
    ok: true,
    order: {
      orderNo: order.orderNo,
      createdAt: order.createdAt,
      status: order.status,
      name: order.customer.name,
      address: order.customer.address,
      receiveMethod: order.receiveMethod,
      receiveDate: order.receiveDate,
      receiveTime: order.receiveTime,
      items: order.items,
      total: order.total,
      deposit: order.deposit,
      memo: order.memo,
    },
  });
}
