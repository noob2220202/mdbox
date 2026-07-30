import { promises as fs } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

import { hashPassword } from "@/lib/auth";
import { CURRENCIES, depositFor, getCurrency, toKrw } from "@/lib/currencies";
import { BRANCHES } from "@/lib/branches";
import { ORDER_NO_PREFIX } from "@/lib/site";
import type {
  Member,
  Order,
  OrderItem,
  OrderStatus,
  ReceiveMethod,
  StoreData,
} from "@/lib/types";

const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "store.json");
const STORE_VERSION = 1;

export const SEED_ADMIN_EMAIL = "admin@mdexchange.store";
export const SEED_ADMIN_PASSWORD = "MdExchange!2026";

/** 파일 읽기/쓰기 직렬화용 큐 — 동시 요청에서 주문번호 충돌과 덮어쓰기를 막습니다. */
let queue: Promise<unknown> = Promise.resolve();

function withLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.catch(() => undefined);
  return run;
}

function id(prefix: string): string {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function kstDate(daysAgo: number, hour: number, minute: number): string {
  // 시드 기준 시각은 UTC 로 저장하고 화면에서 KST 로 표기합니다.
  const now = new Date();
  const d = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
  d.setUTCHours(hour - 9, minute, 0, 0);
  return d.toISOString();
}

function ymdKst(iso: string): string {
  const d = new Date(iso);
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 10).replace(/-/g, "");
}

function buildItems(spec: { code: string; qty: number }[]): OrderItem[] {
  return spec.map(({ code, qty }) => {
    const currency = getCurrency(code) ?? CURRENCIES[0];
    const amount = currency.unit * qty;
    return {
      code: currency.code,
      name: currency.name,
      unit: currency.unit,
      qty,
      amount,
      rate: currency.buy,
      krw: toKrw(currency.buy, amount),
    };
  });
}

type SeedSpec = {
  daysAgo: number;
  hour: number;
  minute: number;
  name: string;
  phone: string;
  email: string;
  items: { code: string; qty: number }[];
  receiveMethod: ReceiveMethod;
  branchId: string | null;
  address: string;
  receiveTime: string;
  purpose: string;
  status: OrderStatus;
  memo: string;
};

const SEED_SPECS: SeedSpec[] = [
  {
    daysAgo: 0,
    hour: 10,
    minute: 20,
    name: "김서연",
    phone: "010-2847-3315",
    email: "seoyeon.kim@navermail.kr",
    items: [{ code: "JPY", qty: 12 }],
    receiveMethod: "pickup",
    branchId: "myeongdong-main",
    address: "서울특별시 중구 남대문로 52-1 (명동2가) 명동 본점",
    receiveTime: "14:00",
    purpose: "여행",
    status: "pending",
    memo: "",
  },
  {
    daysAgo: 0,
    hour: 13,
    minute: 5,
    name: "박준호",
    phone: "010-9931-2204",
    email: "junho.park@daummail.kr",
    items: [
      { code: "USD", qty: 30 },
      { code: "THB", qty: 8 },
    ],
    receiveMethod: "pickup",
    branchId: "myeongdong-station",
    address: "서울특별시 중구 퇴계로 129 지하 1층 명동역점",
    receiveTime: "17:30",
    purpose: "여행",
    status: "paid",
    memo: "$100 권종으로 요청",
  },
  {
    daysAgo: 2,
    hour: 9,
    minute: 45,
    name: "이하늘",
    phone: "010-4412-8890",
    email: "haneul.lee@gmailbox.kr",
    items: [{ code: "VND", qty: 6 }],
    receiveMethod: "delivery",
    branchId: null,
    address: "경기도 성남시 분당구 판교역로 235 에이치스퀘어 N동 1204호",
    receiveTime: "10:00",
    purpose: "여행",
    status: "shipping",
    memo: "",
  },
  {
    daysAgo: 3,
    hour: 15,
    minute: 30,
    name: "최민재",
    phone: "010-7723-1148",
    email: "minjae.choi@navermail.kr",
    items: [
      { code: "EUR", qty: 20 },
      { code: "GBP", qty: 6 },
    ],
    receiveMethod: "pickup",
    branchId: "myeongdong-main",
    address: "서울특별시 중구 남대문로 52-1 (명동2가) 명동 본점",
    receiveTime: "11:30",
    purpose: "유학",
    status: "preparing",
    memo: "유로 신권 요청",
  },
  {
    daysAgo: 5,
    hour: 11,
    minute: 15,
    name: "정유진",
    phone: "010-3388-5527",
    email: "yujin.jeong@daummail.kr",
    items: [{ code: "CNY", qty: 15 }],
    receiveMethod: "pickup",
    branchId: "euljiro",
    address: "서울특별시 중구 을지로 66 1층 을지로입구점",
    receiveTime: "13:00",
    purpose: "보유",
    status: "delivered",
    memo: "",
  },
  {
    daysAgo: 8,
    hour: 16,
    minute: 40,
    name: "한지우",
    phone: "010-5567-9012",
    email: "jiwoo.han@gmailbox.kr",
    items: [
      { code: "USD", qty: 50 },
      { code: "AUD", qty: 10 },
    ],
    receiveMethod: "delivery",
    branchId: null,
    address: "부산광역시 해운대구 센텀중앙로 79 센텀사이언스파크 1808호",
    receiveTime: "15:00",
    purpose: "유학",
    status: "delivered",
    memo: "워킹홀리데이 준비",
  },
  {
    daysAgo: 11,
    hour: 10,
    minute: 10,
    name: "오세훈",
    phone: "010-8814-6633",
    email: "sehoon.oh@navermail.kr",
    items: [{ code: "SGD", qty: 14 }],
    receiveMethod: "pickup",
    branchId: "namdaemun",
    address: "서울특별시 중구 남대문시장4길 21 1층 남대문시장점",
    receiveTime: "09:30",
    purpose: "여행",
    status: "cancelled",
    memo: "고객 일정 변경으로 취소",
  },
  {
    daysAgo: 14,
    hour: 14,
    minute: 55,
    name: "윤가은",
    phone: "010-2290-7741",
    email: "gaeun.yoon@gmailbox.kr",
    items: [
      { code: "JPY", qty: 25 },
      { code: "TWD", qty: 4 },
    ],
    receiveMethod: "pickup",
    branchId: "myeongdong-main",
    address: "서울특별시 중구 남대문로 52-1 (명동2가) 명동 본점",
    receiveTime: "16:00",
    purpose: "여행",
    status: "delivered",
    memo: "",
  },
  {
    daysAgo: 17,
    hour: 12,
    minute: 25,
    name: "강태윤",
    phone: "010-6604-3382",
    email: "taeyoon.kang@daummail.kr",
    items: [{ code: "CAD", qty: 22 }],
    receiveMethod: "delivery",
    branchId: null,
    address: "인천광역시 연수구 송도과학로 32 송도IT센터 903호",
    receiveTime: "14:30",
    purpose: "이민",
    status: "delivered",
    memo: "",
  },
  {
    daysAgo: 20,
    hour: 9,
    minute: 35,
    name: "서다인",
    phone: "010-1177-4408",
    email: "dain.seo@navermail.kr",
    items: [
      { code: "PHP", qty: 9 },
      { code: "IDR", qty: 7 },
    ],
    receiveMethod: "pickup",
    branchId: "myeongdong-station",
    address: "서울특별시 중구 퇴계로 129 지하 1층 명동역점",
    receiveTime: "10:30",
    purpose: "여행",
    status: "delivered",
    memo: "",
  },
];

async function buildSeed(): Promise<StoreData> {
  const orderSeq: Record<string, number> = {};
  const orders: Order[] = [];
  const membersByEmail = new Map<string, Member>();

  // 오래된 주문부터 번호를 부여해야 순번이 날짜순으로 정렬됩니다.
  const ordered = [...SEED_SPECS].sort((a, b) => b.daysAgo - a.daysAgo);

  for (const spec of ordered) {
    const createdAt = kstDate(spec.daysAgo, spec.hour, spec.minute);
    const ymd = ymdKst(createdAt);
    const seq = (orderSeq[ymd] ?? 0) + 1;
    orderSeq[ymd] = seq;
    const items = buildItems(spec.items);
    const total = items.reduce((sum, item) => sum + item.krw, 0);
    const receiveDate = ymdKst(kstDate(Math.max(spec.daysAgo - 1, 0), 12, 0));

    orders.push({
      id: id("ord"),
      orderNo: `${ORDER_NO_PREFIX}${ymd}-${String(seq).padStart(3, "0")}`,
      createdAt,
      updatedAt: createdAt,
      customer: {
        name: spec.name,
        phone: spec.phone,
        email: spec.email,
        address: spec.address,
      },
      items,
      receiveMethod: spec.receiveMethod,
      branchId: spec.branchId,
      receiveDate: `${receiveDate.slice(0, 4)}-${receiveDate.slice(4, 6)}-${receiveDate.slice(6, 8)}`,
      receiveTime: spec.receiveTime,
      total,
      deposit: depositFor(total),
      purpose: spec.purpose,
      status: spec.status,
      memo: spec.memo,
    });

    if (!membersByEmail.has(spec.email)) {
      membersByEmail.set(spec.email, {
        id: id("mem"),
        name: spec.name,
        email: spec.email,
        phone: spec.phone,
        createdAt,
      });
    }
  }

  orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return {
    version: STORE_VERSION,
    sessionSecret: crypto.randomBytes(32).toString("hex"),
    orderSeq,
    orders,
    members: [...membersByEmail.values()].sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    admins: [
      {
        id: id("adm"),
        email: SEED_ADMIN_EMAIL,
        name: "명동 본점 관리자",
        role: "admin",
        passwordHash: await hashPassword(SEED_ADMIN_PASSWORD),
        createdAt: new Date().toISOString(),
      },
    ],
    newsletter: [],
  };
}

async function readRaw(): Promise<StoreData | null> {
  try {
    const text = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(text) as StoreData;
    if (!parsed || typeof parsed !== "object" || !Array.isArray(parsed.orders)) return null;
    return parsed;
  } catch {
    return null;
  }
}

async function writeRaw(data: StoreData): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const tmp = `${DATA_FILE}.${process.pid}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, DATA_FILE);
}

async function loadOrSeed(): Promise<StoreData> {
  const existing = await readRaw();
  if (existing) return existing;
  const seeded = await buildSeed();
  await writeRaw(seeded);
  return seeded;
}

/** 읽기 전용 접근 */
export function readStore(): Promise<StoreData> {
  return withLock(loadOrSeed);
}

/** 읽고-수정하고-저장하는 원자적 접근 */
export function mutateStore<T>(fn: (data: StoreData) => T | Promise<T>): Promise<T> {
  return withLock(async () => {
    const data = await loadOrSeed();
    const result = await fn(data);
    await writeRaw(data);
    return result;
  });
}

/** 같은 날짜의 최대 순번 + 1 로 주문번호를 발급합니다. */
export function nextOrderNo(data: StoreData, createdAt: string): string {
  const ymd = ymdKst(createdAt);
  const fromSeq = data.orderSeq[ymd] ?? 0;
  const fromOrders = data.orders.reduce((max, order) => {
    const match = order.orderNo.match(/^[A-Z]+(\d{8})-(\d+)$/);
    if (!match || match[1] !== ymd) return max;
    return Math.max(max, Number(match[2]));
  }, 0);
  const seq = Math.max(fromSeq, fromOrders) + 1;
  data.orderSeq[ymd] = seq;
  return `${ORDER_NO_PREFIX}${ymd}-${String(seq).padStart(3, "0")}`;
}

export function upsertMember(data: StoreData, order: Order): void {
  const email = order.customer.email.toLowerCase();
  const found = data.members.find((m) => m.email.toLowerCase() === email);
  if (found) {
    found.name = order.customer.name;
    found.phone = order.customer.phone;
    return;
  }
  data.members.unshift({
    id: id("mem"),
    name: order.customer.name,
    email: order.customer.email,
    phone: order.customer.phone,
    createdAt: order.createdAt,
  });
}

export function newId(prefix: string): string {
  return id(prefix);
}

export const SEED_BRANCH_IDS = BRANCHES.map((b) => b.id);
