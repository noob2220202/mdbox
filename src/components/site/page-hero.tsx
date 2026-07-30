import Link from "next/link";
import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: string;
  description: string;
  breadcrumb?: { href: string; label: string }[];
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, description, breadcrumb, children }: Props) {
  return (
    <section className="border-b border-line-dark bg-ink">
      <div className="md-shell py-14 lg:py-20">
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="현재 위치" className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            <Link href="/" className="text-on-ink-muted transition-colors hover:text-gold-2">
              홈
            </Link>
            {breadcrumb.map((crumb) => (
              <span key={crumb.href} className="flex items-center gap-2">
                <span className="text-on-ink-muted" aria-hidden>
                  /
                </span>
                <Link href={crumb.href} className="text-on-ink transition-colors hover:text-gold-2">
                  {crumb.label}
                </Link>
              </span>
            ))}
          </nav>
        )}
        <p className="md-eyebrow text-gold-2">{eyebrow}</p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-on-ink sm:text-4xl lg:text-5xl">
          {title}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-ink-muted sm:text-base">
          {description}
        </p>
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
