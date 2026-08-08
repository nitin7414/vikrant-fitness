import { NextResponse } from "next/server";
import { MOCK_USER, MOCK_BOOKINGS } from "@/lib/data";

export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      data: {
        ...MOCK_USER,
        consultationBookings: MOCK_BOOKINGS,
      },
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch user profile";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { currentWeightKg, targetWeightKg, heightCm, fitnessGoal, activePlan } = body;

    if (currentWeightKg !== undefined) MOCK_USER.currentWeightKg = Number(currentWeightKg);
    if (targetWeightKg !== undefined) MOCK_USER.targetWeightKg = Number(targetWeightKg);
    if (heightCm !== undefined) MOCK_USER.heightCm = Number(heightCm);
    if (fitnessGoal !== undefined) MOCK_USER.fitnessGoal = String(fitnessGoal);
    if (activePlan !== undefined) MOCK_USER.activePlan = String(activePlan);

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully!",
      data: MOCK_USER,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
