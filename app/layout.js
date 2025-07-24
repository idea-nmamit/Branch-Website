
"use client";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Toaster } from '@/components/ui/sonner';
import SSRLoader from '@/components/SSRLoader';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';

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
  const pathname = usePathname();
  
  // Check if current route is maintenance page
  const isMaintenancePage = pathname === '/maintenance';
  
  React.useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <html lang="en" className={`${montserrat.variable} ${poppins.variable}`} suppressHydrationWarning>
      <head>
        {isMaintenancePage && (
          <>
            <title>Maintenance - IDEA NMAMIT</title>
            <meta name="description" content="Website is currently under maintenance. We'll be back soon!" />
            <meta name="robots" content="noindex, nofollow" />
          </>
        )}
      </head>
      <body suppressHydrationWarning className={inter.className}>
        {!hydrated ? (
          <SSRLoader />
        ) : (
          <>
            {!isMaintenancePage && <Navbar />}
            {isMaintenancePage ? children : <main>{children}</main>}
            {!isMaintenancePage && <Footer />}
            <Toaster />
          </>
        )}
      </body>
    </html>
  );
}