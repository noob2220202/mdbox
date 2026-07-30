import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-5 text-center">
      <p className="md-eyebrow">404</p>
      <h1 className="mt-3 text-2xl font-bold text-ink sm:text-3xl">페이지를 찾을 수 없습니다</h1>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        주소가 변경되었거나 삭제된 페이지입니다. 아래 링크에서 필요한 정보를 찾아보세요.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-2">
        <Link
          href="/"
          className="rounded-token-sm bg-ink px-5 py-3 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
        >
          홈으로
        </Link>
        <Link
          href="/currencies"
          className="rounded-token-sm border border-line px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-gold hover:text-gold"
        >
          통화 시세 보기
        </Link>
        <Link
          href="/order/lookup"
          className="rounded-token-sm border border-line px-5 py-3 text-sm font-semibold text-text transition-colors hover:border-gold hover:text-gold"
        >
          예약 내역 확인
        </Link>
      </div>
    </div>
  );
}
