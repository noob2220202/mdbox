import { CURRENCIES, displayRate } from "@/lib/currencies";

export const dynamic = "force-dynamic";

/** 공개 환율 조회 — 화면과 동일한 고시 데이터를 반환합니다. */
export async function GET() {
  return Response.json({
    ok: true,
    updatedAt: new Date().toISOString(),
    currencies: CURRENCIES.map((currency) => ({
      code: currency.code,
      name: currency.name,
      nameEn: currency.nameEn,
      country: currency.country,
      unit: currency.unit,
      per: currency.per,
      buy: currency.buy,
      sell: currency.sell,
      base: currency.base,
      display: {
        buy: displayRate(currency, "buy"),
        sell: displayRate(currency, "sell"),
        base: displayRate(currency, "base"),
      },
    })),
  });
}
