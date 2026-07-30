"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

import { createStorageStore, hydratedStore } from "@/lib/client-store";
import { depositFor, getCurrency, toKrw, type Currency } from "@/lib/currencies";

const STORAGE_KEY = "md-exchange-cart";
const EMPTY: CartLine[] = [];

export type CartLine = { code: string; qty: number };

export type DetailedLine = CartLine & {
  currency: Currency;
  amount: number;
  krw: number;
};

function parseLines(raw: string | null): CartLine[] {
  if (!raw) return EMPTY;
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return EMPTY;
    const lines = parsed
      .filter(
        (line): line is CartLine =>
          typeof line === "object" &&
          line !== null &&
          typeof (line as CartLine).code === "string" &&
          typeof (line as CartLine).qty === "number",
      )
      .filter((line) => Boolean(getCurrency(line.code)) && line.qty > 0)
      .map((line) => ({ code: line.code.toUpperCase(), qty: Math.min(Math.floor(line.qty), 999) }));
    return lines.length > 0 ? lines : EMPTY;
  } catch {
    return EMPTY;
  }
}

const cartStore = createStorageStore<CartLine[]>("local", STORAGE_KEY, parseLines, EMPTY);

function writeLines(next: CartLine[]) {
  cartStore.write(next, (value) => JSON.stringify(value));
}

type CartContextValue = {
  lines: DetailedLine[];
  count: number;
  total: number;
  deposit: number;
  ready: boolean;
  add: (code: string, qty?: number) => void;
  setQty: (code: string, qty: number) => void;
  remove: (code: string) => void;
  clear: () => void;
  drawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  quickView: string | null;
  openQuickView: (code: string) => void;
  closeQuickView: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const lines = useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot,
  );
  const ready = useSyncExternalStore(
    hydratedStore.subscribe,
    hydratedStore.getSnapshot,
    hydratedStore.getServerSnapshot,
  );

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [quickView, setQuickView] = useState<string | null>(null);

  const add = useCallback((code: string, qty = 1) => {
    const currency = getCurrency(code);
    if (!currency || qty <= 0) return;
    const current = cartStore.getSnapshot();
    const found = current.find((line) => line.code === currency.code);
    writeLines(
      found
        ? current.map((line) =>
            line.code === currency.code ? { ...line, qty: Math.min(line.qty + qty, 999) } : line,
          )
        : [...current, { code: currency.code, qty: Math.min(qty, 999) }],
    );
    setDrawerOpen(true);
  }, []);

  const setQty = useCallback((code: string, qty: number) => {
    const current = cartStore.getSnapshot();
    writeLines(
      qty <= 0
        ? current.filter((line) => line.code !== code)
        : current.map((line) =>
            line.code === code ? { ...line, qty: Math.min(Math.floor(qty), 999) } : line,
          ),
    );
  }, []);

  const remove = useCallback((code: string) => {
    writeLines(cartStore.getSnapshot().filter((line) => line.code !== code));
  }, []);

  const clear = useCallback(() => writeLines([]), []);

  const detailed = useMemo<DetailedLine[]>(
    () =>
      lines.flatMap((line) => {
        const currency = getCurrency(line.code);
        if (!currency) return [];
        const amount = currency.unit * line.qty;
        return [{ ...line, currency, amount, krw: toKrw(currency.buy, amount) }];
      }),
    [lines],
  );

  const total = detailed.reduce((sum, line) => sum + line.krw, 0);

  const value = useMemo<CartContextValue>(
    () => ({
      lines: detailed,
      count: detailed.reduce((sum, line) => sum + line.qty, 0),
      total,
      deposit: total > 0 ? depositFor(total) : 0,
      ready,
      add,
      setQty,
      remove,
      clear,
      drawerOpen,
      openDrawer: () => setDrawerOpen(true),
      closeDrawer: () => setDrawerOpen(false),
      quickView,
      openQuickView: (code: string) => setQuickView(code),
      closeQuickView: () => setQuickView(null),
    }),
    [detailed, total, ready, add, setQty, remove, clear, drawerOpen, quickView],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart 는 CartProvider 안에서만 사용할 수 있습니다.");
  return ctx;
}
