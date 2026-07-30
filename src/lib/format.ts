const KRW = new Intl.NumberFormat("ko-KR");

export function krw(value: number): string {
  return `${KRW.format(Math.round(value))}원`;
}

export function num(value: number): string {
  return KRW.format(value);
}

/** 환율 표시 — 소수 둘째 자리까지 */
export function rate(value: number): string {
  return value.toLocaleString("ko-KR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/** 외화 금액 표시 */
export function foreign(value: number, code: string): string {
  return `${KRW.format(value)} ${code}`;
}

const KST_DATETIME = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

const KST_DATE = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function dateTime(iso: string): string {
  return KST_DATETIME.format(new Date(iso)).replace(/\.$/, "");
}

export function date(iso: string): string {
  return KST_DATE.format(new Date(iso)).replace(/\.$/, "");
}

/** 010-1234-5678 형태로 정규화 */
export function phone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 11) return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  if (digits.length === 10) return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
  return value;
}
