"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const BANNERS = [
  {
    src: "/banners/join-pulz-free-spins.png",
    alt: "Join Pulz — Free Spins",
  },
  {
    src: "/banners/hero-feel-the-pulse.png",
    alt: "Feel the Pulse. Win Bigger.",
  },
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  // авто-переключение каждые 6 сек
  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % BANNERS.length);
    }, 6000);
    return () => clearInterval(id);
  }, []);

  const goTo = (i: number) => setIndex(i);

  return (
    <div className="relative w-full overflow-hidden rounded-none">
      {/* Лента баннеров */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${index * 100}%)` }}
      >
        {BANNERS.map((banner, i) => (
          <div key={i} className="w-full shrink-0">
            <Image
              src={banner.src}
              alt={banner.alt}
              width={1920}
              height={720}
              className="h-auto w-full object-cover"
              priority={i === 0}
            />
          </div>
        ))}
      </div>

      {/* Индикаторы снизу */}
      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`
              h-1.5 w-6 rounded-full transition-all
              ${i === index ? "bg-blue-500" : "bg-slate-600/70"}
            `}
          />
        ))}
      </div>
    </div>
  );
}
