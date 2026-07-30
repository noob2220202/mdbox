"use client";

import { useCallback, useEffect, useState } from "react";

import { Dashboard } from "@/components/admin/dashboard";
import { LoginForm } from "@/components/admin/login-form";
import type { AdminIdentity } from "@/lib/admin-session";

export function AdminApp() {
  const [admin, setAdmin] = useState<AdminIdentity | null>(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await fetch("/api/admin/session", { cache: "no-store" });
        if (!alive) return;
        if (res.ok) {
          const data = (await res.json()) as { admin?: AdminIdentity };
          setAdmin(data.admin ?? null);
        }
      } finally {
        if (alive) setChecking(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const onSignedOut = useCallback(() => setAdmin(null), []);

  if (checking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted">확인 중입니다...</p>
      </div>
    );
  }

  if (!admin) return <LoginForm onSuccess={setAdmin} />;

  return <Dashboard admin={admin} onSignedOut={onSignedOut} />;
}
