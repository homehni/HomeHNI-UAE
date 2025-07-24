import { useEffect } from 'react';

const RobotsTxt = () => {
  useEffect(() => {
    // Set content type header if possible
    if (typeof document !== 'undefined') {
      const meta = document.createElement('meta');
      meta.httpEquiv = 'Content-Type';
      meta.content = 'text/plain';
      document.head.appendChild(meta);
    }
  }, []);

  const robotsContent = `# Allow all crawlers
User-agent: *

# Disallow sensitive areas
Disallow: /admin
Disallow: /dashboard
Disallow: /internal-api
Disallow: /test
Disallow: /staging

# Allow everything else
Allow: /

# Sitemap location
Sitemap: https://homehni.com/sitemap.xml`;

  return (
    <pre style={{ 
      fontFamily: 'monospace', 
      whiteSpace: 'pre-wrap',
      margin: 0,
      padding: 0,
      fontSize: '14px'
    }}>
      {robotsContent}
    </pre>
  );
};

export default RobotsTxt;