"use client";

import { Suspense, useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { Lock } from "lucide-react";
import { loginAction } from "./actions";
import { siteConfig } from "@/config/site";

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin";
  const [state, formAction, pending] = useActionState(
    async (_prev: { error?: string }, formData: FormData) => loginAction(formData),
    {}
  );

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-neutral-900 text-white">
          <Lock size={18} />
        </div>
        <h1 className="text-xl font-semibold text-neutral-900">{siteConfig.name} Admin</h1>
        <p className="text-sm text-neutral-500">Enter the admin password to continue.</p>
      </div>

      <form action={formAction} className="mt-8 flex flex-col gap-4">
        <input type="hidden" name="next" value={next} />
        <label className="flex flex-col gap-1.5 text-sm">
          <span className="font-medium text-neutral-700">Password</span>
          <input
            type="password"
            name="password"
            required
            autoFocus
            className="border border-neutral-300 px-3.5 py-2.5 text-sm text-neutral-900 outline-none focus:border-neutral-900"
          />
        </label>

        {state.error && <p className="text-sm text-red-600">{state.error}</p>}

        <button
          type="submit"
          disabled={pending}
          className="mt-2 inline-flex h-11 items-center justify-center bg-neutral-900 text-sm font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50"
        >
          {pending ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
