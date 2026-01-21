# Fonts Directory

This directory contains self-hosted font files.

## Current Status

Currently, LabelPro uses CDN-hosted fonts (Google Fonts). This directory is reserved for future use if we decide to self-host fonts for:

- Better performance (eliminate external requests)
- Privacy compliance (avoid Google Fonts tracking)
- Offline support

## Supported Formats

- WOFF2 (preferred - best compression)
- WOFF (fallback for older browsers)
- TTF (fallback, larger file size)

## Fonts Used

- **Inter Variable** - Primary font family
  - Used for: Body text, UI elements, headings
  - File: `inter-var.woff2`
  
- **SF Mono** (optional) - Monospace font
  - Used for: Code blocks, technical content
  - File: `sfmono-regular.woff2`

## Usage (if self-hosting)

If fonts are added to this directory, update `src/styles/globals.css`:

```css
@font-face {
  font-family: 'Inter';
  src: url('/fonts/inter-var.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
```

## Notes

- Only add fonts here if switching from CDN to self-hosting
- Ensure proper font licensing
- Optimize font files (subsetting, compression)
- Test font loading performance
