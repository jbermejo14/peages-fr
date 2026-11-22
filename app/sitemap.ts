import type { MetadataRoute } from 'next';
import { absoluteUrl } from '@/lib/site';
import { getAllTrajets, getAllAutoroutes } from '@/lib/peages';
import { getAllGuides } from '@/lib/guides';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const trajets = getAllTrajets();
  const autoroutes = getAllAutoroutes();
  const guides = getAllGuides();

  const trajetRoutes: MetadataRoute.Sitemap = trajets.map((t) => ({
    url: absoluteUrl(`/trajet/${t.id}`),
    lastModified,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const autorouteRoutes: MetadataRoute.Sitemap = autoroutes.map((a) => ({
    url: absoluteUrl(`/autoroute/${a.code}`),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const guideRoutes: MetadataRoute.Sitemap = guides.map((guide) => ({
    url: absoluteUrl(`/guide/${guide.slug}`),
    lastModified,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  const legalRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/mentions-legales'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/confidentialite'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: absoluteUrl('/cookies'),
      lastModified,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  return [
    {
      url: absoluteUrl('/'),
      lastModified,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    ...trajetRoutes,
    ...autorouteRoutes,
    ...guideRoutes,
    ...legalRoutes,
  ];
}
