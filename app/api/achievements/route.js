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

export async function POST(request) {
    try {
        const body = await request.json();
        const {
            name,
            title,
            description,
            photoUrl,
            category,
            rank,
            githubUrl,
            linkedinUrl,
            instagramUrl,
            researchLink,
            date,
        } = body;

        if (!name || !title || !description || !photoUrl || !category || !date) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        const validCategory = category.toUpperCase();

        const achievement = await prisma.achievement.create({
            data: {
                name,
                title,
                description,
                photoUrl,
                category: validCategory,
                rank: rank || null,
                githubUrl: githubUrl || null,
                linkedinUrl: linkedinUrl || null,
                instagramUrl: instagramUrl || null,
                researchLink: researchLink || null,
                date: new Date(date),
            },
        });
        return NextResponse.json(achievement, { status: 201 });
    } catch (error) {
        console.error('Error creating achievement:', error);
        return NextResponse.json(
            { error: 'Failed to create achievement: ' + error.message },
            { status: 500 }
        );
    }
}

