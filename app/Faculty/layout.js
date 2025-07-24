import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Faculty',
  description: 'Meet our dedicated faculty members and advisors who guide and mentor IDEA NMAMIT in our journey of innovation and learning in data science and artificial intelligence.',
  keywords: ['faculty', 'advisors', 'mentors', 'professors', 'guidance', 'academic'],
  url: '/Faculty',
});

export default function FacultyLayout({ children }) {
  return children;
}
