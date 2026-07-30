"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { useCart } from "@/components/site/cart-context";
import { NAV } from "@/lib/nav";
import { BUSINESS } from "@/lib/site";

export function Header() {
  const { count, openDrawer } = useCart();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<string | null>(null);

  // 링크를 누르면 열려 있던 메뉴를 함께 닫습니다.
  const closeMenus = () => {
    setMobileOpen(false);
    setOpenGroup(null);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur">
      <div className="md-shell flex h-18 items-center justify-between gap-6 py-3">
        <Link href="/" className="flex items-center gap-3" aria-label={`${BUSINESS.brand} 홈`}>
          <span className="flex h-11 w-11 items-center justify-center rounded-token bg-ink text-gold-2">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" aria-hidden>
              <path
                d="M4 7.5 12 3l8 4.5v9L12 21l-8-4.5v-9Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
              <path
                d="M12 8.2v7.6M9.6 10.2c0-1 1.1-1.7 2.4-1.7s2.4.7 2.4 1.7-1.1 1.5-2.4 1.8-2.4.8-2.4 1.8 1.1 1.7 2.4 1.7 2.4-.7 2.4-1.7"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <span className="leading-tight">
            <span className="block font-display text-[0.62rem] font-extrabold tracking-[0.28em] text-gold">
              {BUSINESS.brandEn}
            </span>
            <span className="block text-lg font-bold tracking-tight text-ink">{BUSINESS.brand}</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="주요 메뉴">
          {NAV.map((group) => {
            const active = pathname === group.href || pathname.startsWith(`${group.href}/`);
            return (
              <div
                key={group.label}
                className="relative"
                onMouseEnter={() => setOpenGroup(group.label)}
                onMouseLeave={() => setOpenGroup(null)}
              >
                <Link
                  href={group.href}
                  className={`flex items-center gap-1 rounded-token-sm px-3 py-2 text-sm font-semibold transition-colors ${
                    active ? "text-gold" : "text-text hover:text-gold"
                  }`}
                  onFocus={() => setOpenGroup(group.label)}
                  onClick={closeMenus}
                >
                  {group.label}
                  <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none" aria-hidden>
                    <path
                      d="m3 4.5 3 3 3-3"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </Link>

                {openGroup === group.label && (
                  <div className="absolute left-0 top-full w-72 pt-2">
                    <div className="md-anim-pop overflow-hidden rounded-token-lg border border-line bg-surface p-2 shadow-token-lg">
                      {group.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMenus}
                          className="block rounded-token-sm px-3 py-2.5 transition-colors hover:bg-canvas"
                        >
                          <span className="block text-sm font-semibold text-ink">{child.label}</span>
                          {child.description && (
                            <span className="mt-0.5 block text-xs text-muted">{child.description}</span>
                          )}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href={`tel:${BUSINESS.tel.replace(/-/g, "")}`}
            className="hidden items-center gap-2 rounded-token-sm px-3 py-2 text-sm font-semibold text-text transition-colors hover:text-gold xl:flex"
          >
            <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" aria-hidden>
              <path
                d="M4.5 3h3l1.5 3.5-2 1.4a10 10 0 0 0 4.6 4.6l1.4-2L16.5 12v3a1.5 1.5 0 0 1-1.7 1.5A13 13 0 0 1 3.5 4.7 1.5 1.5 0 0 1 5 3Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
            <span className="md-tabular">{BUSINESS.tel}</span>
          </a>

          <Link
            href="/checkout"
            className="hidden rounded-token-sm bg-ink px-4 py-2.5 text-sm font-semibold text-on-ink transition-colors hover:bg-ink-2 sm:block"
          >
            예약 신청
          </Link>

          <button
            type="button"
            onClick={openDrawer}
            data-testid="cart-button"
            className="relative flex h-11 w-11 items-center justify-center rounded-token-sm border border-line bg-surface text-ink transition-colors hover:border-gold hover:text-gold"
            aria-label={`환전 바구니 열기 (${count}건)`}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d="M3 4h2l1.6 8.4a1.5 1.5 0 0 0 1.5 1.2h6.3a1.5 1.5 0 0 0 1.5-1.2L17 7H5.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8.5" cy="16.5" r="1.2" fill="currentColor" />
              <circle cx="14.5" cy="16.5" r="1.2" fill="currentColor" />
            </svg>
            {count > 0 && (
              <span
                data-testid="cart-count"
                className="md-tabular absolute -right-1.5 -top-1.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-gold px-1 text-[0.65rem] font-bold text-gold-contrast"
              >
                {count}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-11 w-11 items-center justify-center rounded-token-sm border border-line bg-surface text-ink lg:hidden"
            aria-label="전체 메뉴"
            aria-expanded={mobileOpen}
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5" fill="none" aria-hidden>
              <path
                d={mobileOpen ? "m5 5 10 10M15 5 5 15" : "M3 6h14M3 10h14M3 14h14"}
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-line bg-surface lg:hidden">
          <nav className="md-shell max-h-[70vh] space-y-5 overflow-y-auto py-5" aria-label="모바일 메뉴">
            {NAV.map((group) => (
              <div key={group.label}>
                <p className="md-eyebrow mb-2">{group.label}</p>
                <div className="grid gap-1">
                  {group.children.map((child) => (
                    <Link
                      key={child.href}
                      href={child.href}
                      onClick={closeMenus}
                      className="rounded-token-sm px-3 py-2 text-sm font-semibold text-text hover:bg-canvas"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
            <Link
              href="/checkout"
              onClick={closeMenus}
              className="block rounded-token-sm bg-ink px-4 py-3 text-center text-sm font-semibold text-on-ink"
            >
              예약 신청서 작성
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
