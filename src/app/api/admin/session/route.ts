import { cookies } from "next/headers";

import { getAdmin } from "@/lib/admin-session";
import {
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  createSessionToken,
  sessionSecret,
  verifyPassword,
} from "@/lib/auth";
import { readStore } from "@/lib/store";

export const dynamic = "force-dynamic";

/** 현재 세션 확인 */
export async function GET() {
  const admin = await getAdmin();
  if (!admin) return Response.json({ ok: false, error: "인증이 필요합니다." }, { status: 401 });
  return Response.json({ ok: true, admin });
}

/** 로그인 */
export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = (await request.json()) as { email?: unknown; password?: unknown };
  } catch {
    return Response.json({ ok: false, error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return Response.json(
      { ok: false, error: "이메일과 비밀번호를 모두 입력해 주세요." },
      { status: 400 },
    );
  }

  const store = await readStore();
  const admin = store.admins.find((a) => a.email.toLowerCase() === email && a.role === "admin");

  // 계정 유무를 노출하지 않기 위해 실패 응답을 동일하게 유지합니다.
  const valid = admin ? await verifyPassword(password, admin.passwordHash) : false;
  if (!admin || !valid) {
    return Response.json(
      { ok: false, error: "이메일 또는 비밀번호가 올바르지 않습니다." },
      { status: 401 },
    );
  }

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const token = createSessionToken(
    { sub: admin.id, email: admin.email, exp },
    sessionSecret(store.sessionSecret),
  );

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });

  return Response.json({
    ok: true,
    admin: { id: admin.id, email: admin.email, name: admin.name, role: admin.role },
  });
}

/** 로그아웃 */
export async function DELETE() {
  const jar = await cookies();
  jar.set(SESSION_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
  return Response.json({ ok: true });
}
