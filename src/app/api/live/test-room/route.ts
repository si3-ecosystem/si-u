import { NextRequest, NextResponse } from "next/server";
import { createTestRoom } from "@/lib/services/huddle";

export async function POST(_req: NextRequest) {
  try {
    const room = await createTestRoom();
    return NextResponse.json({ success: true, room });
  } catch (e: any) {
    console.error("/api/live/test-room error", e);
    return NextResponse.json({ error: e?.message || "Failed to create room" }, { status: 500 });
  }
}


