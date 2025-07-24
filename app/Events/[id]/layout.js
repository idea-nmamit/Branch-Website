import { generatePageMetadata, structuredDataTemplates } from '@/lib/seo';
import StructuredData from '@/components/StructuredData';

// Generate metadata for individual event pages
export async function generateMetadata({ params }) {
  const { id } = params;
  
  try {
    // Fetch event data (you would replace this with your actual API call)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/events/${id}`, { 
      cache: 'no-store' 
    });
    
    if (!response.ok) {
      return generatePageMetadata({
        title: 'Event Not Found',
        description: 'The requested event could not be found.',
      });
    }
    
    const event = await response.json();
    
    return generatePageMetadata({
      title: event.title,
      description: event.description || `Join us for ${event.title} - an exciting event organized by IDEA NMAMIT.`,
      keywords: ['event', event.title, 'IDEA NMAMIT', 'workshop', 'seminar'],
      url: `/Events/${id}`,
      image: event.image,
      type: 'article',
      publishedTime: event.date,
    });
  } catch (error) {
    return generatePageMetadata({
      title: 'Event',
      description: 'Discover this exciting event organized by IDEA NMAMIT.',
      url: `/Events/${id}`,
    });
  }
}

export default async function EventLayout({ children, params }) {
  const { id } = params;
  
  // Fetch event data for structured data
  let eventData = null;
  try {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const response = await fetch(`${baseUrl}/api/events/${id}`, { 
      cache: 'no-store' 
    });
    if (response.ok) {
      eventData = await response.json();
    }
  } catch (error) {
    console.error('Failed to fetch event data for structured data:', error);
  }

  return (
    <>
      {eventData && (
        <StructuredData data={structuredDataTemplates.event(eventData)} />
      )}
      {children}
    </>
  );
}
