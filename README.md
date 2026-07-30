# 명동 환전소 (Myeongdong Exchange)

주식회사 머니박스 명동지점의 온라인 환전 예약 사이트입니다. 16개 통화의 고시 환율을 노출하고,
고객이 통화를 바구니에 담아 예약을 접수하면 관리자가 `/admin` 에서 주문을 처리합니다.

- **프레임워크**: Next.js 16 (App Router) · TypeScript · Tailwind CSS v4
- **백엔드**: 별도 서버 없이 Next.js Route Handler (`src/app/api/**`)
- **저장소**: JSON 파일 (`.data/store.json`) — 파일이 없으면 첫 실행 시 자동 시드

---

## 빠른 시작

```bash
npm install
npm run dev            # http://localhost:3000
```

프로덕션 실행:

```bash
npm run build
npm run start -- -p 9007
```

첫 요청이 들어오면 `.data/store.json` 이 자동 생성되며 주문·회원·관리자 계정이 시드됩니다.
`.data/` 는 `.gitignore` 에 등록되어 있어 저장소에 커밋되지 않습니다.

---

## 관리자 (`/admin`)

| 항목 | 값 |
| --- | --- |
| 접속 경로 | `https://mdexchange.store/admin` |
| 이메일 | `admin@mdexchange.store` |
| 비밀번호 | `MdExchange!2026` |

- 미인증 상태에서는 로그인 폼만 노출되며, 대시보드 마크업 자체가 렌더링되지 않습니다.
- 모든 어드민 API 는 서버에서 세션을 검증하고, 미인증이면 **401** 을 반환합니다.
- 어드민 레이아웃은 마케팅 헤더·푸터 없이 별도로 구성되며 `robots: noindex` 가 적용됩니다.

**대시보드 기능**

- 통계 카드 4개 — 총 주문 수 / 매출 합계(결제대기·취소 제외) / 결제대기 건수 / 전체 회원 수
- 상태 칩 필터 — 전체 · 결제대기 · 결제완료 · 배송준비 · 배송중 · 배송완료 · 취소 (각 건수 표시)
- 통합 검색 — 주문번호 · 주문자 이름 · 이메일 · 연락처
- 행별 상태 변경 드롭다운 (선택 즉시 저장 + 토스트), 행별 주문 삭제 (confirm 후 삭제 + 토스트)

**운영 전 비밀번호 교체**: 아래 명령으로 새 해시를 만들어 `.data/store.json` 의
`admins[0].passwordHash` 를 교체한 뒤 프로세스를 재시작하세요.

```bash
node -e '
const crypto = require("crypto");
const pw = process.argv[1];
const salt = crypto.randomBytes(16);
crypto.scrypt(pw, salt, 64, { N: 16384, r: 8, p: 1 }, (e, d) =>
  console.log(["scrypt", 16384, 8, 1, salt.toString("base64url"), d.toString("base64url")].join("$")));
' '새비밀번호'
```

---

## 인증 구조

- **비밀번호**: `scrypt` (N=16384, r=8, p=1, 64바이트) 해시로만 저장하며 평문은 보관하지 않습니다.
  저장 형식은 `scrypt$N$r$p$salt$hash` 입니다.
- **세션**: HMAC-SHA256 으로 서명한 토큰을 `httpOnly` 쿠키(`md_admin_session`)에 담습니다.
  유효 시간은 **8시간**이며, 서명 검증은 `timingSafeEqual` 로 수행합니다.
- **서명 키**: 환경변수 `ADMIN_SESSION_SECRET` 를 우선 사용하고, 값이 없으면 최초 실행 시
  생성해 `.data/store.json` 에 보관한 키를 사용합니다.

```bash
# 운영 환경에서는 반드시 주입하세요
export ADMIN_SESSION_SECRET="$(openssl rand -hex 32)"
```

> 키를 바꾸면 발급된 세션 쿠키가 모두 무효화되어 재로그인이 필요합니다.

---

## 백엔드 구조

모든 API 는 Route Handler 로 구현되어 있고, `src/lib/store.ts` 의 큐를 통해 파일 접근이
직렬화됩니다. 덕분에 동시 요청에서도 주문번호가 중복 발급되지 않습니다.

| 메서드 | 경로 | 인증 | 설명 |
| --- | --- | --- | --- |
| `GET` | `/api/rates` | - | 16개 통화 고시 환율 |
| `POST` | `/api/orders` | - | 예약 접수 (주문 저장 + 회원 자동 등록) |
| `POST` | `/api/orders/lookup` | - | 예약번호 + 연락처로 예약 조회 |
| `POST` | `/api/newsletter` | - | 환율 알림 신청 |
| `GET` | `/api/admin/session` | 세션 | 현재 로그인 상태 확인 |
| `POST` | `/api/admin/session` | - | 로그인 (쿠키 발급) |
| `DELETE` | `/api/admin/session` | - | 로그아웃 (쿠키 만료) |
| `GET` | `/api/admin/orders` | 세션 | 주문 목록 + 통계 + 상태별 건수 |
| `PATCH` | `/api/admin/orders/[id]` | 세션 | 주문 상태 변경 |
| `DELETE` | `/api/admin/orders/[id]` | 세션 | 주문 삭제 |

**주문번호**는 `MD + YYYYMMDD-순번` 형식입니다 (예: `MD20260730-003`).
같은 날짜의 최대 순번 + 1 로 발급하며, 저장된 주문을 함께 스캔해 충돌을 방지합니다.

**데이터 파일** (`.data/store.json`)

```
version         스키마 버전
sessionSecret   ADMIN_SESSION_SECRET 미설정 시 사용하는 서명 키
orderSeq        날짜별 주문 순번
orders          주문 목록
members         주문 이메일 기준으로 유도된 회원 목록
admins          관리자 계정 (scrypt 해시)
newsletter      환율 알림 신청 이메일
```

---

## 디자인 토큰

색상·타이포·형태 토큰은 전부 `src/app/globals.css` 의 CSS 변수(`--md-*`)로 정의하고
`@theme inline` 으로 Tailwind 유틸리티에 연결합니다. 마케팅 사이트와 어드민이 동일한 토큰을
사용하며, 화면 코드에는 하드코딩된 색상 값이 없습니다.

- 브랜드: `ink` (미드나잇 네이비) · `gold` (골드) · `canvas` (크림)
- 상태: `st-pending` / `st-paid` / `st-preparing` / `st-shipping` / `st-delivered` / `st-cancelled`
- 폰트: `--font-sans` (Noto Sans KR), `--font-display` (Manrope, 숫자·환율 표기용)

---

## 페이지

| 경로 | 설명 |
| --- | --- |
| `/` | 히어로 + 환율 계산기, 카테고리, 베스트셀러, 이용 절차, 매장, 환율 알림 |
| `/currencies` | 전체 통화 시세 (카드/시세표 전환, 카테고리 탭, 검색, 정렬) |
| `/checkout` | 예약 신청서 (수령 방법·지점·일시·용도·약관 동의) |
| `/order/complete` | 예약 접수 완료 (예약번호·예약금 안내) |
| `/order/lookup` | 예약번호 + 연락처로 진행 상황 조회 |
| `/about` `/sustainability` `/careers` | 회사 소개 · 지속가능성 · 채용 |
| `/pickup` `/cancel` `/denominations` `/faq` | 수령 안내 · 예약 변경/환불 · 권종 가이드 · FAQ |
| `/stores` | 매장 찾기 (4개 지점) |
| `/privacy` `/terms` | 개인정보처리방침 · 이용약관 |
| `/admin` | 주문 관리 (관리자 전용) |

---

## 서버 배포

```bash
git pull
npm install
npm run build
pm2 restart myeongdong-exchange     # 최초 1회는 pm2 start ecosystem.config.js
```

`ecosystem.config.js` 는 `next start -p 9007` 으로 실행하며 `NODE_ENV=production` 과
`ADMIN_SESSION_SECRET` 을 env 로 주입합니다. 배포 전에 `ADMIN_SESSION_SECRET` 값을
반드시 임의의 긴 문자열로 교체하세요.

`.data/` 디렉터리는 프로세스 실행 계정이 쓸 수 있어야 하며, 백업 대상에 포함하시기 바랍니다.

### Caddy 리버스 프록시

서비스 도메인은 **mdexchange.store** 입니다. 기존 Caddyfile 에 아래 블록만 추가하면 됩니다.
TLS 발급·갱신과 `X-Forwarded-Proto` 전달은 Caddy 가 자동으로 처리합니다.

```caddyfile
mdexchange.store, www.mdexchange.store {
    encode zstd gzip
    reverse_proxy 127.0.0.1:9007
}
```

```bash
caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

9007 포트는 방화벽에서 열지 마세요. 외부에는 Caddy 만 노출하고 앱은 루프백으로만 접근합니다.

> 관리자 세션 쿠키는 `NODE_ENV=production` 에서 `secure` 속성으로 발급됩니다.
> 반드시 HTTPS 도메인으로 접속해야 로그인이 유지됩니다.

---

## 검증

```bash
npm run lint
npm run build
```
