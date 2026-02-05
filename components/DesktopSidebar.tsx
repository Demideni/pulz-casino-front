// components/DesktopSidebar.tsx
import Link from "next/link";

const TG = "https://t.me/grandfather_jack";

function NavItem({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="block rounded-xl border border-slate-800/70 bg-slate-950/40 px-4 py-3 text-sm font-semibold text-slate-100 hover:border-slate-700 hover:bg-slate-950/70"
    >
      {label}
    </Link>
  );
}

function CtaImg({ src, alt }: { src: string; alt: string }) {
  return (
    <a
      href={TG}
      target="_blank"
      rel="noreferrer"
      className="block overflow-hidden rounded-xl border border-slate-800/70 bg-slate-950/40 hover:border-slate-700"
      aria-label={alt}
    >
      <img src={src} alt={alt} className="h-auto w-full object-cover" />
    </a>
  );
}

export default function DesktopSidebar() {
  return (
    <aside className="hidden lg:block lg:w-[320px] lg:shrink-0">
      <div className="sticky top-[76px] space-y-3 px-3 pb-6">
        {/* MENU */}
        <div className="space-y-2">
          <NavItem href="/menu" label="Menu" />
          <NavItem href="/tournaments" label="Tournaments" />
          <NavItem href="/partners" label="Partners" />
          {/* Status убрали по просьбе */}
        </div>

        {/* QUICK PLAY */}
        <Link
          href="/go/robinson"
          className="block rounded-xl border border-blue-500/30 bg-blue-500/10 px-4 py-3 text-sm font-extrabold text-blue-100 shadow-[0_0_30px_rgba(59,130,246,0.12)] hover:bg-blue-500/15"
        >
          ▶ Play Robinson
        </Link>

        {/* CTA banners under menu (same width as sidebar) */}
        <div className="space-y-2 pt-1">
          <CtaImg src="/cta/integration.png" alt="Интеграция в проекты" />
          <CtaImg src="/cta/affiliate.png" alt="Стать аффилейтом" />
          <CtaImg src="/cta/offers.png" alt="Предложения" />
        </div>
      </div>
    </aside>
  );
}
