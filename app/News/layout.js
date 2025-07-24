import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'News',
  description: 'Stay updated with the latest news, announcements, and updates from IDEA NMAMIT including new initiatives, partnerships, and community highlights.',
  keywords: ['news', 'announcements', 'updates', 'initiatives', 'partnerships', 'community'],
  url: '/News',
});

export default function NewsLayout({ children }) {
  return children;
}
