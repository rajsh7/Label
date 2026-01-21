/**
 * SEO metadata utilities
 */

export interface PageMetadata {
  title: string
  description: string
  keywords?: string[]
  ogImage?: string
  ogType?: string
  noindex?: boolean
}

/**
 * Generate page metadata
 */
export function generateMetadata(metadata: PageMetadata) {
  const siteUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://labelpro.com'
  const defaultImage = `${siteUrl}/og-image.png`

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords?.join(', '),
    openGraph: {
      title: metadata.title,
      description: metadata.description,
      url: siteUrl,
      siteName: 'LabelPro',
      images: [
        {
          url: metadata.ogImage || defaultImage,
          width: 1200,
          height: 630,
          alt: metadata.title,
        },
      ],
      locale: 'en_US',
      type: metadata.ogType || 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: metadata.title,
      description: metadata.description,
      images: [metadata.ogImage || defaultImage],
    },
    robots: {
      index: !metadata.noindex,
      follow: !metadata.noindex,
    },
  }
  // #region agent log
  // Logging after return is not executed, but we can't log after return
  // #endregion
}

