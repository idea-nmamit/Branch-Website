import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Events',
  description: 'Discover upcoming and past events organized by IDEA NMAMIT including workshops, seminars, technical talks, and competitions in data science and AI.',
  keywords: ['events', 'workshops', 'seminars', 'technical talks', 'competitions', 'hackathons', 'conferences'],
  url: '/Events',
});

export default function EventsLayout({ children }) {
  return children;
}
