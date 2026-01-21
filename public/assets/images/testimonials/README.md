# Testimonials Images Directory

This directory contains testimonial avatar images.

## Usage

Images in this directory should be used with Next.js Image component:

```tsx
import Image from 'next/image'

<Image 
  src="/assets/images/testimonials/john-doe.jpg" 
  alt="John Doe" 
  width={80} 
  height={80}
  className="rounded-full"
/>
```

## Image Guidelines

- Preferred format: JPG (for photos)
- Size: 160x160px minimum (for 2x retina displays, use 320x320px)
- All images should be square (aspect ratio 1:1)
- Images will be displayed as circles, so ensure important content is centered
- Optimize images before adding (use tools like ImageOptim, Squoosh)

## File Naming

- Use kebab-case
- Use person's name: `firstname-lastname.jpg`
- Example: `sarah-johnson.jpg`, `michael-chen.jpg`

## Privacy Considerations

- Only include images with explicit permission
- Consider using placeholder avatars if actual photos are not available
- Alternative: Use initials or generic avatars instead of photos
