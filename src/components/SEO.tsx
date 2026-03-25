import { useEffect } from 'react';

interface SEOProps {
  title: string;
  description: string;
  path: string;
  keywords?: string;
  schema?: Record<string, unknown>;
}

const SITE_URL = 'https://www.bankifsccode.biz';

function setMeta(name: string, content: string, property = false) {
  const selector = property ? `meta[property="${name}"]` : `meta[name="${name}"]`;
  let meta = document.head.querySelector(selector) as HTMLMetaElement | null;

  if (!meta) {
    meta = document.createElement('meta');
    if (property) {
      meta.setAttribute('property', name);
    } else {
      meta.name = name;
    }
    document.head.appendChild(meta);
  }

  meta.content = content;
}

export function SEO({ title, description, path, keywords, schema }: SEOProps) {
  useEffect(() => {
    document.title = title;

    const canonicalUrl = `${SITE_URL}${path}`;

    setMeta('description', description);
    setMeta('keywords', keywords ?? 'bank IFSC code, bankifsccode.biz tools, financial calculators India');
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('og:url', canonicalUrl, true);
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);

    let canonical = document.head.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    let schemaNode = document.head.querySelector('script[data-seo-schema="true"]') as HTMLScriptElement | null;
    if (schema) {
      if (!schemaNode) {
        schemaNode = document.createElement('script');
        schemaNode.type = 'application/ld+json';
        schemaNode.dataset.seoSchema = 'true';
        document.head.appendChild(schemaNode);
      }
      schemaNode.textContent = JSON.stringify(schema);
    } else if (schemaNode) {
      schemaNode.remove();
    }

    return () => {
      const existingNode = document.head.querySelector('script[data-seo-schema="true"]');
      if (existingNode) existingNode.remove();
    };
  }, [title, description, path, keywords, schema]);

  return null;
}
