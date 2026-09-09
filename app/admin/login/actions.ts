"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ADMIN_SESSION_COOKIE, createAdminSessionToken, safeCompare } from "@/lib/adminAuth";

export async function loginAction(formData: FormData): Promise<{ error?: string }> {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/admin");

  const adminPassword = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.ADMIN_SESSION_SECRET;

  if (!adminPassword || !sessionSecret) {
    return {
      error:
        "Admin login isn't configured yet — set ADMIN_PASSWORD and ADMIN_SESSION_SECRET in your environment.",
    };
  }

  const isValid = password.length > 0 && (await safeCompare(password, adminPassword));
  if (!isValid) {
    return { error: "Incorrect password." };
  }

  const token = await createAdminSessionToken(sessionSecret);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect(next.startsWith("/admin") ? next : "/admin");
}
