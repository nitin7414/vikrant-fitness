import { NextResponse } from "next/server";
import { MOCK_TRAINER } from "@/lib/data";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: MOCK_TRAINER,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch trainer bio";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
