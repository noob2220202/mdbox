export type Branch = {
  id: string;
  name: string;
  address: string;
  tel: string;
  hours: string;
  holiday: string;
  subway: string;
  languages: string[];
  featured: boolean;
};

export const BRANCHES: Branch[] = [
  {
    id: "myeongdong-main",
    name: "명동 본점",
    address: "서울특별시 중구 남대문로 52-1 (명동2가)",
    tel: "02-3789-0888",
    hours: "평일 09:00 - 18:00 / 토요일 09:00 - 12:00",
    holiday: "일요일 · 공휴일 휴무",
    subway: "지하철 4호선 명동역 6번 출구 도보 3분",
    languages: ["한국어", "English", "日本語", "中文"],
    featured: true,
  },
  {
    id: "myeongdong-station",
    name: "명동역점",
    address: "서울특별시 중구 퇴계로 129 지하 1층",
    tel: "02-3789-0889",
    hours: "평일 09:30 - 19:00 / 토요일 10:00 - 15:00",
    holiday: "일요일 휴무",
    subway: "지하철 4호선 명동역 3번 출구 연결",
    languages: ["한국어", "English", "中文"],
    featured: false,
  },
  {
    id: "euljiro",
    name: "을지로입구점",
    address: "서울특별시 중구 을지로 66 1층",
    tel: "02-3789-0890",
    hours: "평일 09:00 - 17:30",
    holiday: "주말 · 공휴일 휴무",
    subway: "지하철 2호선 을지로입구역 5번 출구 도보 2분",
    languages: ["한국어", "English"],
    featured: false,
  },
  {
    id: "namdaemun",
    name: "남대문시장점",
    address: "서울특별시 중구 남대문시장4길 21 1층",
    tel: "02-3789-0891",
    hours: "평일 09:00 - 18:30 / 토요일 09:00 - 15:00",
    holiday: "일요일 휴무",
    subway: "지하철 4호선 회현역 5번 출구 도보 5분",
    languages: ["한국어", "English", "中文"],
    featured: false,
  },
];

export const BRANCH_MAP = new Map(BRANCHES.map((b) => [b.id, b]));

export function getBranch(id: string): Branch | undefined {
  return BRANCH_MAP.get(id);
}
