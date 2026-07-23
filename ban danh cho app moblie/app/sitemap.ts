import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sonify.vercel.app';

  const staticPages = [
    '/ban danh cho app moblie/app',
    '/ban danh cho app moblie/app/rankings',
    '/ban danh cho app moblie/app/account',
    '/ban danh cho app moblie/app/login',
    '/ban danh cho app moblie/app/register',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split('T')[0],
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  return staticPages;
}
