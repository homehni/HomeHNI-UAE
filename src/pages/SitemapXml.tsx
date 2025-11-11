import { useEffect } from 'react';

const SitemapXml = () => {
  useEffect(() => {
    // Set content type header if possible
    if (typeof document !== 'undefined') {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Type';
      meta.content = 'application/xml';
      document.head.appendChild(meta);
    }
  }, []);

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://homehni.com/</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://homehni.com/about-us</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://homehni.com/legal-services</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://homehni.com/rental-agreement</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://homehni.com/rent-receipts</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://homehni.com/packers-movers</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://homehni.com/painting-cleaning</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://homehni.com/refer-earn</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://homehni.com/summons-notices</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://homehni.com/testimonials</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://homehni.com/careers</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://homehni.com/contact-us</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://homehni.com/faq</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://homehni.com/safety</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://homehni.com/grievance-redressal</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://homehni.com/report-problem</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>
  <url>
    <loc>https://homehni.com/terms-and-conditions</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
  <url>
    <loc>https://homehni.com/privacy-policy</loc>
    <lastmod>2025-01-24</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.3</priority>
  </url>
</urlset>`;

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      padding: 0,
      fontSize: '14px'
    }}>
      {sitemapContent}
    </pre>
  );
};

export default SitemapXml;
