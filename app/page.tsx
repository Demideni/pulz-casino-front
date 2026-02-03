// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import BannerCarousel from "@/components/BannerCarousel";

export default function HomePage() {
  return (
    <div className="space-y-4 pb-4">
      {/* 1. Большой верхний баннер (клик -> регистрация) */}
      <section className="px-0">
        <BannerCarousel />
      </section>

      {/* 2. Два промо-баннера под hero */}
      <section className="px-4">
        <div className="flex gap-3">
          {/* DEMO (без регистрации) */}
          <Link
            href="/go/robinson-demo"
            className="flex-1 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 block"
          >
            <Image
              src="/banners/robinson_demo.png"
              alt="ROBINSON Demo"
              width={640}
              height={360}
              className="h-full w-full object-cover"
              priority
            />
          </Link>

          {/* PLAY (через регистрацию) */}
          <Link
            href="/go/robinson"
            className="flex-1 overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-950/80 block"
          >
            <Image
              src="/banners/robinson_play.png"
              alt="Play ROBINSON"
              width={640}
              height={360}
              className="h-full w-full object-cover"
            />
          </Link>
        </div>
      </section>
    </div>
  );
}
