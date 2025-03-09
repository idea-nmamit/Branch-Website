import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const achievements = await prisma.achievement.findMany({
            orderBy: {
                date: 'desc',
            },
        });

        return NextResponse.json(achievements);
    } catch (error) {
        console.error('Error fetching achievements:', error);
        return NextResponse.json(
            { error: 'Failed to fetch achievements' },
            { status: 500 }
        );
    }
}

