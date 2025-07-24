import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Maintenance',
  description: 'Website is currently under maintenance. We\'ll be back soon!',
  url: '/maintenance',
});

// Override robots for maintenance page
export const robots = {
  index: false,
  follow: false,
};

export default function MaintenanceLayout({ children }) {
  return children;
}
