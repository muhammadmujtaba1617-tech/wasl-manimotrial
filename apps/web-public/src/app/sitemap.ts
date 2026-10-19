import { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/seo/metadata';

export default function sitemap(): MetadataRoute.Sitemap {
  const cities = ['lahore', 'islamabad', 'karachi', 'faisalabad'];

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${SITE_URL}/how-it-works`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    },
    {
      url: `${SITE_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8
    }
  ];

  const cityRoutes: MetadataRoute.Sitemap = cities.map(city => ({
    url: `${SITE_URL}/city/${city}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.9
  }));

  return [...staticRoutes, ...cityRoutes];
}
