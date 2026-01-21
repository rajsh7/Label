# LabelPro - Professional Label Resizing SaaS

LabelPro is an enterprise-grade label resizing platform for e-commerce sellers, supporting 255+ label types across all major carriers and marketplaces.

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom design system
- **Database**: Supabase (PostgreSQL) with Row-Level Security
- **Authentication**: Supabase Auth + OAuth (Google, Amazon)
- **Form Handling**: React Hook Form + Zod validation
- **PDF Generation**: pdf-lib
- **Barcode Generation**: jsBarcode
- **Animations**: Framer Motion, GSAP

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Fill in your Supabase credentials (see `.env.example` for required variables)

4. Run database migrations and seed labels:
   ```bash
   npm run seed:labels
   ```

5. Generate TypeScript types from Supabase:
   ```bash
   npm run generate-types
   ```

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
labelpro/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # React components
│   ├── lib/              # Utilities, hooks, services
│   ├── server/           # Server actions and API routes
│   ├── styles/           # Global styles and design system
│   └── types/            # TypeScript type definitions
├── scripts/              # Build and database scripts
└── public/               # Static assets
```

## Features

- ✅ 255+ label types (Amazon FBA, Walmart, eBay, Shopify, Etsy, shipping carriers)
- ✅ Drag-and-drop label editor (text, images, barcodes, shapes)
- ✅ Batch processing with CSV/Excel upload
- ✅ Printer integration (DYMO, Zebra, Rollo, Brother)
- ✅ Three-tier pricing (Free, Pro $7.99/mo, Enterprise $39.99/mo)
- ✅ Mobile-responsive design (320px - 2560px)
- ✅ Real-time collaboration (Enterprise)
- ✅ API access (Enterprise)

## Development Roadmap

See implementation phases in the documentation files:
- `LabelPro-Master-Prompt.md` - Technical implementation guide
- `LabelPro_Elite_Implementation_P2` - Business strategy and design system

## License

Proprietary
