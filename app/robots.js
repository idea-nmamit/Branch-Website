import { siteConfig } from '@/lib/seo';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/Admin/', '/maintenance/'],
    },
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
