import type { Metadata } from "next";
import Link from "next/link";

import { PageHero } from "@/components/site/page-hero";
import { BRANCHES } from "@/lib/branches";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "매장 찾기",
  description: "명동 본점을 비롯한 4개 지점의 위치, 영업시간, 오시는 길을 안내합니다.",
};

export default function StoresPage() {
  return (
    <>
      <PageHero
        eyebrow="Stores"
        title="매장 찾기"
        description="명동 일대 4개 지점 모두 동일한 고시 환율로 운영됩니다. 예약하신 지점에서 바로 수령하세요."
        breadcrumb={[{ href: "/stores", label: "매장 찾기" }]}
      />

      <section className="md-shell py-16 lg:py-20" id="hours">
        <div className="grid gap-5 lg:grid-cols-2">
          {BRANCHES.map((branch) => (
            <article
              key={branch.id}
              className="flex flex-col rounded-token-lg border border-line bg-surface p-7"
            >
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-bold text-ink">{branch.name}</h2>
                {branch.featured && (
                  <span className="rounded-token-sm bg-gold-3 px-2.5 py-1 text-xs font-bold text-gold-contrast">
                    본점
                  </span>
                )}
              </div>

              <dl className="mt-5 space-y-3 text-sm">
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 text-xs font-semibold text-muted">주소</dt>
                  <dd className="text-text">{branch.address}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 text-xs font-semibold text-muted">전화</dt>
                  <dd>
                    <a
                      href={`tel:${branch.tel.replace(/-/g, "")}`}
                      className="md-tabular text-gold underline-offset-4 hover:underline"
                    >
                      {branch.tel}
                    </a>
                  </dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 text-xs font-semibold text-muted">영업시간</dt>
                  <dd className="md-tabular text-text">{branch.hours}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 text-xs font-semibold text-muted">휴무</dt>
                  <dd className="text-text">{branch.holiday}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 text-xs font-semibold text-muted">오시는 길</dt>
                  <dd className="text-text">{branch.subway}</dd>
                </div>
                <div className="flex gap-4">
                  <dt className="w-20 shrink-0 text-xs font-semibold text-muted">응대 언어</dt>
                  <dd className="text-text">{branch.languages.join(" · ")}</dd>
                </div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-2 border-t border-line pt-5">
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(branch.address)}`}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="rounded-token-sm border border-line px-4 py-2.5 text-xs font-semibold text-text transition-colors hover:border-gold hover:text-gold"
                >
                  지도에서 보기
                </a>
                <Link
                  href="/checkout"
                  className="rounded-token-sm bg-ink px-4 py-2.5 text-xs font-semibold text-on-ink transition-colors hover:bg-ink-2"
                >
                  이 지점으로 예약
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="md-guilloche mt-10 rounded-token-lg border border-line px-8 py-10">
          <h2 className="text-lg font-bold text-ink">방문 전 확인해 주세요</h2>
          <ul className="mt-4 grid gap-2.5 text-xs leading-relaxed text-muted sm:grid-cols-2">
            <li>· 모든 지점은 동일한 고시 환율을 사용합니다.</li>
            <li>· 예약 건은 별도 창구에서 처리되어 대기가 거의 없습니다.</li>
            <li>· 통화·권종별 보유량은 지점마다 다를 수 있습니다.</li>
            <li>· 공휴일 운영 여부는 지점으로 확인해 주세요.</li>
          </ul>
          <p className="md-tabular mt-6 text-sm font-semibold text-ink">
            대표전화{" "}
            <a
              href={`tel:${BUSINESS.tel.replace(/-/g, "")}`}
              className="text-gold underline-offset-4 hover:underline"
            >
              {BUSINESS.tel}
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
