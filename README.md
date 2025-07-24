# IDEA NMAMIT Website

The official website for Intelligence and Data Science Engineers' Association at NMAM Institute of Technology, built with Next.js 15 and optimized for performance and SEO.

## Features

- **Modern Next.js 15** with App Router
- **SEO Optimized** with dynamic meta tags, Open Graph, and Twitter Cards
- **Structured Data** (JSON-LD) for better search engine visibility
- **Performance Optimized** with image optimization and lazy loading
- **Responsive Design** with Tailwind CSS
- **Accessibility Focused** with proper alt texts and semantic HTML
- **Dynamic Content** with Prisma database integration

## SEO Features

### Meta Tags & Social Media
- Dynamic meta tags for each page
- Open Graph tags for social media sharing
- Twitter Card optimization
- Canonical URLs for better indexing

### Structured Data
- Organization schema markup
- Event schema for events pages
- Article schema for news/blog content
- Breadcrumb navigation schema

### Performance
- Optimized images with WebP/AVIF formats
- Lazy loading for images
- Compression enabled
- Proper caching headers

### Accessibility
- Alt text for all images
- Semantic HTML structure
- Proper heading hierarchy
- Screen reader friendly

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- PostgreSQL database (or use Prisma Postgres)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/idea-nmamit/Branch-Website.git
cd Branch-Website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration:
```env
NEXT_PUBLIC_SITE_URL=http://localhost:3000
DATABASE_URL="your-database-url"
```

4. Set up the database:
```bash
npm run db:reset
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website.

## SEO Configuration

### Site Configuration
Update `/lib/seo.js` to customize:
- Site name and description
- Keywords and social media handles
- Open Graph images
- Structured data templates

### Page-Specific SEO
Each page can have custom metadata by updating the respective layout files:
- `/app/layout.js` - Global metadata
- `/app/[page]/layout.js` - Page-specific metadata

### Adding New Pages
When adding new pages:
1. Create the page component
2. Add a `layout.js` file with proper metadata
3. Update sitemap.js if needed
4. Add structured data if applicable

## Performance Optimization

### Images
- Use the `OptimizedImage` component for all images
- Provide proper alt text for accessibility
- Set appropriate `sizes` attribute for responsive images

### Lazy Loading
- Images are lazy-loaded by default
- Use `priority={true}` for above-the-fold images

### Caching
- Static assets are cached for 1 year
- API responses include appropriate cache headers

## Scripts

- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run seo:validate` - Validate SEO implementation
- `npm run db:seed` - Seed database
- `npm run db:reset` - Reset and seed database

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── layout.js          # Root layout with global metadata
│   ├── page.js            # Homepage
│   ├── sitemap.js         # Dynamic sitemap
│   ├── robots.js          # Robots.txt configuration
│   └── [pages]/           # Individual pages with layouts
├── components/            # Reusable components
│   ├── OptimizedImage.jsx # SEO-optimized image component
│   ├── StructuredData.jsx # JSON-LD structured data
│   └── ui/               # UI components
├── lib/
│   └── seo.js            # SEO configuration and utilities
├── public/               # Static assets
└── prisma/               # Database schema and migrations
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Branch-Website
