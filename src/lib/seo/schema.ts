/**
 * Schema.org JSON-LD markup generator
 */

export interface OrganizationSchema {
  name: string
  url: string
  logo?: string
  description?: string
  contactPoint?: {
    contactType: string
    email: string
    availableLanguage: string[]
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
  }
  aggregateRating?: {
    ratingValue: number
    ratingCount: number
  }
}

export interface WebSiteSchema {
  name: string
  url: string
  potentialAction: {
    '@type': string
    target: string
    'query-input': string
  }
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema(org: OrganizationSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: org.name,
    url: org.url,
    ...(org.logo && { logo: org.logo }),
    ...(org.description && { description: org.description }),
    ...(org.contactPoint && { contactPoint: org.contactPoint }),
    ...(org.sameAs && { sameAs: org.sameAs }),
  }
}

/**
 * Generate SoftwareApplication schema
 */
export function generateSoftwareApplicationSchema(app: SoftwareApplicationSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    applicationCategory: app.applicationCategory,
    operatingSystem: app.operatingSystem,
    offers: {
      '@type': 'Offer',
      price: app.offers.price,
      priceCurrency: app.offers.priceCurrency,
    },
    ...(app.aggregateRating && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: app.aggregateRating.ratingValue,
        ratingCount: app.aggregateRating.ratingCount,
      },
    }),
  }
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSiteSchema(site: WebSiteSchema) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: site.name,
    url: site.url,
    potentialAction: {
      '@type': site.potentialAction['@type'],
      target: site.potentialAction.target,
      'query-input': site.potentialAction['query-input'],
    },
  }
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Default LabelPro schemas
 */
export function getDefaultSchemas() {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://labelpro.com'

  return [
    generateOrganizationSchema({
      name: 'LabelPro',
      url: siteUrl,
      logo: `${siteUrl}/logo.png`,
      description: 'Professional label design and printing software for e-commerce businesses',
      contactPoint: {
        contactType: 'Customer Service',
        email: 'support@labelpro.com',
        availableLanguage: ['English'],
      },
      sameAs: [
        'https://twitter.com/labelpro',
        'https://facebook.com/labelpro',
        'https://linkedin.com/company/labelpro',
      ],
    }),
    generateSoftwareApplicationSchema({
      name: 'LabelPro',
      applicationCategory: 'BusinessApplication',
      operatingSystem: ['Web Browser'],
      offers: {
        price: '0',
        priceCurrency: 'USD',
      },
      aggregateRating: {
        ratingValue: 4.8,
        ratingCount: 1250,
      },
    }),
    generateWebSiteSchema({
      name: 'LabelPro',
      url: siteUrl,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${siteUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    }),
  ]
}

