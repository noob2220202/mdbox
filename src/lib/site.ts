/** 서비스 도메인 — 메타데이터·사이트맵의 기준 URL */
export const SITE_URL = "https://mdexchange.store";

/**
 * 사업자 정보. 확정되지 않은 항목은 null 로 두면 화면에서 자동으로 숨겨집니다.
 */
export const BUSINESS = {
  brand: "명동 환전소",
  brandEn: "MYEONGDONG EXCHANGE",
  legalName: "주식회사 머니박스 명동지점",
  ceo: "장창우, 김민수 (각자대표)",
  registrationNo: "389-85-01573",
  corporateNo: "110111-6712966",
  address: "서울특별시 중구 남대문로 52-1 (명동2가)",
  /** 대표전화 — 미확정 */
  tel: null as string | null,
  email: "help@mdexchange.store",
  /** 통신판매업신고번호 — 미확정 */
  mailOrderNo: null as string | null,
  /** 개인정보보호책임자 — 미확정 */
  privacyOfficer: null as string | null,
  establishedAt: "2021.09.01",
  establishedYear: 2021,
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

export const ORDER_NO_PREFIX = "MD";
