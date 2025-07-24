import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Our Team',
  description: 'Meet the talented members of IDEA NMAMIT - our office bearers, coordinators, and student developers who drive innovation in data science and artificial intelligence.',
  keywords: ['team', 'members', 'office bearers', 'coordinators', 'student developers', 'leadership'],
  url: '/Team-Page',
});

export default function TeamLayout({ children }) {
  return children;
}
