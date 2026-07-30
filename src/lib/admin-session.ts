import { cookies } from "next/headers";

import { SESSION_COOKIE, sessionSecret, verifySessionToken } from "@/lib/auth";
import { readStore } from "@/lib/store";
import type { AdminUser } from "@/lib/types";

export type AdminIdentity = Pick<AdminUser, "id" | "email" | "name" | "role">;

/**
 * 요청의 세션 쿠키를 검증해 관리자 정보를 돌려줍니다.
 * 서명이 깨졌거나 만료됐거나, 계정이 사라졌으면 null 입니다.
 */
export async function getAdmin(): Promise<AdminIdentity | null> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const store = await readStore();
  const payload = verifySessionToken(token, sessionSecret(store.sessionSecret));
  if (!payload) return null;

  const admin = store.admins.find((a) => a.id === payload.sub && a.role === "admin");
  if (!admin) return null;

  return { id: admin.id, email: admin.email, name: admin.name, role: admin.role };
}

export function unauthorized(): Response {
  return Response.json({ ok: false, error: "인증이 필요합니다." }, { status: 401 });
}
