import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req, context) {
  try {
    // Await the params object
    const params = await context.params;
    
    if (!params || !params.id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const eventId = parseInt(params.id, 10);

    if (isNaN(eventId)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const event = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json({ error: "Failed to fetch event" }, { status: 500 });
  }
}