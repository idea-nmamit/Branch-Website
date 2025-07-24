import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: '404 - Page Not Found',
  description: 'The page you are looking for could not be found. Return to IDEA NMAMIT homepage or explore our other sections.',
});

export default function NotFoundLayout({ children }) {
  return children;
}
