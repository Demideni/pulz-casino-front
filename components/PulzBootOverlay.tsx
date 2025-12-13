"use client";

import { useEffect, useState } from "react";

export default function PulzBootOverlay() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Показываем "вау-boot" 1 раз за вкладку
    const key = "pulz_boot_seen";
    const seen = sessionStorage.getItem(key);

    if (!seen) {
      sessionStorage.setItem(key, "1");
      setShow(true);

      // фазы: немного показать -> включить неон -> fade out
      const tFade = setTimeout(() => setFade(true), 1050);
      const tHide = setTimeout(() => setShow(false), 1350);

      return () => {
        clearTimeout(tFade);
        clearTimeout(tHide);
      };
    }
  }, []);

  // чтобы не было SSR-глюков
  if (!mounted || !show) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[9999] flex items-center justify-center bg-[#050509] transition-opacity duration-300",
        fade ? "opacity-0" : "opacity-100",
      ].join(" ")}
    >
      {/* glow фон */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 left-1/2 h-80 w-80 -translate-x-1/2 rounded-full bg-cyan-500/18 blur-3xl" />
        <div className="absolute bottom-[-90px] left-1/3 h-72 w-72 rounded-full bg-blue-500/12 blur-3xl" />
      </div>

      <div className="relative w-[340px]">
        <div className="relative overflow-hidden rounded-[28px] border border-cyan-400/30 bg-white/5 shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_0_55px_rgba(34,211,238,0.08)]">
          {/* scan */}
          <div className="absolute -left-1/2 top-0 h-full w-1/2 animate-[scan_0.9s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-cyan-300/30 to-transparent blur-[1px]" />

          <div className="relative px-6 pb-6 pt-7">
            <div className="flex justify-center">
              <img
                src="/lego-mascot-bust.png"
                alt=""
                draggable={false}
                className="h-[108px] w-[108px] select-none object-contain drop-shadow-[0_0_18px_rgba(34,211,238,0.22)]"
              />
            </div>

            <div className="mt-3 flex justify-center">
              <img
                src="/pulz-logo-light.PNG"
                alt="Pulz"
                draggable={false}
                className="h-11 w-auto select-none"
              />
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] tracking-[0.32em] text-cyan-200/70">
              <span>BOOT</span>
              <span>SECURE</span>
              <span>READY</span>
            </div>

            <div className="mt-4 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-1/3 animate-[pulzbar_0.75s_ease-in-out_infinite] rounded-full bg-cyan-400/90" />
            </div>

            <div className="mt-3 text-center text-xs text-cyan-100/75">
              Подключаем неон…
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-cyan-400/10" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes scan {
          0% { transform: translateX(-120%); opacity: 0.15; }
          50% { opacity: 0.55; }
          100% { transform: translateX(320%); opacity: 0.15; }
        }
        @keyframes pulzbar {
          0% { transform: translateX(-120%); }
          100% { transform: translateX(420%); }
        }
      `}</style>
    </div>
  );
}
