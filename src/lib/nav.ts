export type NavLink = { href: string; label: string; description?: string };

export type NavGroup = { label: string; href: string; children: NavLink[] };

export const NAV: NavGroup[] = [
  {
    label: "환전 예약",
    href: "/currencies",
    children: [
      { href: "/currencies", label: "전체 통화 시세", description: "16개 통화 오늘 고시 환율" },
      { href: "/currencies?tab=popular", label: "인기 통화", description: "가장 많이 예약되는 6개 통화" },
      { href: "/checkout", label: "예약 신청서", description: "장바구니에 담은 통화로 바로 신청" },
      { href: "/order/lookup", label: "예약 내역 확인", description: "예약번호로 진행 상황 조회" },
    ],
  },
  {
    label: "이용 안내",
    href: "/pickup",
    children: [
      { href: "/pickup", label: "수령 안내", description: "지점 수령 · 안심 배송 절차" },
      { href: "/cancel", label: "예약 변경 · 환불", description: "예약금 환불과 변경 규정" },
      { href: "/denominations", label: "권종 가이드", description: "통화별 취급 지폐 단위" },
      { href: "/faq", label: "자주 묻는 질문", description: "예약 전 확인하면 좋은 항목" },
    ],
  },
  {
    label: "매장",
    href: "/stores",
    children: [
      { href: "/stores", label: "매장 찾기", description: "명동 일대 4개 지점 안내" },
      { href: "/stores#hours", label: "영업 시간", description: "지점별 운영 시간과 휴무" },
    ],
  },
  {
    label: "브랜드",
    href: "/about",
    children: [
      { href: "/about", label: "회사 소개", description: "2021년부터 명동에서" },
      { href: "/sustainability", label: "지속가능성", description: "종이 없는 예약과 지역 상생" },
      { href: "/careers", label: "채용", description: "함께할 동료를 찾습니다" },
    ],
  },
];

export const FOOTER_NAV: { title: string; links: NavLink[] }[] = [
  {
    title: "환전 예약",
    links: [
      { href: "/currencies", label: "전체 통화 시세" },
      { href: "/checkout", label: "예약 신청서" },
      { href: "/order/lookup", label: "예약 내역 확인" },
      { href: "/denominations", label: "권종 가이드" },
    ],
  },
  {
    title: "이용 안내",
    links: [
      { href: "/pickup", label: "수령 안내" },
      { href: "/cancel", label: "예약 변경 · 환불" },
      { href: "/faq", label: "자주 묻는 질문" },
      { href: "/stores", label: "매장 찾기" },
    ],
  },
  {
    title: "명동 환전소",
    links: [
      { href: "/about", label: "회사 소개" },
      { href: "/sustainability", label: "지속가능성" },
      { href: "/careers", label: "채용" },
      { href: "/terms", label: "이용약관" },
    ],
  },
];
