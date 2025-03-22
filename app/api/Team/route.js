import { NextResponse } from 'next/server'
import prisma from "@/lib/prisma";

export async function GET(request) {
  try {
    // Get the year query parameter, if provided
    const { searchParams } = new URL(request.url);
    const year = searchParams.get('year');
    const category = searchParams.get('category');
    
    // Build the query conditions
    const whereCondition = {};
    if (year) {
      whereCondition.year = year;
    }
    if (category) {
      whereCondition.category = category;
    }

    // Fetch team members with optional filtering
    const teamMembers = await prisma.teamPage.findMany({
      where: whereCondition,
      orderBy: {
        id: 'asc',
      },
    });

    return NextResponse.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members: ' + error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`;
    } catch (dbError) {
      console.error('Database connection error:', dbError);
      return NextResponse.json(
        { error: 'Database connection error: ' + dbError.message },
        { status: 503 }
      );
    }
    
    // Parse the incoming request body
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error('Error parsing request body:', parseError);
      return NextResponse.json(
        { error: 'Invalid request body format: ' + parseError.message },
        { status: 400 }
      );
    }

    const { 
      name, 
      role, 
      category, 
      photoUrl, 
      linkedinUrl, 
      githubUrl, 
      instagramUrl, 
      year, 
      quote,
      attendees, 
    } = body;

    // Validate required fields
    if (!name || !role || !category || !photoUrl || !year) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create the team member in the database
    const teamMember = await prisma.teamPage.create({
      data: {
        name,
        role,
        category,
        photoUrl,
        linkedinUrl,
        githubUrl,
        instagramUrl,
        year,
        quote,
        attendees,
      },
    });

    return NextResponse.json(teamMember, { status: 201 });
  } catch (error) {
    console.error('Error creating team member:', error);
    
    // More specific error handling
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'A team member with this information already exists' },
        { status: 400 }
      );
    } else if (error.code === 'P2003') {
      return NextResponse.json(
        { error: 'Invalid category value' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create team member: ' + error.message },
      { status: 500 }
    );
  }
}