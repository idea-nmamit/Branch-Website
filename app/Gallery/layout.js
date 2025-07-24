import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Gallery',
  description: 'Browse through our visual journey showcasing memorable moments from IDEA NMAMIT events, workshops, achievements, and community activities.',
  keywords: ['gallery', 'photos', 'images', 'events', 'memories', 'moments', 'community'],
  url: '/Gallery',
});

export default function GalleryLayout({ children }) {
  return children;
}
