# Icons Directory

This directory contains SVG icon assets organized by size variants.

## Structure

- `24px/` - 24x24 pixel icons (small icons for buttons, inline elements)
- `32px/` - 32x32 pixel icons (medium icons for cards, headers)

## Usage

Icons in this directory can be used directly in components:

```tsx
import Image from 'next/image'

<Image src="/assets/icons/24px/plus.svg" alt="Add" width={24} height={24} />
```

## Icon Guidelines

- All icons should be SVG format
- Icons should use currentColor for fill/stroke to support theme colors
- Icons should be optimized (remove unnecessary paths, optimize viewBox)
- Naming convention: kebab-case (e.g., `arrow-right.svg`, `check-circle.svg`)

## Common Icons Needed

- `plus.svg` - Add/Create actions
- `minus.svg` - Remove/Delete actions
- `check.svg` - Success/Complete state
- `x.svg` - Close/Cancel actions
- `arrow-left.svg` - Navigation back
- `arrow-right.svg` - Navigation forward
- `edit.svg` - Edit actions
- `trash.svg` - Delete actions
- `download.svg` - Download actions
- `upload.svg` - Upload actions
