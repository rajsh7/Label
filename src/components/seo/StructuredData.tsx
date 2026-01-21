/**
 * Schema.org Structured Data Component
 * Adds JSON-LD structured data for SEO
 */

export interface OrganizationSchema {
  name: string
  url: string
  logo?: string
  contactPoint?: {
    telephone?: string
    contactType: string
    email?: string
  }
  sameAs?: string[]
}

export interface SoftwareApplicationSchema {
  name: string
  applicationCategory: string
  operatingSystem: string[]
  offers: {
    price: string
    priceCurrency: string
    availability?: string
  }
  aggregateRating?: {
    ratingValue: number
    ratingCount: number
  }
}

export interface StructuredDataProps {
  organization?: OrganizationSchema
  softwareApplication?: SoftwareApplicationSchema
}

/**
 * StructuredData component - renders JSON-LD schema.org markup
 */
export function StructuredData({ organization, softwareApplication }: StructuredDataProps) {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://labelpro.com'

  const organizationSchema: OrganizationSchema = organization || {
    name: 'LabelPro',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    contactPoint: {
      contactType: 'Customer Support',
      email: 'support@labelpro.io',
    },
    sameAs: [
      'https://twitter.com/labelpro',
      'https://linkedin.com/company/labelpro',
    ],
  }

  const softwareApplicationSchema: SoftwareApplicationSchema = softwareApplication || {
    name: 'LabelPro',
    applicationCategory: 'BusinessApplication',
    operatingSystem: ['Web Browser', 'Windows', 'macOS', 'Linux'],
    offers: {
      price: '0',
      priceCurrency: 'USD',
      availability: 'https://schema.org/InStock',
    },
    aggregateRating: {
      ratingValue: 4.8,
      ratingCount: 124,
    },
  }

  return (
    <>
      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Organization',
            name: organizationSchema.name,
            url: organizationSchema.url,
            logo: organizationSchema.logo,
            contactPoint: organizationSchema.contactPoint
              ? {
                  '@type': 'ContactPoint',
                  telephone: organizationSchema.contactPoint.telephone,
                  contactType: organizationSchema.contactPoint.contactType,
                  email: organizationSchema.contactPoint.email,
                }
              : undefined,
            sameAs: organizationSchema.sameAs,
          }),
        }}
      />

      {/* SoftwareApplication Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: softwareApplicationSchema.name,
            applicationCategory: softwareApplicationSchema.applicationCategory,
            operatingSystem: softwareApplicationSchema.operatingSystem,
            offers: {
              '@type': 'Offer',
              price: softwareApplicationSchema.offers.price,
              priceCurrency: softwareApplicationSchema.offers.priceCurrency,
              availability: softwareApplicationSchema.offers.availability,
            },
            aggregateRating: softwareApplicationSchema.aggregateRating
              ? {
                  '@type': 'AggregateRating',
                  ratingValue: softwareApplicationSchema.aggregateRating.ratingValue,
                  ratingCount: softwareApplicationSchema.aggregateRating.ratingCount,
                }
              : undefined,
          }),
        }}
      />
    </>
  )
}

