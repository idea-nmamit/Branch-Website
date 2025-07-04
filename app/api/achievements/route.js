import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma";

export async function GET() {
    try {
        const achievements = await prisma.achievement.findMany({
            include: {
                members: true, // Include all members for each achievement
            },
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
            title,
            description,
            photoUrl,
            category,
            type,
            rank,
            event,
            organizer,
            venue,
            date,
            githubUrl,
            researchLink,
            projectUrl,
            certificateUrl,
            members, // Array of member objects
        } = body;

        if (!title || !description || !photoUrl || !category || !type || !date) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!members || !Array.isArray(members) || members.length === 0) {
            return NextResponse.json(
                { error: 'At least one member is required' },
                { status: 400 }
            );
        }

        const validCategory = category.toUpperCase();
        const validType = type.toUpperCase();

        const achievement = await prisma.achievement.create({
            data: {
                title,
                description,
                photoUrl,
                category: validCategory,
                type: validType,
                rank: rank || null,
                event: event || null,
                organizer: organizer || null,
                venue: venue || null,
                date: new Date(date),
                githubUrl: githubUrl || null,
                researchLink: researchLink || null,
                projectUrl: projectUrl || null,
                certificateUrl: certificateUrl || null,
                members: {
                    create: members.map(member => ({
                        name: member.name,
                        role: member.role || null,
                        rollNumber: member.rollNumber || null,
                        year: member.year || null,
                        branch: member.branch || null,
                        linkedinUrl: member.linkedinUrl || null,
                        githubUrl: member.githubUrl || null,
                        instagramUrl: member.instagramUrl || null,
                        portfolioUrl: member.portfolioUrl || null,
                        photoUrl: member.photoUrl || null,
                    }))
                }
            },
            include: {
                members: true,
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

