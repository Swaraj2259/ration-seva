import { NextResponse } from "next/server";
import { getSystemStats } from "@/server/db";

export async function GET() {
  try {
    const stats = getSystemStats();
    return NextResponse.json({ success: true, data: stats });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch stats." }, { status: 500 });
  }
}
