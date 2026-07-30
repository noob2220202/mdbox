import { mutateStore } from "@/lib/store";

export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  let body: { email?: unknown };
  try {
    body = (await request.json()) as { email?: unknown };
  } catch {
    return Response.json({ ok: false, error: "요청 형식이 올바르지 않습니다." }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!EMAIL_RE.test(email)) {
    return Response.json({ ok: false, error: "이메일 주소를 정확히 입력해 주세요." }, { status: 400 });
  }

  await mutateStore((store) => {
    const exists = store.newsletter.some((n) => n.email.toLowerCase() === email.toLowerCase());
    if (!exists) store.newsletter.push({ email, createdAt: new Date().toISOString() });
  });

  return Response.json({ ok: true });
}
