import React from 'react';
import Home from '@/components/Home';
import { generatePageMetadata } from '@/lib/seo';

// Generate metadata for the home page
export const metadata = generatePageMetadata({
  title: 'Home',
  description: 'Welcome to IDEA NMAMIT - Intelligence and Data Science Engineers\' Association. Explore our innovative projects, events, achievements, and community of data science enthusiasts at NMAM Institute of Technology.',
  keywords: ['home', 'welcome', 'data science community', 'student projects', 'AI innovations'],
});

const page = () => {
  return <Home />;
};

export default page;