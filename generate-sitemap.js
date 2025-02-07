const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');

const sitemap = new SitemapStream({ hostname: 'https://alien-stories.vercel.app' });

const pages = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/submit', changefreq: 'weekly', priority: 0.8 }
];

pages.forEach((page) => sitemap.write(page));
sitemap.end();

streamToPromise(sitemap).then((data) => {
  fs.writeFileSync('./public/sitemap.xml', data);
});
