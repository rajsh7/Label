# Hero Images Directory

This directory contains hero section images for marketing pages.

## Usage

Images in this directory should be used with Next.js Image component:

```tsx
import Image from 'next/image'

<Image 
  src="/assets/images/hero/hero-1.webp" 
  alt="Hero Image" 
  width={1200} 
  height={600}
  priority
/>
```

## Image Guidelines

- Preferred format: WebP (better compression, modern format)
- Fallback: JPG/PNG if WebP not available
- Recommended sizes:
  - Desktop: 1200x600px or larger
  - Tablet: 768x400px
  - Mobile: 640x320px
- Optimize images before adding (use tools like ImageOptim, Squoosh)
- Use descriptive filenames (e.g., `hero-main.webp`, `hero-secondary.webp`)

## File Naming

- Use kebab-case
- Include purpose/context in name
- Example: `hero-main.webp`, `hero-features.webp`
