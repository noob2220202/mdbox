import { ORDER_STATUS_LABELS, type OrderStatus } from "@/lib/types";

const TONE: Record<OrderStatus, string> = {
  pending: "border-st-pending/30 bg-st-pending-soft text-st-pending",
  paid: "border-st-paid/30 bg-st-paid-soft text-st-paid",
  preparing: "border-st-preparing/30 bg-st-preparing-soft text-st-preparing",
  shipping: "border-st-shipping/30 bg-st-shipping-soft text-st-shipping",
  delivered: "border-st-delivered/30 bg-st-delivered-soft text-st-delivered",
  cancelled: "border-st-cancelled/30 bg-st-cancelled-soft text-st-cancelled",
};

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span
      data-testid={`status-badge-${status}`}
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${TONE[status]}`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}
