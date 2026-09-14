"use client";

import { useEffect } from "react";
import Button from "@/components/ui/Button";

export default function StorefrontError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Storefront page error:", error);
  }, [error]);

  return (
    <div className="container-nova flex min-h-[60vh] flex-col items-center justify-center gap-4 py-20 text-center">
      <h1 className="text-xl font-semibold text-neutral-900">Something went wrong</h1>
      <p className="max-w-sm text-sm text-neutral-500">
        This was a temporary glitch loading the page. Please try again.
      </p>
      <div className="mt-2 flex items-center gap-3">
        <Button onClick={reset} variant="primary" size="md">
          Try Again
        </Button>
        <Button href="/" variant="outline" size="md">
          Go Home
        </Button>
      </div>
    </div>
  );
}
