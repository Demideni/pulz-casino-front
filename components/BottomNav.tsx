"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Item = { href: string; label: string; icon: string };

const ITEMS: Item[] = [
  { href: "/games/robinson", label: "Играть", icon: "/icons/games.png" },
  { href: "/cashier", label: "Касса", icon: "/icons/wallet.png" },
  { href: "/account", label: "Профиль", icon: "/icons/profile.png" },
  { href: "/menu", label: "Поддержка", icon: "/icons/support.png" },
];

function NavIcon({ src, alt, active }: { src: string; alt: string; active: boolean }) {
  return (
    <span className={`grid h-10 w-10 place-items-center rounded-2xl ${active ? "bg-blue-500/15" : ""}`}>
      <Image src={src} alt={alt} width={28} height={28} className="h-7 w-7" />
    </span>
  );
}

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-800 bg-black/70 backdrop-blur">
      <div className="mx-auto flex max-w-lg items-center justify-between px-4 py-2">
        {ITEMS.map((it) => {
          const active = pathname === it.href || pathname.startsWith(it.href + "/");
          return (
            <Link key={it.href} href={it.href} className="flex w-[72px] flex-col items-center gap-1 text-[10px] text-slate-100">
              <NavIcon src={it.icon} alt={it.label} active={active} />
              <span className={active ? "text-blue-400" : "text-slate-200"}>{it.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
