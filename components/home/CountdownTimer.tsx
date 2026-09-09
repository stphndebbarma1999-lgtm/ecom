"use client";

import { useEffect, useState } from "react";

function getTimeLeft(endsAt?: string) {
  const target = endsAt
    ? new Date(endsAt).getTime()
    : Date.now() + 1000 * 60 * 60 * 24 * 2 + 1000 * 60 * 60 * 15; // fallback: ~2 days out
  const diff = Math.max(0, target - Date.now());

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);

  return { days, hours, minutes, seconds };
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export default function CountdownTimer({ endsAt }: { endsAt?: string }) {
  const [time, setTime] = useState<ReturnType<typeof getTimeLeft>>(() => getTimeLeft(endsAt));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(endsAt)), 1000);
    return () => clearInterval(id);
  }, [endsAt]);

  const units: [string, number][] = [
    ["Days", time.days],
    ["Hours", time.hours],
    ["Mins", time.minutes],
    ["Secs", time.seconds],
  ];

  return (
    <div className="flex items-center gap-3" suppressHydrationWarning>
      {units.map(([label, value]) => (
        <div key={label} className="flex flex-col items-center">
          <span className="flex h-10 w-10 items-center justify-center bg-white/15 text-sm font-semibold text-white">
            {pad(value)}
          </span>
          <span className="mt-1 text-[10px] uppercase tracking-wide text-white/70">
            {label}
          </span>
        </div>
      ))}
    </div>
  );
}
