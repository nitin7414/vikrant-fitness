import { NextResponse } from "next/server";
import { MOCK_SERVICES } from "@/lib/data";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const id = searchParams.get("id");

    if (id) {
      const service = MOCK_SERVICES.find((s) => s.id === id);
      if (!service) {
        return NextResponse.json(
          { success: false, error: "Service not found" },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, data: service });
    }

    let filtered = MOCK_SERVICES;
    if (category && category !== "all") {
      filtered = MOCK_SERVICES.filter((s) => s.category === category);
    }

    return NextResponse.json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to fetch services";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { serviceId, name, email, phone, message } = body;

    if (!name || !email || !serviceId) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: name, email, serviceId" },
        { status: 400 }
      );
    }

    const service = MOCK_SERVICES.find((s) => s.id === serviceId);

    const inquiry = {
      id: `inq-${Date.now()}`,
      serviceId,
      serviceTitle: service ? service.title : serviceId,
      name,
      email,
      phone: phone || "",
      message: message || "",
      submittedAt: new Date().toISOString(),
      status: "received"
    };

    return NextResponse.json(
      {
        success: true,
        message: "Thank you! Your program inquiry has been received. Coach Vikrant will contact you within 24 hours.",
        data: inquiry,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Failed to submit inquiry";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
