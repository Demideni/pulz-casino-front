"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

const BANNERS = [
  { src: "/banners/join-pulz-free-spins.png", alt: "Join Pulz — Free Spins" },
  { src: "/banners/hero-feel-the-pulse.png", alt: "Feel the Pulse. Win Bigger." },
];

export default function BannerCarousel() {
  const router = useRouter();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const goTo = (i: number) => setIndex(i);

  async function handleBannerClick() {
    try {
      const r = await fetch("/api/me", { cache: "no-store" });
      const j = await r.json().catch(() => null);
      const authed = !!(j?.data?.user?.id || j?.user?.id || (j?.ok && j?.user?.id));

      if (authed) router.push("/cashier");
      else router.push("/register");
    } catch {
      // fallback: if anything fails, send to register
      router.push("/register");
    }
  }

  return (
    <div className="relative w-full overflow-hidden rounded-none">
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {BANNERS.map((banner, i) => (
          <button
            key={i}
            type="button"
            onClick={handleBannerClick}
            className="w-full shrink-0 text-left"
            aria-label="Open banner"
          >
            <Image
              src={banner.src}
              alt={banner.alt}
              width={1920}
              height={720}
              className="h-[180px] w-full object-cover sm:h-[220px] md:h-[240px] lg:h-[280px] xl:h-[320px]"
              priority={i === 0}
            />
          </button>
        ))}
      </div>

      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1.5 w-6 rounded-full transition-all ${i === index ? "bg-blue-500" : "bg-slate-600/70"}`}
            aria-label={`Go to banner ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
