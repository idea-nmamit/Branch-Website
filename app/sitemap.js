import { siteConfig } from '@/lib/seo';

export default function sitemap() {
  const baseUrl = siteConfig.url;
  
  // Static routes
  const staticRoutes = [
    '',
    '/Team-Page',
    '/Events',
    '/Achievements',
    '/Faculty',
    '/Gallery',
    '/News',
    '/Neural-Network',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '' ? 'daily' : 'weekly',
    priority: route === '' ? 1 : 0.8,
  }));

  return staticRoutes;
}
