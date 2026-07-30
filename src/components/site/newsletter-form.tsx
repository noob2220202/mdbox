"use client";

import { useState, type FormEvent } from "react";

type Props = { variant?: "dark" | "light" };

export function NewsletterForm({ variant = "light" }: Props) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const dark = variant === "dark";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setState("error");
        setMessage(data.error ?? "신청에 실패했습니다. 잠시 후 다시 시도해 주세요.");
        return;
      }
      setState("done");
      setMessage("환율 알림 신청이 완료되었습니다.");
      setEmail("");
    } catch {
      setState("error");
      setMessage("네트워크 오류로 신청하지 못했습니다.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md">
      <label
        htmlFor={`newsletter-${variant}`}
        className={`block text-sm font-semibold ${dark ? "text-on-ink" : "text-ink"}`}
      >
        환율 알림 받기
      </label>
      <p className={`mt-1 text-xs ${dark ? "text-on-ink-muted" : "text-muted"}`}>
        관심 통화의 고시 환율이 바뀌면 이메일로 알려드립니다.
      </p>
      <div className="mt-3 flex gap-2">
        <input
          id={`newsletter-${variant}`}
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="이메일 주소"
          className={`min-w-0 flex-1 rounded-token-sm border px-3.5 py-2.5 text-sm outline-none transition-colors ${
            dark
              ? "border-line-dark bg-ink-2 text-on-ink placeholder:text-on-ink-muted focus:border-gold"
              : "border-line bg-surface text-text placeholder:text-faint focus:border-gold"
          }`}
        />
        <button
          type="submit"
          disabled={state === "loading"}
          className="shrink-0 rounded-token-sm bg-gold px-4 py-2.5 text-sm font-bold text-gold-contrast transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {state === "loading" ? "신청 중" : "신청"}
        </button>
      </div>
      {message && (
        <p
          role="status"
          className={`mt-2 text-xs font-medium ${
            state === "error" ? "text-down" : dark ? "text-gold-2" : "text-up"
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
}
