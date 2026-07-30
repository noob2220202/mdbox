import { getBranch } from "@/lib/branches";
import { depositFor, getCurrency, toKrw } from "@/lib/currencies";
import { mutateStore, newId, nextOrderNo, upsertMember } from "@/lib/store";
import type { Order, OrderItem, ReceiveMethod } from "@/lib/types";

export const dynamic = "force-dynamic";

type ItemInput = { code?: unknown; qty?: unknown };

type OrderInput = {
  name?: unknown;
  phone?: unknown;
  email?: unknown;
  address?: unknown;
  addressDetail?: unknown;
  receiveMethod?: unknown;
  branchId?: unknown;
  receiveDate?: unknown;
  receiveTime?: unknown;
  purpose?: unknown;
  memo?: unknown;
  items?: unknown;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PURPOSES = ["여행", "유학", "보유", "이민"];

function bad(error: string): Response {
  return Response.json({ ok: false, error }, { status: 400 });
}

function str(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  let body: OrderInput;
  try {
    body = (await request.json()) as OrderInput;
  } catch {
    return bad("요청 형식이 올바르지 않습니다.");
  }

  const name = str(body.name);
  const phone = str(body.phone);
  const email = str(body.email);
  const purpose = str(body.purpose);
  const memo = str(body.memo).slice(0, 300);
  const receiveDate = str(body.receiveDate);
  const receiveTime = str(body.receiveTime);
  const receiveMethod = str(body.receiveMethod) as ReceiveMethod;

  if (name.length < 2) return bad("주문자 성함을 2자 이상 입력해 주세요.");
  if (phone.replace(/\D/g, "").length < 10) return bad("연락처를 정확히 입력해 주세요.");
  if (!EMAIL_RE.test(email)) return bad("이메일 주소를 정확히 입력해 주세요.");
  if (receiveMethod !== "pickup" && receiveMethod !== "delivery") {
    return bad("수령 방법을 선택해 주세요.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(receiveDate)) return bad("수령일을 선택해 주세요.");
  if (!/^\d{2}:\d{2}$/.test(receiveTime)) return bad("수령 시간을 선택해 주세요.");
  if (!PURPOSES.includes(purpose)) return bad("환전 용도를 선택해 주세요.");

  let branchId: string | null = null;
  let address = "";
  if (receiveMethod === "pickup") {
    branchId = str(body.branchId);
    const branch = getBranch(branchId);
    if (!branch) return bad("수령 지점을 선택해 주세요.");
    address = `${branch.address} ${branch.name}`;
  } else {
    const base = str(body.address);
    const detail = str(body.addressDetail);
    if (base.length < 5) return bad("배송 주소를 입력해 주세요.");
    address = detail ? `${base} ${detail}` : base;
  }

  const rawItems = Array.isArray(body.items) ? (body.items as ItemInput[]) : [];
  if (rawItems.length === 0) return bad("예약할 통화를 한 가지 이상 선택해 주세요.");

  const items: OrderItem[] = [];
  for (const raw of rawItems) {
    const currency = getCurrency(str(raw.code));
    const qty = Math.floor(Number(raw.qty));
    if (!currency) return bad("취급하지 않는 통화가 포함되어 있습니다.");
    if (!Number.isFinite(qty) || qty < 1 || qty > 999) return bad("수량이 올바르지 않습니다.");
    if (items.some((item) => item.code === currency.code)) {
      return bad("같은 통화가 중복으로 담겨 있습니다.");
    }
    const amount = currency.unit * qty;
    items.push({
      code: currency.code,
      name: currency.name,
      unit: currency.unit,
      qty,
      amount,
      rate: currency.buy,
      krw: toKrw(currency.buy, amount),
    });
  }

  const total = items.reduce((sum, item) => sum + item.krw, 0);
  if (total > 4_500_000) {
    return bad("1인 1일 환산 450만원 이하로 신청해 주세요.");
  }

  const order = await mutateStore((store) => {
    const createdAt = new Date().toISOString();
    const created: Order = {
      id: newId("ord"),
      orderNo: nextOrderNo(store, createdAt),
      createdAt,
      updatedAt: createdAt,
      customer: { name, phone, email, address },
      items,
      receiveMethod,
      branchId,
      receiveDate,
      receiveTime,
      total,
      deposit: depositFor(total),
      purpose,
      status: "pending",
      memo,
    };
    store.orders.unshift(created);
    upsertMember(store, created);
    return created;
  });

  return Response.json(
    {
      ok: true,
      order: {
        orderNo: order.orderNo,
        createdAt: order.createdAt,
        total: order.total,
        deposit: order.deposit,
        receiveDate: order.receiveDate,
        receiveTime: order.receiveTime,
        receiveMethod: order.receiveMethod,
        address: order.customer.address,
        items: order.items,
        name: order.customer.name,
      },
    },
    { status: 201 },
  );
}
