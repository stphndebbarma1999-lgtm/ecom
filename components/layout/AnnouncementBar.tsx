"use client";

import { useEffect, useState } from "react";
import { Truck, Rocket, Zap } from "lucide-react";
import { announcements } from "@/config/navigation";

const icons = [Truck, Rocket, Zap];

export default function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % announcements.length);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const MobileIcon = icons[index];

  return (
    <div className="bg-neutral-900 text-white">
      <div className="container-nova flex h-9 items-center justify-center text-xs">
        {/* Desktop: all three shown together */}
        <div className="hidden items-center gap-8 md:flex">
          {announcements.map((message, i) => {
            const Icon = icons[i];
            return (
              <span key={message} className="flex items-center gap-1.5 font-medium">
                <Icon size={13} strokeWidth={2} />
                {message}
              </span>
            );
          })}
        </div>

        {/* Mobile: rotate through messages one at a time */}
        <span key={index} className="flex items-center gap-1.5 font-medium md:hidden">
          <MobileIcon size={13} strokeWidth={2} />
          {announcements[index]}
        </span>
      </div>
    </div>
  );
}
