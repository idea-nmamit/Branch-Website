'use client';

import { generateJsonLd } from '@/lib/seo';

export default function StructuredData({ data }) {
  if (!data) return null;

  const jsonLd = generateJsonLd(data);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
