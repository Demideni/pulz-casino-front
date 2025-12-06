"use client";

import Image from "next/image";
import { useState, useEffect } from "react";

const banners = [
  "/banners/banner1.png",
  "/banners/banner2.png",
  "/banners/banner3.png",
];

export default function BannerCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-red-900/30 shadow-[0_0_35px_rgba(248,113,113,0.25)]">
      <Image
        src={banners[index]}
        width={1440}
        height={540}
        alt="Banner"
        className="h-auto w-full object-cover"
        priority
      />

      <div className="absolute bottom-3 left-0 right-0 flex items-center justify-center gap-2">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-6 rounded-full transition-all ${
              i === index ? "bg-red-500" : "bg-slate-700/70"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
