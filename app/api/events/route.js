import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.event.findMany({
      orderBy: {
        date: 'asc',
      },
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
}

export async function POST(request) {
  try {
    const body = await request.json()

    const { name, venue, date, time, description, imageURL, type, attendees } = body

    if (!name || !venue || !date || !time || !description || !type) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const dateTime = new Date(`${date}T${time}:00`);

    const event = await prisma.event.create({
      data: {
        name,
        type,
        venue,
        date: dateTime,
        image: imageURL || '',
        description,
        attendees: parseInt(attendees) || 0, // Parse as integer and provide default value
      },
    })

    return NextResponse.json(event, { status: 201 })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event: ' + error.message },
      { status: 500 }
    )
  }
}