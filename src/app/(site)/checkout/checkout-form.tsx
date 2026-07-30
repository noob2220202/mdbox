"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

import { useCart } from "@/components/site/cart-context";
import { useToast } from "@/components/ui/toast";
import { BRANCHES } from "@/lib/branches";
import { foreign, krw } from "@/lib/format";

const TIMES = [
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00",
  "15:30",
  "16:00",
  "16:30",
  "17:00",
];

const PURPOSES = ["여행", "유학", "보유", "이민"];

export type ReceiveDateOption = { value: string; label: string };

type FieldErrors = Record<string, string>;

export function CheckoutForm({ dateOptions }: { dateOptions: ReceiveDateOption[] }) {
  const router = useRouter();
  const { lines, total, deposit, clear, ready } = useCart();
  const { toast } = useToast();

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [receiveMethod, setReceiveMethod] = useState<"pickup" | "delivery">("pickup");
  const [branchId, setBranchId] = useState(BRANCHES[0].id);
  const [address, setAddress] = useState("");
  const [addressDetail, setAddressDetail] = useState("");
  const [receiveDate, setReceiveDate] = useState(dateOptions[0]?.value ?? "");
  const [receiveTime, setReceiveTime] = useState("");
  const [purpose, setPurpose] = useState("여행");
  const [memo, setMemo] = useState("");
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeNotice, setAgreeNotice] = useState(false);

  const selectedBranch = BRANCHES.find((b) => b.id === branchId) ?? BRANCHES[0];

  function validate(): FieldErrors {
    const next: FieldErrors = {};
    if (name.trim().length < 2) next.name = "성함을 2자 이상 입력해 주세요.";
    if (phone.replace(/\D/g, "").length < 10) next.phone = "연락처를 정확히 입력해 주세요.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) next.email = "이메일 주소를 확인해 주세요.";
    if (receiveMethod === "delivery" && address.trim().length < 5) {
      next.address = "배송 주소를 입력해 주세요.";
    }
    if (!receiveDate) next.receiveDate = "수령일을 선택해 주세요.";
    if (!receiveTime) next.receiveTime = "수령 시간을 선택해 주세요.";
    if (!agreePrivacy) next.agreePrivacy = "개인정보 수집·이용에 동의해 주세요.";
    if (!agreeNotice) next.agreeNotice = "긴급 사전 통지 수신에 동의해 주세요.";
    return next;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");

    if (lines.length === 0) {
      setFormError("바구니에 담긴 통화가 없습니다.");
      return;
    }

    const nextErrors = validate();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      setFormError("입력하신 내용을 다시 확인해 주세요.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          receiveMethod,
          branchId: receiveMethod === "pickup" ? branchId : null,
          address: receiveMethod === "delivery" ? address.trim() : "",
          addressDetail: receiveMethod === "delivery" ? addressDetail.trim() : "",
          receiveDate,
          receiveTime,
          purpose,
          memo: memo.trim(),
          items: lines.map((line) => ({ code: line.code, qty: line.qty })),
        }),
      });

      const data = (await res.json()) as { ok?: boolean; error?: string; order?: unknown };
      if (!res.ok || !data.ok || !data.order) {
        setFormError(data.error ?? "예약을 접수하지 못했습니다. 잠시 후 다시 시도해 주세요.");
        setSubmitting(false);
        return;
      }

      try {
        window.sessionStorage.setItem("md-last-order", JSON.stringify(data.order));
      } catch {
        // 세션 저장이 막혀 있어도 접수는 완료된 상태입니다.
      }
      clear();
      toast("예약이 접수되었습니다.");
      router.push("/order/complete");
    } catch {
      setFormError("네트워크 오류로 예약을 접수하지 못했습니다.");
      setSubmitting(false);
    }
  }

  if (ready && lines.length === 0) {
    return (
      <div className="md-shell py-20">
        <div className="mx-auto max-w-lg rounded-token-lg border border-line bg-surface px-8 py-14 text-center">
          <h2 className="text-lg font-bold text-ink">바구니가 비어 있습니다</h2>
          <p className="mt-2 text-sm text-muted">
            예약하실 통화를 먼저 담아주세요. 여러 통화를 한 번에 예약할 수 있습니다.
          </p>
          <Link
            href="/currencies"
            className="mt-6 inline-block rounded-token-sm bg-ink px-6 py-3 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
          >
            통화 시세 보러 가기
          </Link>
        </div>
      </div>
    );
  }

  const inputClass = (field: string) =>
    `mt-1.5 w-full rounded-token-sm border bg-surface px-3.5 py-3 text-sm outline-none transition-colors ${
      errors[field] ? "border-down focus:border-down" : "border-line focus:border-gold"
    }`;

  return (
    <form onSubmit={onSubmit} className="md-shell grid gap-8 py-12 lg:grid-cols-[1.5fr_1fr] lg:py-16">
      <div className="space-y-8">
        {/* 신청인 정보 */}
        <section className="rounded-token-lg border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-bold text-ink">신청인 정보</h2>
          <p className="mt-1 text-xs text-muted">수령 시 신분증의 성명과 일치해야 합니다.</p>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-muted">성명</span>
              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="홍길동"
                className={inputClass("name")}
              />
              {errors.name && <span className="mt-1 block text-xs text-down">{errors.name}</span>}
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-muted">연락처</span>
              <input
                name="phone"
                inputMode="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="010-0000-0000"
                className={inputClass("phone")}
              />
              {errors.phone && <span className="mt-1 block text-xs text-down">{errors.phone}</span>}
            </label>

            <label className="block sm:col-span-2">
              <span className="text-xs font-semibold text-muted">이메일</span>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={inputClass("email")}
              />
              {errors.email && <span className="mt-1 block text-xs text-down">{errors.email}</span>}
            </label>
          </div>
        </section>

        {/* 수령 정보 */}
        <section className="rounded-token-lg border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-bold text-ink">수령 방법</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {(
              [
                { id: "pickup", title: "지점 수령", body: "예약 후 매장 방문 · 수수료 없음" },
                { id: "delivery", title: "안심 배송", body: "본인 확인 후 등기 발송 · 3,000원" },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setReceiveMethod(option.id)}
                aria-pressed={receiveMethod === option.id}
                className={`rounded-token border px-4 py-4 text-left transition-colors ${
                  receiveMethod === option.id
                    ? "border-gold bg-gold-3/40"
                    : "border-line bg-surface hover:border-line-2"
                }`}
              >
                <span className="block text-sm font-bold text-ink">{option.title}</span>
                <span className="mt-1 block text-xs text-muted">{option.body}</span>
              </button>
            ))}
          </div>

          {receiveMethod === "pickup" ? (
            <div className="mt-5">
              <label className="block">
                <span className="text-xs font-semibold text-muted">수령 지점</span>
                <select
                  value={branchId}
                  onChange={(e) => setBranchId(e.target.value)}
                  className={inputClass("branchId")}
                >
                  {BRANCHES.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name} · {branch.address}
                    </option>
                  ))}
                </select>
              </label>
              <p className="mt-2 text-xs text-muted">
                {selectedBranch.hours} · {selectedBranch.subway}
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-muted">주소</span>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="서울특별시 중구 남대문로 52-1"
                  className={inputClass("address")}
                />
                {errors.address && (
                  <span className="mt-1 block text-xs text-down">{errors.address}</span>
                )}
              </label>
              <label className="block sm:col-span-2">
                <span className="text-xs font-semibold text-muted">상세 주소</span>
                <input
                  value={addressDetail}
                  onChange={(e) => setAddressDetail(e.target.value)}
                  placeholder="동 · 호수"
                  className={inputClass("addressDetail")}
                />
              </label>
            </div>
          )}

          <div className="mt-5 grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="text-xs font-semibold text-muted">수령일</span>
              <select
                value={receiveDate}
                onChange={(e) => setReceiveDate(e.target.value)}
                className={inputClass("receiveDate")}
              >
                {dateOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.receiveDate && (
                <span className="mt-1 block text-xs text-down">{errors.receiveDate}</span>
              )}
            </label>

            <label className="block">
              <span className="text-xs font-semibold text-muted">수령 시간</span>
              <select
                value={receiveTime}
                onChange={(e) => setReceiveTime(e.target.value)}
                className={inputClass("receiveTime")}
              >
                <option value="">시간을 선택하세요</option>
                {TIMES.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
              {errors.receiveTime && (
                <span className="mt-1 block text-xs text-down">{errors.receiveTime}</span>
              )}
            </label>
          </div>

          <p className="mt-3 text-xs text-muted">· 수령은 예약일로부터 3일 이내에만 가능합니다.</p>
        </section>

        {/* 환전 용도 */}
        <section className="rounded-token-lg border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-bold text-ink">환전 용도</h2>
          <p className="mt-1 text-xs text-muted">외국환거래규정에 따라 용도를 확인합니다.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {PURPOSES.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setPurpose(item)}
                aria-pressed={purpose === item}
                className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                  purpose === item
                    ? "border-ink bg-ink text-on-ink"
                    : "border-line bg-surface text-text hover:border-gold hover:text-gold"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <label className="mt-6 block">
            <span className="text-xs font-semibold text-muted">요청 사항 (선택)</span>
            <textarea
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              maxLength={300}
              placeholder="권종 요청 등 전달할 내용을 적어주세요."
              className={`${inputClass("memo")} resize-none`}
            />
          </label>
        </section>

        {/* 동의 */}
        <section className="rounded-token-lg border border-line bg-surface p-6 sm:p-8">
          <h2 className="text-lg font-bold text-ink">약관 동의</h2>
          <div className="mt-5 space-y-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreePrivacy}
                onChange={(e) => setAgreePrivacy(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-gold"
              />
              <span className="text-sm text-text">
                <span className="font-semibold">[필수]</span> 개인정보 수집·이용에 동의합니다.{" "}
                <Link href="/privacy" className="text-gold underline-offset-4 hover:underline">
                  자세히
                </Link>
                {errors.agreePrivacy && (
                  <span className="mt-1 block text-xs text-down">{errors.agreePrivacy}</span>
                )}
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={agreeNotice}
                onChange={(e) => setAgreeNotice(e.target.checked)}
                className="mt-0.5 h-4 w-4 accent-gold"
              />
              <span className="text-sm text-text">
                <span className="font-semibold">[필수]</span> 수령일 변경 등 긴급 사전 통지 수신에
                동의합니다.
                {errors.agreeNotice && (
                  <span className="mt-1 block text-xs text-down">{errors.agreeNotice}</span>
                )}
              </span>
            </label>
          </div>
        </section>
      </div>

      {/* 주문 요약 */}
      <aside className="lg:sticky lg:top-28 lg:h-fit">
        <div className="rounded-token-lg border border-line bg-surface p-6">
          <h2 className="text-base font-bold text-ink">예약 내역</h2>

          <ul className="mt-4 divide-y divide-line">
            {lines.map((line) => (
              <li key={line.code} className="flex items-start justify-between gap-3 py-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">
                    {line.currency.flag} {line.currency.name} × {line.qty}
                  </p>
                  <p className="md-tabular mt-0.5 text-xs text-muted">
                    {foreign(line.amount, line.code)}
                  </p>
                </div>
                <p className="md-tabular shrink-0 text-sm font-bold text-ink">{krw(line.krw)}</p>
              </li>
            ))}
          </ul>

          <dl className="mt-4 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">환전 합계</dt>
              <dd className="md-tabular font-bold text-ink">{krw(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">예약금 (3%)</dt>
              <dd className="md-tabular font-bold text-gold" data-testid="checkout-deposit">
                {krw(deposit)}
              </dd>
            </div>
            <div className="flex justify-between border-t border-line pt-2">
              <dt className="text-muted">매장 결제 잔액</dt>
              <dd className="md-tabular font-semibold text-ink">{krw(total - deposit)}</dd>
            </div>
          </dl>

          {formError && (
            <p role="alert" className="mt-4 rounded-token-sm bg-down-soft px-3.5 py-3 text-xs font-medium text-down">
              {formError}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            data-testid="submit-order"
            className="mt-5 w-full rounded-token-sm bg-gold px-5 py-3.5 text-sm font-bold text-gold-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {submitting ? "접수 중..." : "예약 신청하기"}
          </button>

          <p className="mt-3 text-xs leading-relaxed text-muted">
            신청 후 발급되는 가상계좌로 예약금을 입금하시면 예약이 확정됩니다. 예약금은 수령 시 전액
            돌려드립니다.
          </p>
        </div>
      </aside>
    </form>
  );
}
