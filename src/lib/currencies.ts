export type CurrencyCategory = "popular" | "asia" | "europe" | "americas";

export type Currency = {
  /** ISO 4217 코드 */
  code: string;
  /** 한글 통화명 */
  name: string;
  /** 영문 통화명 */
  nameEn: string;
  /** 발행 국가/지역 */
  country: string;
  flag: string;
  /** 표시 기준 단위 (1 또는 100) — 엔/동/루피아는 100 단위로 고시 */
  per: 1 | 100;
  /** 예약 최소 취급 단위 (외화 기준) */
  unit: number;
  /** 사실때 환율 (외화 1단위당 원화) */
  buy: number;
  /** 파실때 환율 (외화 1단위당 원화) */
  sell: number;
  /** 매매기준율 */
  base: number;
  category: Exclude<CurrencyCategory, "popular">;
  popular: boolean;
  /** 취급 권종 */
  notes: string[];
  /** 통화 소개 문구 */
  blurb: string;
};

export const CURRENCIES: Currency[] = [
  {
    code: "USD",
    name: "미국 달러",
    nameEn: "US Dollar",
    country: "미국",
    flag: "🇺🇸",
    per: 1,
    unit: 20,
    buy: 1457.74,
    sell: 1429.932,
    base: 1445.1,
    category: "americas",
    popular: true,
    notes: ["$100 / $50 / $20 권종 상시 보유", "전 세계 대부분의 국가에서 통용"],
    blurb: "가장 많이 찾는 기축통화. 여행·유학·비상금 준비에 두루 쓰입니다.",
  },
  {
    code: "JPY",
    name: "일본 엔",
    nameEn: "Japanese Yen",
    country: "일본",
    flag: "🇯🇵",
    per: 100,
    unit: 1000,
    buy: 8.9915,
    sell: 8.7442,
    base: 8.8369,
    category: "asia",
    popular: true,
    notes: ["¥10,000 / ¥5,000 / ¥1,000 권종 보유", "100엔 단위로 고시됩니다"],
    blurb: "도쿄·오사카·후쿠오카 여행객이 가장 많이 예약하는 통화입니다.",
  },
  {
    code: "EUR",
    name: "유로",
    nameEn: "Euro",
    country: "유로존",
    flag: "🇪🇺",
    per: 1,
    unit: 50,
    buy: 1671.395,
    sell: 1633.5255,
    base: 1654.93,
    category: "europe",
    popular: true,
    notes: ["€100 / €50 / €20 권종 보유", "€200 이상 고액권은 사전 문의"],
    blurb: "독일·프랑스·이탈리아 등 유로존 20개국에서 그대로 사용합니다.",
  },
  {
    code: "CNY",
    name: "중국 위안",
    nameEn: "Chinese Yuan",
    country: "중국",
    flag: "🇨🇳",
    per: 1,
    unit: 100,
    buy: 219.07,
    sell: 205.186,
    base: 213.73,
    category: "asia",
    popular: true,
    notes: ["¥100 신권 위주 보유", "구권은 현지에서 거절될 수 있습니다"],
    blurb: "상해·북경 출장과 단체 여행 수요가 꾸준한 통화입니다.",
  },
  {
    code: "THB",
    name: "태국 바트",
    nameEn: "Thai Baht",
    country: "태국",
    flag: "🇹🇭",
    per: 1,
    unit: 1000,
    buy: 44.7325,
    sell: 41.185,
    base: 43.12,
    category: "asia",
    popular: true,
    notes: ["฿1,000 / ฿500 권종 보유", "훼손권은 현지 거절 사유가 됩니다"],
    blurb: "방콕·치앙마이·푸켓 여행 성수기에 예약이 몰리는 통화입니다.",
  },
  {
    code: "VND",
    name: "베트남 동",
    nameEn: "Vietnamese Dong",
    country: "베트남",
    flag: "🇻🇳",
    per: 100,
    unit: 500000,
    buy: 0.0607,
    sell: 0.0505,
    base: 0.0549,
    category: "asia",
    popular: true,
    notes: ["₫500,000 / ₫200,000 권종 보유", "100동 단위로 고시됩니다"],
    blurb: "다낭·호치민·하노이 노선 증편으로 수요가 크게 늘었습니다.",
  },
  {
    code: "HKD",
    name: "홍콩 달러",
    nameEn: "Hong Kong Dollar",
    country: "홍콩",
    flag: "🇭🇰",
    per: 1,
    unit: 500,
    buy: 187.679,
    sell: 181.706,
    base: 184.24,
    category: "asia",
    popular: false,
    notes: ["HK$500 / HK$100 권종 보유", "발권 은행별 도안이 다를 수 있습니다"],
    blurb: "짧은 일정의 홍콩·마카오 여행에 적합한 소액 예약이 많습니다.",
  },
  {
    code: "TWD",
    name: "대만 달러",
    nameEn: "New Taiwan Dollar",
    country: "대만",
    flag: "🇹🇼",
    per: 1,
    unit: 1000,
    buy: 47.7365,
    sell: 41.6375,
    base: 44.53,
    category: "asia",
    popular: false,
    notes: ["NT$1,000 / NT$500 권종 보유", "국내 취급 지점이 제한적입니다"],
    blurb: "타이베이 자유여행객이 즐겨 찾는 통화로, 당일 수령이 가능합니다.",
  },
  {
    code: "SGD",
    name: "싱가포르 달러",
    nameEn: "Singapore Dollar",
    country: "싱가포르",
    flag: "🇸🇬",
    per: 1,
    unit: 50,
    buy: 1137.0775,
    sell: 1104.757,
    base: 1120.36,
    category: "asia",
    popular: false,
    notes: ["S$50 / S$10 권종 보유", "S$1,000 고액권은 취급하지 않습니다"],
    blurb: "출장 수요가 많아 평일 오전 예약이 특히 몰립니다.",
  },
  {
    code: "MYR",
    name: "말레이시아 링깃",
    nameEn: "Malaysian Ringgit",
    country: "말레이시아",
    flag: "🇲🇾",
    per: 1,
    unit: 100,
    buy: 373.2,
    sell: 336.576,
    base: 353.58,
    category: "asia",
    popular: false,
    notes: ["RM100 / RM50 권종 보유", "재고에 따라 익일 수령이 될 수 있습니다"],
    blurb: "쿠알라룸푸르·코타키나발루 노선 이용객이 주로 예약합니다.",
  },
  {
    code: "PHP",
    name: "필리핀 페소",
    nameEn: "Philippine Peso",
    country: "필리핀",
    flag: "🇵🇭",
    per: 1,
    unit: 1000,
    buy: 24.96,
    sell: 22.2955,
    base: 23.55,
    category: "asia",
    popular: false,
    notes: ["₱1,000 / ₱500 권종 보유", "현지 리조트 결제용 소액권 문의 가능"],
    blurb: "세부·보라카이 등 리조트 여행에 필요한 소액권 구성이 가능합니다.",
  },
  {
    code: "IDR",
    name: "인도네시아 루피아",
    nameEn: "Indonesian Rupiah",
    country: "인도네시아",
    flag: "🇮🇩",
    per: 100,
    unit: 100000,
    buy: 0.0864,
    sell: 0.074,
    base: 0.08,
    category: "asia",
    popular: false,
    notes: ["Rp100,000 / Rp50,000 권종 보유", "100루피아 단위로 고시됩니다"],
    blurb: "발리 여행 성수기에는 하루 전 예약을 권장드립니다.",
  },
  {
    code: "GBP",
    name: "영국 파운드",
    nameEn: "British Pound",
    country: "영국",
    flag: "🇬🇧",
    per: 1,
    unit: 50,
    buy: 1953.1835,
    sell: 1903.7965,
    base: 1928.49,
    category: "europe",
    popular: false,
    notes: ["£50 / £20 폴리머 신권 보유", "구지폐는 현지 사용이 제한됩니다"],
    blurb: "런던 출장·어학연수 수요가 꾸준한 고액 통화입니다.",
  },
  {
    code: "AUD",
    name: "호주 달러",
    nameEn: "Australian Dollar",
    country: "호주",
    flag: "🇦🇺",
    per: 1,
    unit: 50,
    buy: 1019.6925,
    sell: 990.997,
    base: 1004.85,
    category: "americas",
    popular: false,
    notes: ["A$50 / A$20 폴리머 지폐 보유", "워킹홀리데이 대량 예약 상담 가능"],
    blurb: "워킹홀리데이·어학연수 준비 고객의 예약 비중이 높습니다.",
  },
  {
    code: "CAD",
    name: "캐나다 달러",
    nameEn: "Canadian Dollar",
    country: "캐나다",
    flag: "🇨🇦",
    per: 1,
    unit: 50,
    buy: 1044.678,
    sell: 1015.301,
    base: 1028.47,
    category: "americas",
    popular: false,
    notes: ["C$50 / C$20 권종 보유", "장기 체류용 대량 예약은 사전 문의"],
    blurb: "밴쿠버·토론토 유학 준비 고객이 많이 찾는 통화입니다.",
  },
  {
    code: "NZD",
    name: "뉴질랜드 달러",
    nameEn: "New Zealand Dollar",
    country: "뉴질랜드",
    flag: "🇳🇿",
    per: 1,
    unit: 50,
    buy: 852.464,
    sell: 824.363,
    base: 839.24,
    category: "americas",
    popular: false,
    notes: ["NZ$50 / NZ$20 권종 보유", "재고 확인 후 수령일이 안내됩니다"],
    blurb: "오클랜드·퀸스타운 일정에 맞춰 미리 예약하시길 권합니다.",
  },
];

export const CURRENCY_MAP = new Map(CURRENCIES.map((c) => [c.code, c]));

export function getCurrency(code: string): Currency | undefined {
  return CURRENCY_MAP.get(code.toUpperCase());
}

export const CATEGORIES: { id: CurrencyCategory; label: string; description: string }[] = [
  { id: "popular", label: "인기 통화", description: "명동 본점에서 가장 많이 예약되는 통화" },
  { id: "asia", label: "아시아", description: "일본·중국·동남아 여행에 필요한 통화" },
  { id: "europe", label: "유럽", description: "유로존과 영국 일정에 필요한 통화" },
  { id: "americas", label: "미주·오세아니아", description: "북미·호주·뉴질랜드 장기 체류 통화" },
];

export function currenciesByCategory(category: CurrencyCategory): Currency[] {
  if (category === "popular") return CURRENCIES.filter((c) => c.popular);
  return CURRENCIES.filter((c) => c.category === category);
}

/** 외화 수량(외화 단위) → 원화 지급액. 10원 단위 절사 규칙은 지점 고시와 동일합니다. */
export function toKrw(rate: number, amount: number): number {
  return Math.round((rate * amount) / 10) * 10;
}

/** 예약금 = 환전 금액의 3%, 1,000원 단위 올림 */
export function depositFor(totalKrw: number): number {
  return Math.ceil((totalKrw * 0.03) / 1000) * 1000;
}

/** 고시 표시용 환율 (per 단위 반영) */
export function displayRate(currency: Currency, kind: "buy" | "sell" | "base"): number {
  return currency[kind] * currency.per;
}
