// SEO configuration and utilities
export const siteConfig = {
  name: 'IDEA NMAMIT',
  title: 'Intelligence and Data Science Engineers\' Association - NMAMIT',
  description: 'The official website of Intelligence and Data Science Engineers\' Association at NMAM Institute of Technology. Discover our events, achievements, team, and innovations in data science and AI.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ideanmamit.com',
  ogImage: '/og-image.jpg',
  keywords: [
    'IDEA NMAMIT',
    'data science',
    'artificial intelligence',
    'machine learning',
    'NMAM Institute of Technology',
    'engineering association',
    'student organization',
    'technical events',
    'workshops',
    'innovation'
  ],
  author: 'IDEA NMAMIT',
  social: {
    twitter: '@ideanmamit',
    instagram: '@idea_nmamit',
    linkedin: '/company/idea-nmamit'
  }
};

// Generate page-specific metadata
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  image,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  section
}) {
  const metaTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const metaDescription = description || siteConfig.description;
  const metaImage = image || siteConfig.ogImage;
  const metaUrl = url ? `${siteConfig.url}${url}` : siteConfig.url;
  const allKeywords = [...siteConfig.keywords, ...keywords].join(', ');

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: allKeywords,
    authors: [{ name: siteConfig.author }],
    creator: siteConfig.author,
    publisher: siteConfig.author,
    metadataBase: new URL(siteConfig.url),
    alternates: {
      canonical: metaUrl,
    },
    openGraph: {
      type,
      locale: 'en_US',
      url: metaUrl,
      title: metaTitle,
      description: metaDescription,
      siteName: siteConfig.name,
      images: [
        {
          url: metaImage,
          width: 1200,
          height: 630,
          alt: metaTitle,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(section && { section }),
    },
    twitter: {
      card: 'summary_large_image',
      title: metaTitle,
      description: metaDescription,
      images: [metaImage],
      creator: siteConfig.social.twitter,
      site: siteConfig.social.twitter,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// Generate JSON-LD structured data
export function generateJsonLd(data) {
  return {
    '@context': 'https://schema.org',
    ...data,
  };
}

// Common structured data templates
export const structuredDataTemplates = {
  organization: {
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/Logo-Light.png`,
    description: siteConfig.description,
    sameAs: [
      `https://twitter.com/${siteConfig.social.twitter.replace('@', '')}`,
      `https://instagram.com/${siteConfig.social.instagram.replace('@', '')}`,
      `https://linkedin.com${siteConfig.social.linkedin}`,
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Organization',
    },
  },
  
  website: {
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
  },

  event: (event) => ({
    '@type': 'Event',
    name: event.title,
    description: event.description,
    startDate: event.date,
    location: {
      '@type': 'Place',
      name: 'NMAM Institute of Technology',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Udupi',
        addressRegion: 'Karnataka',
        addressCountry: 'India',
      },
    },
    url: `${siteConfig.url}/Events/${event.id}`,
    image: event.image,
    organizer: {
      '@type': 'Organization',
      name: siteConfig.name,
      url: siteConfig.url,
    },
  }),

  article: (article) => ({
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.publishedTime,
    dateModified: article.modifiedTime || article.publishedTime,
    author: {
      '@type': 'Organization',
      name: siteConfig.name,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/Logo-Light.png`,
      },
    },
    url: article.url,
  }),
};
