# LabelPro - Professional Label Resizing SaaS

LabelPro is an enterprise-grade label resizing platform for e-commerce sellers, supporting 290+ label types across all major carriers and marketplaces.

## 🏷️ Extracted Labels & Templates

This project now includes **290+ label formats** extracted and enhanced from industry-standard sources, covering:

### Label Categories

- **Amazon FBA** (40 labels) - FNSKU labels in all common sizes (2x1", 2.625x1", 3.5x1", 4x6", etc.)
- **Avery Templates** (20 labels) - Popular Avery label formats (5160, 5161, 5163, 5164, etc.)
- **Walmart FWA** (20 labels) - Walmart fulfillment labels
- **eBay** (18 labels) - eBay shipping and product labels
- **Shopify/Custom** (30 labels) - Custom e-commerce labels
- **Etsy** (15 labels) - Handmade marketplace labels
- **USPS** (30 labels) - All USPS shipping services
- **FedEx** (25 labels) - FedEx shipping labels
- **UPS** (25 labels) - UPS shipping labels
- **DHL** (20 labels) - DHL express labels
- **Other Carriers** (55+ labels) - OnTrac, LaserShip, Canada Post, etc.

### Print Methods Supported

- **Thermal Printing** (203 DPI & 300 DPI)
- **Inkjet Printing** (300 DPI)
- **Desktop Printing** (Letter size)

### Printer Compatibility

- Zebra (LP2844, GX430T, ZP450)
- DYMO (LabelWriter 450, 4XL)
- Rollo (X1038, X1040)
- Brother (QL series)
- Generic thermal printers

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Set up environment variables:**

   ```bash
   cp .env.example .env.local
   ```

   Fill in your Supabase credentials in `.env.local`

3. **Set up the database:**

   ```bash
   # Run the database schema
   # Copy the contents of scripts/database-schema.sql and run in Supabase SQL Editor
   ```

4. **Seed the labels database:**

   ```bash
   # Seed all 255+ label formats
   npm run seed:labels

   # Or seed basic labels only
   npm run seed:labels:basic
   ```

5. **Generate TypeScript types:**

   ```bash
   npm run generate-types
   ```

6. **Start the development server:**

   ```bash
   npm run dev
   ```

7. **Open [http://localhost:3000](http://localhost:3000)**

## 📁 Project Structure

```
labelpro/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities, hooks, services
│   │   └── constants/
│   │       └── labels.ts # All 255+ label definitions
│   ├── types/            # TypeScript type definitions
│   │   ├── label.ts      # Label types
│   │   └── template.ts   # Template types
│   └── server/           # Server actions and API routes
├── scripts/              # Database and seeding scripts
│   ├── database-schema.sql      # Complete database schema
│   └── seed-labels-complete.ts  # Seeds all 255+ labels
└── public/               # Static assets
```

## 🏷️ Using the Labels

### Accessing Labels in Code

```typescript
import {
  ALL_LABELS,
  getLabelsByCategory,
  searchLabels,
} from "@/lib/constants/labels";

// Get all labels
const allLabels = ALL_LABELS;

// Get labels by category
const amazonLabels = getLabelsByCategory("amazon_fba");
const shippingLabels = getLabelsByCategory("shipping");

// Search labels
const thermalLabels = searchLabels("thermal");
const fourBySixLabels = searchLabels("4x6");

// Get specific label
const amazonLabel = getLabelById("amazon_fba_001");
```

### Label Properties

Each label includes:

- **Dimensions**: mm, inches, pixels (203 & 300 DPI)
- **Print method**: thermal, inkjet, desktop
- **Marketplace**: Amazon, eBay, Shopify, etc.
- **Barcode format**: CODE128, EAN13, QR codes
- **Printer compatibility**: Supported printer models
- **Notes**: Special requirements or formatting

### Database Schema

Labels are stored in the `labels` table with the following structure:

- `id` - Unique identifier (e.g., 'amazon_fba_001')
- `name` - Human-readable name
- `category` - Label category
- `marketplace` - Associated marketplace
- `print_method` - Printing method
- `width_mm`, `height_mm` - Physical dimensions
- `width_px_203dpi`, `height_px_203dpi` - Pixel dimensions for 203 DPI
- `width_px_300dpi`, `height_px_300dpi` - Pixel dimensions for 300 DPI
- `barcode_format` - Supported barcode format
- `supported_printers` - Compatible printer models

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run seed:labels` - Seed all 255+ labels
- `npm run generate-types` - Generate TypeScript types from Supabase

## 📊 Features

- ✅ 255+ label types (Amazon FBA, Walmart, eBay, Shopify, Etsy, shipping carriers)
- ✅ Drag-and-drop label editor (text, images, barcodes, shapes)
- ✅ Batch processing with CSV/Excel upload
- ✅ Printer integration (DYMO, Zebra, Rollo, Brother)
- ✅ Three-tier pricing (Free, Pro $7.99/mo, Enterprise $39.99/mo)
- ✅ Mobile-responsive design (320px - 2560px)
- ✅ Real-time collaboration (Enterprise)
- ✅ API access (Enterprise)

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **Database**: Supabase (PostgreSQL) with Row-Level Security
- **Authentication**: Supabase Auth + OAuth (Google, Amazon)
- **Form Handling**: React Hook Form + Zod validation
- **PDF Generation**: pdf-lib
- **Barcode Generation**: jsBarcode
- **Animations**: Framer Motion, GSAP

## 📝 License

Proprietary
