
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import StructuredData from '@/components/StructuredData';
import { siteConfig, structuredDataTemplates, generatePageMetadata } from '@/lib/seo';

import { Inter, Montserrat, Poppins } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-montserrat',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  display: 'swap',
  variable: '--font-poppins',
});


// Generate metadata for the root layout
export const metadata = generatePageMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`}>
      <head>
        <StructuredData data={structuredDataTemplates.organization} />
        <StructuredData data={structuredDataTemplates.website} />
      </head>
      <body className={inter.className}>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  );
}