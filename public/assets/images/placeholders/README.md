# Placeholder Images Directory

This directory contains placeholder images used when actual content is not available or loading.

## Usage

Placeholder images can be used for:

- Image loading states
- Empty states
- Default avatars
- Template previews

## Common Placeholders

### Generic Placeholder

A simple SVG placeholder for any image:

```svg
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <rect width="400" height="300" fill="#f3f4f6"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#9ca3af" font-family="sans-serif" font-size="16">Image Placeholder</text>
</svg>
```

### Label Preview Placeholder

A placeholder for label previews:

```svg
<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect width="200" height="150" fill="#ffffff" stroke="#e5e7eb" stroke-width="2"/>
  <text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#6b7280" font-family="sans-serif" font-size="12">Label Preview</text>
</svg>
```

## Guidelines

- Use SVG format for scalability
- Keep file sizes small
- Use neutral colors that match the design system
- Ensure placeholders are clearly distinguishable from actual content
