import prisma from '@/lib/prisma';
import { NextResponse } from 'next/server';

// GET: Get current maintenance mode
export async function GET() {
  try {
    const settings = await prisma.settings.findFirst();
    return NextResponse.json({ maintenanceMode: settings?.maintenanceMode || false });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json({ maintenanceMode: false }, { status: 500 });
  }
}

// POST: Update maintenance mode
export async function POST(request) {
  try {
    const { maintenanceMode } = await request.json();
    const updated = await prisma.settings.upsert({
      where: { id: 1 },
      update: { maintenanceMode },
      create: { maintenanceMode },
    });
    return NextResponse.json({ maintenanceMode: updated.maintenanceMode });
  } catch (error) {
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Failed to update settings' }, { status: 500 });
  }
}
