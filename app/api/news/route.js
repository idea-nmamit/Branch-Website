import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const newss = await prisma.news.findMany({
            orderBy: {
                date: 'desc',
            },
        });

        return NextResponse.json(newss);
    } catch (error) {
        console.error('Error fetching newss:', error);
        return NextResponse.json(
            { error: 'Failed to fetch newss' },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            title,
            description,
            photoUrl,
            link,
            date,
        } = body;

        if (!title || !link || !photoUrl || !date) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }


        const NEWS = await prisma.news.create({
            data: {
                title,
                description: description || null,
                photoUrl,
                link,
                date: new Date(date),
            },
        });
        return NextResponse.json(NEWS, { status: 201 });
    } catch (error) {
        console.error('Error creating NEWS:', error);
        return NextResponse.json(
            { error: 'Failed to create NEWS: ' + error.message },
            { status: 500 }
        );
    }
}

