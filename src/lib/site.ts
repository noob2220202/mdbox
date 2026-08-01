/**
 * 사이트/사업자 설정.
 *
 * 모든 값은 `NEXT_PUBLIC_*` 환경변수로 덮어쓸 수 있습니다. 같은 코드베이스를
 * 여러 도메인에 띄울 때 인스턴스마다 `.env.production.local` 만 다르게 두면 됩니다.
 * 환경변수를 지정하지 않으면 아래 기본값(명동 본점 기준)이 그대로 사용됩니다.
 *
 * 주의: `NEXT_PUBLIC_*` 값은 빌드 시점에 정적으로 삽입되므로,
 * 값을 바꾼 뒤에는 반드시 `npm run build` 를 다시 실행해야 합니다.
 */

/** 빈 문자열은 "미설정" 으로 간주해 기본값으로 되돌립니다. */
function env(value: string | undefined, fallback: string): string {
  return value && value.trim() !== "" ? value.trim() : fallback;
}

/** 값이 없으면 null — 화면에서 해당 항목이 자동으로 숨겨집니다. */
function envOrNull(value: string | undefined): string | null {
  return value && value.trim() !== "" ? value.trim() : null;
}

/** 서비스 도메인 — 메타데이터·사이트맵의 기준 URL */
export const SITE_URL = env(process.env.NEXT_PUBLIC_SITE_URL, "https://mdexchange.store");

/** 도메인 호스트 (예: mdexchange.store) — 기본 이메일 주소를 만들 때 사용합니다. */
export const SITE_HOST = new URL(SITE_URL).host;

export const BUSINESS = {
  brand: env(process.env.NEXT_PUBLIC_BRAND, "명동 환전소"),
  brandEn: env(process.env.NEXT_PUBLIC_BRAND_EN, "MYEONGDONG EXCHANGE"),
  legalName: env(process.env.NEXT_PUBLIC_BIZ_LEGAL_NAME, "주식회사 머니박스 명동지점"),
  ceo: env(process.env.NEXT_PUBLIC_BIZ_CEO, "장창우, 김민수 (각자대표)"),
  registrationNo: env(process.env.NEXT_PUBLIC_BIZ_REG_NO, "389-85-01573"),
  corporateNo: env(process.env.NEXT_PUBLIC_BIZ_CORP_NO, "110111-6712966"),
  address: env(process.env.NEXT_PUBLIC_BIZ_ADDRESS, "서울특별시 중구 남대문로 52-1 (명동2가)"),
  email: env(process.env.NEXT_PUBLIC_BIZ_EMAIL, `help@${SITE_HOST}`),
  /** 대표전화 — 미설정 시 숨김 */
  tel: envOrNull(process.env.NEXT_PUBLIC_BIZ_TEL),
  /** 통신판매업신고번호 — 미설정 시 숨김 */
  mailOrderNo: envOrNull(process.env.NEXT_PUBLIC_BIZ_MAIL_ORDER_NO),
  /** 개인정보보호책임자 — 미설정 시 숨김 */
  privacyOfficer: envOrNull(process.env.NEXT_PUBLIC_BIZ_PRIVACY_OFFICER),
  establishedAt: env(process.env.NEXT_PUBLIC_BIZ_ESTABLISHED_AT, "2021.09.01"),
  establishedYear: Number(env(process.env.NEXT_PUBLIC_BIZ_ESTABLISHED_YEAR, "2021")),
} as const;

export type BusinessField = { label: string; value: string | null };

/** 푸터 등에서 사용할 사업자 정보 목록 (null 항목은 제외됨) */
export function businessFields(): BusinessField[] {
  const fields: BusinessField[] = [
    { label: "상호", value: BUSINESS.legalName },
    { label: "대표", value: BUSINESS.ceo },
    { label: "사업자등록번호", value: BUSINESS.registrationNo },
    { label: "법인등록번호", value: BUSINESS.corporateNo },
    { label: "통신판매업신고번호", value: BUSINESS.mailOrderNo },
    { label: "주소", value: BUSINESS.address },
    { label: "대표전화", value: BUSINESS.tel },
    { label: "이메일", value: BUSINESS.email },
    { label: "개인정보보호책임자", value: BUSINESS.privacyOfficer },
  ];
  return fields.filter((f) => f.value !== null && f.value !== "");
}

/** 주문번호 접두사 — 인스턴스별로 다르게 두면 주문번호가 겹치지 않습니다. */
export const ORDER_NO_PREFIX = env(process.env.NEXT_PUBLIC_ORDER_PREFIX, "MD");
