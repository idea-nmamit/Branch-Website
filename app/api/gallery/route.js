import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// Global in-memory cache and expiration duration (1 minute)
const cache = {};
const CACHE_DURATION = 60000;

// Define valid ENUM categories
const validCategories = [
    "TECHNICAL", "CULTURAL", "SPORTS", "SOCIAL", "ACADEMIC",
    "WORKSHOP", "SEMINAR", "INDUSTRIAL_VISIT", "PROJECT_EXHIBITION",
    "OUTREACH", "ORIENTATION"
];

// Fetch gallery items based on query parameters
export async function GET(request) {
    try {
        const cacheKey = request.url;
        // Return cached response if available and not expired
        if (cache[cacheKey] && (Date.now() - cache[cacheKey].timestamp < CACHE_DURATION)) {
            return NextResponse.json(cache[cacheKey].data);
        }
        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category'); // Get category filter
        const all = searchParams.get('all'); // Check if we need all images
        const search = searchParams.get('search'); // Get search query

        let result;
        // Case 0: Search for images by title or description
        if (search) {
            const searchResults = await prisma.gallery.findMany({
                where: {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { description: { contains: search, mode: 'insensitive' } }
                    ]
                },
                orderBy: { id: 'desc' },
            });
            
            console.log(`Found ${searchResults.length} images matching search: "${search}"`);
            result = searchResults;
        } 
        // Case 1: Fetch all images for the full gallery display
        else if (all === 'true') {
            const allImages = await prisma.gallery.findMany({
                orderBy: { id: 'desc' },
            });
            
            // Log the number of images found for debugging
            console.log(`Fetched ${allImages.length} total images for gallery display`);
            
            result = allImages;
        } 
        // Case 2: Fetch images by specific category
        else if (category) {
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
            result = filteredGallery;
        } 
        // Case 3: Default - fetch carousel images
        else {
            // Fetch recent images for the carousel (limit to 5)
            const carouselItems = await prisma.gallery.findMany({
                where: { carousel: true },
                orderBy: { id: 'desc' },
                take: 5,
            });
            result = carouselItems;
        }
        // Cache and return the result
        cache[cacheKey] = { data: result, timestamp: Date.now() };
        return NextResponse.json(result);
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
