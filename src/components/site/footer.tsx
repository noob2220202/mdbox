import Image from "next/image";
import Link from "next/link";

import { NewsletterForm } from "@/components/site/newsletter-form";
import { FOOTER_NAV } from "@/lib/nav";
import { BUSINESS, businessFields } from "@/lib/site";

export function Footer() {
  const fields = businessFields();

  return (
    <footer className="mt-24 border-t border-line-dark bg-ink text-on-ink-muted">
      <div className="md-shell grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr]">
        <div>
          <span className="inline-flex items-center justify-center rounded-token bg-surface px-3 py-2.5">
            <Image src="/logo-full.png" alt="MONEY BOX" width={627} height={606} className="h-14 w-auto" />
          </span>
          <p className="mt-5 font-display text-xs font-extrabold tracking-[0.28em] text-gold-2">
            {BUSINESS.brandEn}
          </p>
          <p className="mt-2 text-2xl font-bold text-on-ink">{BUSINESS.brand}</p>
          <p className="mt-4 max-w-sm text-sm leading-relaxed">
            2021년부터 명동에서 16개 통화를 취급해 온 환전 전문 매장입니다. 온라인으로 미리
            예약하고 매장에서 바로 수령하세요.
          </p>
          <div className="mt-6">
            <NewsletterForm variant="dark" />
          </div>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {FOOTER_NAV.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-bold text-on-ink">{column.title}</p>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm transition-colors hover:text-gold-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-line-dark">
        <div className="md-shell flex flex-col gap-4 py-8 text-xs leading-relaxed">
          <dl className="flex flex-wrap gap-x-5 gap-y-2">
            {fields.map((field) => (
              <div key={field.label} className="flex gap-1.5">
                <dt className="text-on-ink-muted">{field.label}</dt>
                <dd className="text-on-ink">{field.value}</dd>
              </div>
            ))}
          </dl>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p>
              © {BUSINESS.establishedYear} {BUSINESS.legalName}. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/terms" className="transition-colors hover:text-gold-2">
                이용약관
              </Link>
              <Link href="/privacy" className="font-semibold text-on-ink transition-colors hover:text-gold-2">
                개인정보처리방침
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
