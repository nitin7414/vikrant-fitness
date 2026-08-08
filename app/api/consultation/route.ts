import { NextResponse } from "next/server";
import { MOCK_CONSULTATION_SLOTS, MOCK_BOOKINGS } from "@/lib/data";
import { ConsultationBooking } from "@/lib/types";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    let slots = MOCK_CONSULTATION_SLOTS;
    if (date) {
      slots = MOCK_CONSULTATION_SLOTS.filter((s) => s.date === date);
    }

    return NextResponse.json({
      success: true,
      data: slots,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch slots";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      age,
      gender,
      fitnessGoal,
      activityLevel,
      medicalConditions,
      preferredDate,
      preferredTime,
      notes,
    } = body;

    // Strict field validations
    if (!name || !email || !fitnessGoal) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields. Name, email, and fitness goal are mandatory.",
        },
        { status: 400 }
      );
    }

    const newBooking: ConsultationBooking & { source?: string } = {
      id: `bk-${Date.now().toString().slice(-6)}`,
      name,
      email,
      phone: phone || "Not provided",
      age: Number(age) || 25,
      gender: gender || "Not specified",
      fitnessGoal,
      activityLevel: activityLevel || "Moderate",
      medicalConditions: medicalConditions || "None",
      preferredDate: preferredDate || new Date().toISOString().split("T")[0],
      preferredTime: preferredTime || "Flexible / 1-on-1 Call",
      notes: notes || "",
      createdAt: new Date().toISOString(),
      status: "confirmed",
      source: body.source || "consultation",
    };

    // Store booking
    MOCK_BOOKINGS.unshift(newBooking);

    // Mark slot as booked if matching slot exists
    const matchingSlot = MOCK_CONSULTATION_SLOTS.find(
      (s) => s.date === preferredDate && s.time === preferredTime
    );
    if (matchingSlot) {
      matchingSlot.available = false;
    }

    return NextResponse.json(
      {
        success: true,
        message: `Consultation booked successfully for ${preferredDate} at ${preferredTime}! Check your email for meeting link details.`,
        data: newBooking,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to book consultation";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
