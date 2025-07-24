import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Achievements',
  description: 'Explore the remarkable achievements and recognitions earned by IDEA NMAMIT members in competitions, hackathons, research, and academic excellence.',
  keywords: ['achievements', 'awards', 'competitions', 'hackathons', 'research', 'recognition', 'excellence'],
  url: '/Achievements',
});

export default function AchievementsLayout({ children }) {
  return children;
}
