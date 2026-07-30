"use client";

import { useState, type FormEvent } from "react";

import { BUSINESS } from "@/lib/site";
import type { AdminIdentity } from "@/lib/admin-session";

export function LoginForm({ onSuccess }: { onSuccess: (admin: AdminIdentity) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string; admin?: AdminIdentity };
      if (!res.ok || !data.ok || !data.admin) {
        setError(data.error ?? "로그인에 실패했습니다.");
        setPassword("");
        return;
      }
      onSuccess(data.admin);
    } catch {
      setError("네트워크 오류로 로그인하지 못했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="text-center">
          <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-token bg-ink text-gold-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
              <path
                d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M12 8.2v7.6M9.6 10.2c0-1 1.1-1.7 2.4-1.7s2.4.7 2.4 1.7-1.1 1.5-2.4 1.8-2.4.8-2.4 1.8 1.1 1.7 2.4 1.7 2.4-.7 2.4-1.7"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <p className="md-eyebrow mt-4">{BUSINESS.brandEn}</p>
          <h1 className="mt-2 text-xl font-bold text-ink">주문 관리 시스템</h1>
          <p className="mt-1.5 text-xs text-muted">관리자 계정으로 로그인해 주세요.</p>
        </div>

        <form
          onSubmit={onSubmit}
          data-testid="admin-login-form"
          className="mt-8 rounded-token-lg border border-line bg-surface p-7 shadow-token"
        >
          <label className="block">
            <span className="text-xs font-semibold text-muted">이메일</span>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="관리자 이메일"
              autoComplete="off"
              data-testid="admin-email"
              className="mt-1.5 w-full rounded-token-sm border border-line bg-surface px-3.5 py-3 text-sm outline-none focus:border-gold"
            />
          </label>

          <label className="mt-4 block">
            <span className="text-xs font-semibold text-muted">비밀번호</span>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="비밀번호"
              autoComplete="off"
              data-testid="admin-password"
              className="mt-1.5 w-full rounded-token-sm border border-line bg-surface px-3.5 py-3 text-sm outline-none focus:border-gold"
            />
          </label>

          {error && (
            <p
              role="alert"
              data-testid="login-error"
              className="mt-4 rounded-token-sm bg-down-soft px-3.5 py-3 text-xs font-medium text-down"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            data-testid="admin-login-submit"
            className="mt-6 w-full rounded-token-sm bg-ink px-5 py-3.5 text-sm font-bold text-on-ink transition-colors hover:bg-ink-2 disabled:opacity-60"
          >
            {loading ? "확인 중..." : "로그인"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-faint">
          {BUSINESS.legalName} · 사업자등록번호 {BUSINESS.registrationNo}
        </p>
      </div>
    </div>
  );
}
