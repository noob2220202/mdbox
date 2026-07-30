import type { Metadata } from "next";

import { PageHero } from "@/components/site/page-hero";
import { BUSINESS } from "@/lib/site";

export const metadata: Metadata = {
  title: "채용",
  description: "명동 환전소와 함께할 창구 담당자, 운영 담당자를 모십니다.",
};

const OPENINGS = [
  {
    title: "환전 창구 담당",
    type: "정규직",
    location: "명동 본점",
    summary: "고객 응대와 외화 시재 관리를 담당합니다. 외국어 회화 가능자를 우대합니다.",
    requirements: [
      "고졸 이상, 현금 취급 업무 경험자 우대",
      "영어 · 일본어 · 중국어 중 1개 이상 회화 가능자 우대",
      "주 5일 근무 (평일 09:00 - 18:00)",
    ],
  },
  {
    title: "지점 운영 매니저",
    type: "정규직",
    location: "명동역점",
    summary: "지점 인력 운영, 시재 마감, 본사 보고를 총괄합니다.",
    requirements: [
      "환전 · 금융 창구 운영 경험 3년 이상",
      "엑셀 기반 마감 정산 업무 가능",
      "주 5일 근무 (평일 09:30 - 19:00)",
    ],
  },
  {
    title: "온라인 예약 운영 (파트타임)",
    type: "파트타임",
    location: "명동 본점",
    summary: "온라인 예약 접수 확인, 고객 안내 문자 발송, 예약 변경 응대를 담당합니다.",
    requirements: [
      "컴퓨터 활용 능력 (문서 · 웹 기반 도구)",
      "주 3일, 1일 5시간 근무 협의 가능",
      "고객 응대 경험자 우대",
    ],
  },
];

const BENEFITS = [
  { title: "4대 보험 · 퇴직연금", body: "입사 즉시 가입하며 퇴직연금은 DC형으로 운영합니다." },
  { title: "명절 상여 · 근속 포상", body: "설·추석 상여와 3년 단위 근속 포상을 지급합니다." },
  { title: "어학 응시료 지원", body: "직무 관련 어학 시험 응시료를 연 2회까지 지원합니다." },
  { title: "중식 지원", body: "근무일 중식비를 별도로 지원합니다." },
];

export default function CareersPage() {
  return (
    <>
      <PageHero
        eyebrow="Careers"
        title="함께 일할 동료를 찾습니다"
        description="명동에서 가장 정확하고 빠른 창구를 만드는 일입니다. 현금과 사람을 다루는 일에 성실한 분을 기다립니다."
        breadcrumb={[{ href: "/careers", label: "채용" }]}
      />

      <section className="md-shell py-16 lg:py-20">
        <div className="space-y-5">
          {OPENINGS.map((job) => (
            <article
              key={job.title}
              className="rounded-token-lg border border-line bg-surface p-7 sm:p-8"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-ink">{job.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{job.summary}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <span className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-bold text-gold">
                    {job.type}
                  </span>
                  <span className="rounded-full border border-line bg-canvas px-3 py-1 text-xs font-bold text-muted">
                    {job.location}
                  </span>
                </div>
              </div>

              <ul className="mt-5 space-y-2 border-t border-line pt-5">
                {job.requirements.map((req) => (
                  <li key={req} className="flex gap-2.5 text-sm text-text">
                    <span className="mt-1 text-gold" aria-hidden>
                      ·
                    </span>
                    {req}
                  </li>
                ))}
              </ul>

              <a
                href={`mailto:${BUSINESS.email}?subject=${encodeURIComponent(`[지원] ${job.title}`)}`}
                className="mt-6 inline-block rounded-token-sm bg-ink px-5 py-3 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2"
              >
                이메일로 지원하기
              </a>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="rounded-token-lg border border-line bg-canvas p-6">
              <h3 className="text-sm font-bold text-ink">{benefit.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted">{benefit.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 rounded-token-lg border border-line bg-surface-2 px-6 py-5 text-xs leading-relaxed text-muted">
          지원서는 자유 양식으로 {BUSINESS.email} 로 보내주세요. 서류 검토 후 일주일 내에 개별
          연락드립니다. 제출하신 서류는 채용 절차 종료 후 파기합니다.
        </p>
      </section>
    </>
  );
}
