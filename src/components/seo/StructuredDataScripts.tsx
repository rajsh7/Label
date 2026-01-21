/**
 * Schema.org Structured Data Scripts
 * Server component that renders JSON-LD scripts
 */

export function StructuredDataScripts() {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://labelpro.com'

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'LabelPro',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@labelpro.io',
    },
    sameAs: [
      'https://twitter.com/labelpro',
      'https://linkedin.com/company/labelpro',
    ],
  }

  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'LabelPro',
    applicationCategory: 'BusinessApplication',
    operatingSystem: ['Web Browser', 'Windows', 'macOS', 'Linux'],
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: 4.8,
      ratingCount: 124,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(softwareApplicationSchema),
        }}
      />
    </>
  )
}

