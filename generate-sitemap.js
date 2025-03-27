const fs = require('fs');
const baseUrl = 'https://alien-stories.vercel.app';

const pages = [
  {
    path: '/',
    changefreq: 'daily',
    priority: 1.0
  },
  {
    path: '/submit',
    changefreq: 'weekly',
    priority: 0.8
  },
  {
    path: '/privacy',
    changefreq: 'monthly',
    priority: 0.5
  },
  {
    path: '/terms',
    changefreq: 'monthly',
    priority: 0.5
  },
  {
    path: '/about',
    changefreq: 'monthly',
    priority: 0.7
  }
];

const sitemapXML = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${pages.map(page => `
    <url>
      <loc>${baseUrl}${page.path}</loc>
      <changefreq>${page.changefreq}</changefreq>
      <priority>${page.priority}</priority>
      <lastmod>${new Date().toISOString()}</lastmod>
    </url>
  `).join('')}
</urlset>`;

fs.writeFileSync('public/sitemap.xml', sitemapXML);
console.log('Sitemap generated successfully!');