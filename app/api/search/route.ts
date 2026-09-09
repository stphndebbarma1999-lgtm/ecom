import { NextResponse, type NextRequest } from "next/server";
import { searchProducts } from "@/lib/db/products";

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q") ?? "";
  const results = q.trim() ? await searchProducts(q, 8) : [];
  return NextResponse.json({ results });
}
