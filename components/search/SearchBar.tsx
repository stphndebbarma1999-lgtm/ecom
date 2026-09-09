"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const [value, setValue] = useState(initialQuery);
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.trim()) router.push(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <form onSubmit={submit} className="flex items-center gap-3 border border-neutral-300 px-4 py-3">
      <Search size={18} className="shrink-0 text-neutral-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search for products, brands and categories..."
        className="flex-1 border-0 text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
      />
    </form>
  );
}
