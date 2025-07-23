
"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import SSRLoader from '@/components/SSRLoader';
import React, { useState } from 'react';

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


export default function RootLayout({ children }) {
  const [hydrated, setHydrated] = useState(false);
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className={inter.className}>
        {!hydrated ? (
          <SSRLoader />
        ) : (
          <>
            <Navbar />
            <main>{children}</main>
            <Footer />
            <Toaster />
          </>
        )}
      </body>
    </html>
  );
}