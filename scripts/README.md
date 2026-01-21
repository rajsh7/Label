# Database Seeding Scripts

## Complete Label Seeding (255 Labels)

To seed all 255 labels into your Supabase database:

1. Make sure you have your Supabase environment variables set:
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

2. Run the complete seeding script:
   ```bash
   npx tsx scripts/seed-labels-complete.ts
   ```

Or add to package.json:
```json
{
  "scripts": {
    "seed:labels": "tsx scripts/seed-labels-complete.ts"
  }
}
```

Then run:
```bash
npm run seed:labels
```

## Label Categories Included

The complete seeding script includes all 255 labels across 10 categories:

- **Category A: Amazon FBA** (25 labels)
- **Category B: Walmart FWA** (20 labels)
- **Category C: eBay/Pitneys** (18 labels)
- **Category D: Shopify/Custom** (30 labels)
- **Category E: Etsy** (15 labels)
- **Category F: Shipping (DHL/UPS/FedEx)** (40 labels)
- **Category G: DYMO/Desktop Printer** (30 labels)
- **Category H: Barcode/Sticker** (35 labels)
- **Category I: International** (15 labels)
- **Category J: Special/Professional** (5 labels)

**Total: 255 labels**

## Notes

- The script uses `upsert` so it won't create duplicates if labels already exist
- Labels are inserted in batches of 50 for better performance
- The script calculates pixel dimensions automatically from mm measurements
- Supports both 203 DPI and 300 DPI pixel dimensions
- All labels include marketplace, print method, and printer type information

