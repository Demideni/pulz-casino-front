"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

export default function BannerGate({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const router = useRouter();

  async function goCta() {
    try {
      const r = await fetch("/api/me", { method: "GET", credentials: "include", cache: "no-store" });
      if (r.ok) router.push("/cashier");
      else router.push("/login?next=/cashier");
    } catch {
      router.push("/login?next=/cashier");
    }
  }

  return (
    <button type="button" onClick={goCta} className={className}>
      {children}
    </button>
  );
}
