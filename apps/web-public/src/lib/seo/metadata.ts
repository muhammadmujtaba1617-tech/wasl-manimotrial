import { Metadata } from 'next';

export const SITE_NAME = 'Wasl Matrimonial';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://wasl.pk';

export interface SeoProps {
  title: string;
  description: string;
  canonicalPath?: string;
  ogImage?: string;
  noindex?: boolean;
}

export function generateSeoMetadata({
  title,
  description,
  canonicalPath = '',
  ogImage = '/og-image.jpg',
  noindex = false
}: SeoProps): Metadata {
  const url = `${SITE_URL}${canonicalPath}`;

  return {
    title: `${title} | ${SITE_NAME}`,
    description,
    alternates: {
      canonical: url,
      languages: {
        'en-PK': url,
        'ur-PK': `${url}?lang=ur`
      }
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      images: [
        {
          url: ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`,
          width: 1200,
          height: 630,
          alt: title
        }
      ],
      locale: 'en_PK',
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | ${SITE_NAME}`,
      description,
      images: [ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`]
    },
    robots: noindex
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1
          }
        }
  };
}
