"use client";

import { useEffect, useState } from "react";

export default function PulzBootOverlay() {
  const [mounted, setMounted] = useState(false);
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0); // 0 idle, 1 appear, 2 power, 3 fade

  useEffect(() => {
    setMounted(true);

    const key = "pulz_boot_seen";
    const seen = sessionStorage.getItem(key);

    if (!seen) {
      sessionStorage.setItem(key, "1");
      setShow(true);
      setPhase(1);

      const t1 = setTimeout(() => setPhase(2), 420);  // power pulse
      const t2 = setTimeout(() => setPhase(3), 1250); // fade
      const t3 = setTimeout(() => setShow(false), 1500);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, []);

  if (!mounted || !show) return null;

  return (
    <div
      className={[
        "fixed inset-0 z-[9999] flex items-center justify-center bg-[#050509] transition-opacity duration-300",
        phase === 3 ? "opacity-0" : "opacity-100",
      ].join(" ")}
    >
      {/* Premium background: vignette + noise + mesh */}
      <div className="pointer-events-none absolute inset-0">
        {/* vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,rgba(255,255,255,0.02),rgba(0,0,0,0.88)_62%,rgba(0,0,0,0.98)_100%)]" />
        {/* mesh lights */}
        <div className="absolute -top-24 left-1/2 h-[520px] w-[520px] -translate-x-1/2 rounded-full bg-cyan-500/14 blur-3xl" />
        <div className="absolute bottom-[-220px] left-[18%] h-[520px] w-[520px] rounded-full bg-blue-500/10 blur-3xl" />
        <div className="absolute top-[18%] right-[-220px] h-[520px] w-[520px] rounded-full bg-cyan-300/8 blur-3xl" />
        {/* noise (CSS-only) */}
        <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay [background-image:url('data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22140%22 height=%22140%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22140%22 height=%22140%22 filter=%22url(%23n)%22 opacity=%220.55%22/%3E%3C/svg%3E')]" />
      </div>

      {/* Center stage */}
      <div className="relative w-[360px] px-4">
        {/* Outer glow frame */}
        <div
          className={[
            "relative overflow-hidden rounded-[30px] border bg-white/[0.035] shadow-[0_0_0_1px_rgba(34,211,238,0.06),0_18px_70px_rgba(0,0,0,0.65)]",
            phase >= 2 ? "border-cyan-400/35" : "border-white/10",
          ].join(" ")}
        >
          {/* circuit line (animated) */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute inset-0 opacity-80 [background:linear-gradient(90deg,transparent,rgba(34,211,238,0.16),transparent)] blur-[1px] animate-[circuit_1.1s_ease-in-out_infinite]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.10),transparent_55%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.08),transparent_55%)]" />
          </div>

          {/* Inner bezel */}
          <div className="relative m-[10px] rounded-[24px] border border-cyan-400/10 bg-[#070813]/55 backdrop-blur-xl">
            {/* Top micro header */}
            <div className="flex items-center justify-between px-5 pt-4 text-[10px] tracking-[0.34em] text-cyan-100/55">
              <span>PULZ SYSTEM</span>
              <span className={phase >= 2 ? "text-cyan-100/75" : ""}>v1.0</span>
            </div>

            {/* Mascot + logo */}
            <div className="px-5 pb-5 pt-4">
              <div className="flex justify-center">
                <img
                  src="/lego-mascot-bust.png"
                  alt=""
                  draggable={false}
                  className={[
                    "h-[116px] w-[116px] select-none object-contain transition-all duration-500",
                    phase >= 1 ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
                    phase >= 2
                      ? "drop-shadow-[0_0_26px_rgba(34,211,238,0.26)]"
                      : "drop-shadow-[0_0_10px_rgba(34,211,238,0.12)]",
                  ].join(" ")}
                />
              </div>

              <div className="mt-3 flex justify-center">
                <img
                  src="/pulz-logo-dark.PNG"
                  alt="Pulz"
                  draggable={false}
                  className="h-12 w-auto select-none opacity-95"
                />
              </div>

              {/* Status chips */}
              <div className="mt-4 grid grid-cols-3 gap-2 text-[10px] tracking-[0.22em]">
                {[
                  ["SECURE BOOT", phase >= 2],
                  ["WALLET READY", phase >= 2],
                  ["RNG OK", phase >= 2],
                ].map(([t, ok], i) => (
                  <div
                    key={i}
                    className={[
                      "rounded-xl border px-2.5 py-2 text-center",
                      ok
                        ? "border-cyan-400/25 bg-cyan-300/5 text-cyan-100/80"
                        : "border-white/10 bg-white/[0.03] text-white/50",
                    ].join(" ")}
                  >
                    {t as string}
                  </div>
                ))}
              </div>

              {/* Premium progress */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-[10px] tracking-[0.28em] text-cyan-100/55">
                  <span>INITIALIZING</span>
                  <span className={phase >= 2 ? "text-cyan-100/80" : ""}>
                    {phase === 1 ? "37%" : phase === 2 ? "86%" : "100%"}
                  </span>
                </div>

                <div className="mt-2 h-[4px] w-full overflow-hidden rounded-full bg-white/10">
                  <div
                    className={[
                      "h-full rounded-full bg-cyan-400/90 transition-all duration-[650ms] ease-out",
                      phase === 1 ? "w-[37%]" : "",
                      phase === 2 ? "w-[86%]" : "",
                      phase === 3 ? "w-[100%]" : "",
                    ].join(" ")}
                  />
                  {/* glossy highlight */}
                  <div className="pointer-events-none relative -mt-[4px] h-[4px] w-full">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.18),transparent)] opacity-40 animate-[shine_1.2s_ease-in-out_infinite]" />
                  </div>
                </div>
              </div>

              {/* Power pulse */}
              <div
                className={[
                  "pointer-events-none absolute inset-0 opacity-0",
                  phase >= 2 ? "animate-[pulse_0.45s_ease-out_1] opacity-100" : "",
                ].join(" ")}
              />
            </div>
          </div>

          {/* corner sparks (subtle) */}
          <div className="pointer-events-none absolute left-4 top-4 h-2 w-2 rounded-full bg-cyan-300/30 blur-[2px]" />
          <div className="pointer-events-none absolute right-4 top-4 h-2 w-2 rounded-full bg-cyan-300/30 blur-[2px]" />
          <div className="pointer-events-none absolute left-4 bottom-4 h-2 w-2 rounded-full bg-cyan-300/30 blur-[2px]" />
          <div className="pointer-events-none absolute right-4 bottom-4 h-2 w-2 rounded-full bg-cyan-300/30 blur-[2px]" />

          <div className="pointer-events-none absolute inset-0 rounded-[30px] ring-1 ring-cyan-400/10" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes circuit {
          0% { transform: translateX(-120%); opacity: 0.15; }
          50% { opacity: 0.5; }
          100% { transform: translateX(240%); opacity: 0.15; }
        }
        @keyframes shine {
          0% { transform: translateX(-140%); }
          100% { transform: translateX(240%); }
        }
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 rgba(34,211,238,0.0); }
          45% { box-shadow: 0 0 0 120px rgba(34,211,238,0.06); }
          100% { box-shadow: 0 0 0 220px rgba(34,211,238,0.0); }
        }
      `}</style>
    </div>
  );
}
