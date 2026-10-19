import { SITE_NAME, SITE_URL } from './metadata';

export function buildOrganizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/logo.png`,
    description: 'Verified matrimonial platform for Pakistani Muslim professionals with family participation and explainable compatibility.',
    sameAs: [
      'https://twitter.com/wasl_pk',
      'https://facebook.com/wasl.pk',
      'https://instagram.com/wasl.pk'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+92-42-111-9275',
      contactType: 'customer service',
      areaServed: 'PK',
      availableLanguage: ['English', 'Urdu']
    }
  };
}

export function buildFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer
      }
    }))
  };
}

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE_URL}${item.url}`
    }))
  };
}
