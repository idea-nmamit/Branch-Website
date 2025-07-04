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
            category,
            fetchedAt
        } = body;

        if (!title || !link || !photoUrl || !date || !description) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Check if news with same title and link already exists
        const existingNews = await prisma.news.findFirst({
            where: {
                AND: [
                    { title: title },
                    { link: link }
                ]
            }
        });

        if (existingNews) {
            return NextResponse.json(
                { message: 'News item already exists', existing: true },
                { status: 200 }
            );
        }

        const NEWS = await prisma.news.create({
            data: {
                title,
                description,
                photoUrl,
                link,
                date: new Date(date),
                category,
                fetchedAt: fetchedAt ? new Date(fetchedAt) : new Date()
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

export async function DELETE() {
    try {
        // Delete all news items from the database
        await prisma.news.deleteMany({});

        return NextResponse.json(
            { message: 'All news items deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting news items:', error);
        return NextResponse.json(
            { error: 'Failed to delete news items: ' + error.message },
            { status: 500 }
        );
    }
}
