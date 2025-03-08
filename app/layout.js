import { ThemeProvider } from 'next-themes';
import Navbar from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'IDEA',
  description: 'IDEA is a student-run organization at the University of NMAMIT, Nitte that aims to foster a community of innovation and entrepreneurship.',
  image: '/Logo-Dark.png',
  url: 'https://idea-utsc.ca',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider 
          attribute="class" 
          defaultTheme="light"
          enableSystem={true}
        >
          <Navbar />
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}