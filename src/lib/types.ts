export const ORDER_STATUSES = [
  "pending",
  "paid",
  "preparing",
  "shipping",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: "결제대기",
  paid: "결제완료",
  preparing: "배송준비",
  shipping: "배송중",
  delivered: "배송완료",
  cancelled: "취소",
};

/** 매출 합계에서 제외되는 상태 */
export const NON_REVENUE_STATUSES: OrderStatus[] = ["pending", "cancelled"];

export function isOrderStatus(value: unknown): value is OrderStatus {
  return typeof value === "string" && (ORDER_STATUSES as readonly string[]).includes(value);
}

export type ReceiveMethod = "pickup" | "delivery";

export const RECEIVE_METHOD_LABELS: Record<ReceiveMethod, string> = {
  pickup: "지점 수령",
  delivery: "안심 배송",
};

export type OrderItem = {
  /** 통화 코드 */
  code: string;
  /** 통화명 (주문 시점 스냅샷) */
  name: string;
  /** 취급 단위 (외화) */
  unit: number;
  /** 수량 (단위 묶음 개수) */
  qty: number;
  /** 외화 수량 = unit * qty */
  amount: number;
  /** 적용 환율 (외화 1단위당 원화) */
  rate: number;
  /** 원화 금액 */
  krw: number;
};

export type Customer = {
  name: string;
  phone: string;
  email: string;
  address: string;
};

export type Order = {
  id: string;
  orderNo: string;
  createdAt: string;
  updatedAt: string;
  customer: Customer;
  items: OrderItem[];
  receiveMethod: ReceiveMethod;
  /** 지점 수령일 경우 지점 ID */
  branchId: string | null;
  receiveDate: string;
  receiveTime: string;
  /** 환전 총액 (원화) */
  total: number;
  /** 예약금 (원화) */
  deposit: number;
  purpose: string;
  status: OrderStatus;
  memo: string;
};

export type Member = {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
};

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: "admin";
  passwordHash: string;
  createdAt: string;
};

export type NewsletterEntry = {
  email: string;
  createdAt: string;
};

export type StoreData = {
  version: number;
  sessionSecret: string;
  orderSeq: Record<string, number>;
  orders: Order[];
  members: Member[];
  admins: AdminUser[];
  newsletter: NewsletterEntry[];
};
