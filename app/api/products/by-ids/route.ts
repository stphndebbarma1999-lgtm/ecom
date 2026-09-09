import { NextResponse, type NextRequest } from "next/server";
import { getProductsByIds } from "@/lib/db/products";

export async function GET(request: NextRequest) {
  const idsParam = request.nextUrl.searchParams.get("ids") ?? "";
  const ids = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);
  const products = await getProductsByIds(ids);
  return NextResponse.json({ products });
}
