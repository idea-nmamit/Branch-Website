import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Define valid ENUM categories
const validCategories = [
    "TECHNICAL", "CULTURAL", "SPORTS", "SOCIAL", "ACADEMIC",
    "WORKSHOP", "SEMINAR", "INDUSTRIAL_VISIT", "PROJECT_EXHIBITION",
    "OUTREACH", "ORIENTATION"
];

// Fetch gallery items based on query parameters
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category'); // Get category filter
        const all = searchParams.get('all'); // Check if we need all images

        // Case 1: Fetch all images for the full gallery display
        if (all === 'true') {
            const allImages = await prisma.gallery.findMany({
                orderBy: { id: 'desc' },
            });
            
            // Log the number of images found for debugging
            console.log(`Fetched ${allImages.length} total images for gallery display`);
            
            return NextResponse.json(allImages);
        }
        
        // Case 2: Fetch images by specific category
        if (category) {
            // Validate category
            if (!validCategories.includes(category.toUpperCase())) {
                return NextResponse.json(
                    { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
                    { status: 400 }
                );
            }

            // Fetch filtered gallery items
            const filteredGallery = await prisma.gallery.findMany({
                where: { category: category.toUpperCase() },
                orderBy: { id: 'desc' },
            });
            return NextResponse.json(filteredGallery);
        } 
        
        // Case 3: Default - fetch carousel images
        else {
            // Fetch recent images for the carousel (limit to 5)
            const carouselItems = await prisma.gallery.findMany({
                where: { carousel: true },
                orderBy: { id: 'desc' },
                take: 5,
            });
            return NextResponse.json(carouselItems);
        }
    } catch (error) {
        console.error('Error fetching gallery items:', error);
        return NextResponse.json(
            { error: 'Failed to fetch gallery items' },
            { status: 500 }
        );
    }
}

// Add new gallery item (Admin Only)
export async function POST(request) {
    try {
        const body = await request.json();
        let { title, description, photoUrl, category, carousel } = body;

        if (!title || !description || !photoUrl || !category) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Convert category to uppercase and validate
        category = category.toUpperCase();

        if (!validCategories.includes(category)) {
            return NextResponse.json(
                { error: `Invalid category. Must be one of: ${validCategories.join(', ')}` },
                { status: 400 }
            );
        }

        const galleryItem = await prisma.gallery.create({
            data: {
                title,
                description,
                photoUrl,
                category,
                carousel: carousel || false,
            },
        });

        return NextResponse.json(galleryItem, { status: 201 });
    } catch (error) {
        console.error('Error creating gallery item:', error);
        return NextResponse.json(
            { error: 'Failed to create gallery item' },
            { status: 500 }
        );
    }
}
