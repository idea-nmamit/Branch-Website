import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const { category, refreshInterval } = await request.json();

        const where = {
            fetchedAt: {
                gte: new Date(Date.now() - refreshInterval)
            }
        };

        if (category && category !== 'all') {
            where.category = category;
        }

        const newsItems = await prisma.news.findMany({
            where,
            orderBy: {
                date: 'desc',
            },
        });

        return NextResponse.json(newsItems);
    } catch (error) {
        console.error('Error fetching news:', error);
        return NextResponse.json(
            { error: 'Failed to fetch news' },
            { status: 500 }
        );
    }
}