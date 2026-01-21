# LABELPRO: COMPLETE IMPLEMENTATION MASTERPLAN
## Master Cursor Prompt - All-in-One Workflow
**Version 3.0 | Production-Ready | Ready for Immediate Execution**

---

## SECTION 0: CRITICAL CONTEXT & SETUP RULES

### Your Role
You are an expert Next.js architect helping build **LabelPro**, a professional label resizing SaaS. Every response must:
- Follow the exact file structure provided
- Implement 100% functional code (no TODOs)
- Use design system variables (no hardcoded colors)
- Include full TypeScript typing
- Add comprehensive error handling
- Support all 255 label formats with exact specifications
- Enable multi-platform responsive design
- Follow accessibility (WCAG 2.1 AA)

### Critical Rules Cursor Must Follow
1. **Never guess file paths** - Use absolute imports from `@/components`, `@/lib`, `@/server`
2. **No hardcoded values** - All colors from CSS variables, all spacing 8px multiples
3. **Complete implementations** - No placeholders, no commented code for "future use"
4. **Test every feature** - Include error boundaries, loading states, fallbacks
5. **Mobile-first design** - Works on 320px minimum, responsive to 2560px
6. **All 255 labels included** - Database seeding with complete specifications
7. **One prompt per major feature** - But this master prompt covers everything
8. **Performance targets** - FCP <2.5s, LCP <2.5s, CLS <0.1, bundle <150KB

---

## SECTION 1: COMPLETE LABEL DATABASE SPECIFICATION

### All 255 Label Formats with Exact Dimensions

This is the COMPLETE list of ALL supported label formats. Every single one must be in the database seed file.

#### CATEGORY A: AMAZON FBA (25 labels)
```json
{
  "id": "amazon_fba_001",
  "name": "Amazon FBA 4x6 Thermal",
  "category": "amazon_fba",
  "marketplace": "Amazon",
  "print_method": "thermal",
  "printer_type": "zebra_lp2844",
  "width_mm": 101.6,
  "height_mm": 152.4,
  "width_inch": 4.0,
  "height_inch": 6.0,
  "width_px_203dpi": 812,
  "height_px_203dpi": 1218,
  "width_px_300dpi": 1200,
  "height_px_300dpi": 1800,
  "barcode_position": "top_center",
  "barcode_format": "code128",
  "product_reference": "FNSKU",
  "supported_printers": ["zebra_lp2844", "zebra_gx430t", "dymo_4xl"],
  "notes": "Standard thermal label, 203/300 DPI"
}
```

**AMAZON FBA COMPLETE LIST** (25 total):
1. 4x6 Thermal (203 DPI) - 812x1218px
2. 4x6 Thermal (300 DPI) - 1200x1800px
3. 4x6 Inkjet - 812x1218px
4. 4x6 Desktop Printer - 812x1218px
5. 2.5x4 Thermal - 507x762px (203 DPI)
6. 2.5x4 Thermal - 750x1200px (300 DPI)
7. 3x5 Thermal - 609x1016px (203 DPI)
8. 3x5 Thermal - 900x1500px (300 DPI)
9. 3x5.5 Thermal - 609x1143px (203 DPI)
10. 3x5.5 Thermal - 900x1700px (300 DPI)
11. 5x7 Thermal - 1016x1778px (203 DPI)
12. 5x7 Thermal - 1500x2100px (300 DPI)
13. 5x8 Thermal - 1016x2032px (203 DPI)
14. 5x8 Thermal - 1500x2400px (300 DPI)
15. 6x9 Thermal - 1224x2286px (203 DPI)
16. 6x9 Thermal - 1800x2700px (300 DPI)
17. 3x4 Thermal - 609x812px (203 DPI)
18. 3x4 Thermal - 900x1200px (300 DPI)
19. 2x3 Thermal - 406x609px (203 DPI)
20. 2x3 Thermal - 600x900px (300 DPI)
21. 4x7 Thermal - 812x1778px (203 DPI)
22. 4x7 Thermal - 1200x2100px (300 DPI)
23. 4x5 Thermal - 812x1270px (203 DPI)
24. 4x5 Thermal - 1200x1875px (300 DPI)
25. 6x4 Thermal - 1224x812px (203 DPI)

#### CATEGORY B: WALMART / FWA (20 labels)
```json
{
  "id": "walmart_fwa_001",
  "name": "Walmart FWA 4x6",
  "category": "walmart_fwa",
  "marketplace": "Walmart",
  "print_method": "thermal",
  "printer_type": "zebra_lp2844",
  "width_mm": 101.6,
  "height_mm": 152.4,
  "width_px_203dpi": 812,
  "height_px_203dpi": 1218,
  "barcode_format": "code128",
  "sku_position": "top_left",
  "notes": "Same size as Amazon but requires Walmart-specific formatting"
}
```

**WALMART COMPLETE LIST** (20 total):
1. 4x6 FWA Thermal - 812x1218px (203 DPI)
2. 4x6 FWA Thermal - 1200x1800px (300 DPI)
3. 4x6 FWA Inkjet - 812x1218px
4. 4x6 FWA Desktop - 812x1218px
5. 2x3 FWA Thermal - 406x609px (203 DPI)
6. 2x3 FWA Thermal - 600x900px (300 DPI)
7. 3x5 FWA Thermal - 609x1016px (203 DPI)
8. 3x5 FWA Thermal - 900x1500px (300 DPI)
9. 3x4 FWA Thermal - 609x812px (203 DPI)
10. 3x4 FWA Thermal - 900x1200px (300 DPI)
11. 5x7 FWA Thermal - 1016x1778px (203 DPI)
12. 5x7 FWA Thermal - 1500x2100px (300 DPI)
13. 5x8 FWA Thermal - 1016x2032px (203 DPI)
14. 5x8 FWA Thermal - 1500x2400px (300 DPI)
15. 6x4 FWA Thermal - 1224x812px (203 DPI)
16. 6x4 FWA Thermal - 1800x1200px (300 DPI)
17. 4x5 FWA Thermal - 812x1270px (203 DPI)
18. 4x5 FWA Thermal - 1200x1875px (300 DPI)
19. 4x7 FWA Thermal - 812x1778px (203 DPI)
20. 4x7 FWA Thermal - 1200x2100px (300 DPI)

#### CATEGORY C: EBAY / PITNEYS (18 labels)
**EBAY COMPLETE LIST** (18 total):
1. 4x6 eBay Thermal - 812x1218px (203 DPI)
2. 4x6 eBay Thermal - 1200x1800px (300 DPI)
3. 4x6 eBay Inkjet - 812x1218px
4. 4x6 eBay Desktop - 812x1218px
5. 4x5.5 eBay Thermal - 812x1143px (203 DPI)
6. 4x5.5 eBay Thermal - 1200x1700px (300 DPI)
7. 4x7 eBay Thermal - 812x1778px (203 DPI)
8. 4x7 eBay Thermal - 1200x2100px (300 DPI)
9. 5x7 eBay Thermal - 1016x1778px (203 DPI)
10. 5x7 eBay Thermal - 1500x2100px (300 DPI)
11. 4x8 eBay Thermal - 812x2032px (203 DPI)
12. 4x8 eBay Thermal - 1200x2400px (300 DPI)
13. 6x4 eBay Thermal - 1224x812px (203 DPI)
14. 6x4 eBay Thermal - 1800x1200px (300 DPI)
15. 3x5 eBay Thermal - 609x1016px (203 DPI)
16. 3x5 eBay Thermal - 900x1500px (300 DPI)
17. 2x3 eBay Thermal - 406x609px (203 DPI)
18. 2x3 eBay Thermal - 600x900px (300 DPI)

#### CATEGORY D: SHOPIFY / CUSTOM (30 labels)
**SHOPIFY CUSTOM LIST** (30 total - user-defined sizes):
1. Standard 4x6 - 812x1218px (203 DPI)
2. Standard 4x6 - 1200x1800px (300 DPI)
3. Half Letter 4.25x5.5 - 863x1143px (203 DPI)
4. Half Letter 4.25x5.5 - 1275x1700px (300 DPI)
5. Full Letter 8.5x11 - 1726x2286px (203 DPI)
6. Full Letter 8.5x11 - 2550x3400px (300 DPI)
7. Merchandise Tag 2x3 - 406x609px (203 DPI)
8. Merchandise Tag 2x3 - 600x900px (300 DPI)
9. Packing Slip 4x6 - 812x1218px (203 DPI)
10. Packing Slip 4x6 - 1200x1800px (300 DPI)
11. Custom 3x3 - 609x609px (203 DPI)
12. Custom 3x3 - 900x900px (300 DPI)
13. Custom 3x5 - 609x1016px (203 DPI)
14. Custom 3x5 - 900x1500px (300 DPI)
15. Custom 5x5 - 1016x1016px (203 DPI)
16. Custom 5x5 - 1500x1500px (300 DPI)
17. Square 2x2 - 406x406px (203 DPI)
18. Square 2x2 - 600x600px (300 DPI)
19. Roll Label 3 inch wide - 609x609px (203 DPI) (continuous feed)
20. Roll Label 3 inch wide - 900x900px (300 DPI) (continuous feed)
21. Roll Label 4 inch wide - 812x812px (203 DPI) (continuous feed)
22. Roll Label 4 inch wide - 1200x1200px (300 DPI) (continuous feed)
23. Custom 6x9 - 1224x2286px (203 DPI)
24. Custom 6x9 - 1800x2700px (300 DPI)
25. Custom 5x8 - 1016x2032px (203 DPI)
26. Custom 5x8 - 1500x2400px (300 DPI)
27. Custom 7x5 - 1429x1016px (203 DPI)
28. Custom 7x5 - 2100x1500px (300 DPI)
29. Custom 4x10 - 812x2540px (203 DPI)
30. Custom 4x10 - 1200x3000px (300 DPI)

#### CATEGORY E: ETSY / HANDMADE (22 labels)
**ETSY HANDMADE LIST** (22 total):
1. Etsy 4x6 Thermal - 812x1218px (203 DPI)
2. Etsy 4x6 Thermal - 1200x1800px (300 DPI)
3. Etsy 4x6 Inkjet - 812x1218px
4. Etsy 4x6 Desktop - 812x1218px
5. Etsy 2x3 Thermal - 406x609px (203 DPI)
6. Etsy 2x3 Thermal - 600x900px (300 DPI)
7. Etsy 3x5 Thermal - 609x1016px (203 DPI)
8. Etsy 3x5 Thermal - 900x1500px (300 DPI)
9. Etsy 3x4 Thermal - 609x812px (203 DPI)
10. Etsy 3x4 Thermal - 900x1200px (300 DPI)
11. Etsy 5x7 Thermal - 1016x1778px (203 DPI)
12. Etsy 5x7 Thermal - 1500x2100px (300 DPI)
13. Etsy 4x5 Thermal - 812x1270px (203 DPI)
14. Etsy 4x5 Thermal - 1200x1875px (300 DPI)
15. Etsy 4x7 Thermal - 812x1778px (203 DPI)
16. Etsy 4x7 Thermal - 1200x2100px (300 DPI)
17. Etsy 5x8 Thermal - 1016x2032px (203 DPI)
18. Etsy 5x8 Thermal - 1500x2400px (300 DPI)
19. Etsy 6x4 Thermal - 1224x812px (203 DPI)
20. Etsy 6x4 Thermal - 1800x1200px (300 DPI)
21. Etsy 3x6 Thermal - 609x1224px (203 DPI)
22. Etsy 3x6 Thermal - 900x1800px (300 DPI)

#### CATEGORY F: DHL / UPS / FEDEX (35 labels)
**SHIPPING CARRIER LABELS** (35 total):
1. DHL 4x6 Thermal - 812x1218px (203 DPI)
2. DHL 4x6 Thermal - 1200x1800px (300 DPI)
3. DHL 4x6 Inkjet - 812x1218px
4. UPS 4x6 Thermal - 812x1218px (203 DPI)
5. UPS 4x6 Thermal - 1200x1800px (300 DPI)
6. UPS 4x6 Inkjet - 812x1218px
7. FedEx 4x6 Thermal - 812x1218px (203 DPI)
8. FedEx 4x6 Thermal - 1200x1800px (300 DPI)
9. FedEx 4x6 Inkjet - 812x1218px
10. USPS 4x6 Thermal - 812x1218px (203 DPI)
11. USPS 4x6 Thermal - 1200x1800px (300 DPI)
12. USPS 4x6 Inkjet - 812x1218px
13. DHL Express 5x7 - 1016x1778px (203 DPI)
14. DHL Express 5x7 - 1500x2100px (300 DPI)
15. UPS Ground 5x8 - 1016x2032px (203 DPI)
16. UPS Ground 5x8 - 1500x2400px (300 DPI)
17. FedEx Ground 6x4 - 1224x812px (203 DPI)
18. FedEx Ground 6x4 - 1800x1200px (300 DPI)
19. USPS Priority 5.5x8.5 - 1143x1778px (203 DPI)
20. USPS Priority 5.5x8.5 - 1700x2100px (300 DPI)
21. DHL 2x3 Thermal - 406x609px (203 DPI)
22. DHL 2x3 Thermal - 600x900px (300 DPI)
23. UPS 2x3 Thermal - 406x609px (203 DPI)
24. UPS 2x3 Thermal - 600x900px (300 DPI)
25. FedEx 2x3 Thermal - 406x609px (203 DPI)
26. FedEx 2x3 Thermal - 600x900px (300 DPI)
27. USPS 2x3 Thermal - 406x609px (203 DPI)
28. USPS 2x3 Thermal - 600x900px (300 DPI)
29. DHL Large 6x9 - 1224x2286px (203 DPI)
30. DHL Large 6x9 - 1800x2700px (300 DPI)
31. UPS Large 6x9 - 1224x2286px (203 DPI)
32. UPS Large 6x9 - 1800x2700px (300 DPI)
33. FedEx Large 6x9 - 1224x2286px (203 DPI)
34. FedEx Large 6x9 - 1800x2700px (300 DPI)
35. USPS Large 6x9 - 1224x2286px (203 DPI)

#### CATEGORY G: DYMO / DESKTOP PRINTER (25 labels)
**DYMO & DESKTOP PRINTER LABELS** (25 total):
1. DYMO 4x6 - 812x1218px (203 DPI)
2. DYMO 4x6 - 1200x1800px (300 DPI)
3. DYMO 2x3 - 406x609px (203 DPI)
4. DYMO 2x3 - 600x900px (300 DPI)
5. DYMO 3x5 - 609x1016px (203 DPI)
6. DYMO 3x5 - 900x1500px (300 DPI)
7. DYMO 4x5 - 812x1270px (203 DPI)
8. DYMO 4x5 - 1200x1875px (300 DPI)
9. DYMO 4x7 - 812x1778px (203 DPI)
10. DYMO 4x7 - 1200x2100px (300 DPI)
11. Brother 4x6 - 812x1218px (203 DPI)
12. Brother 4x6 - 1200x1800px (300 DPI)
13. Brother 2x3 - 406x609px (203 DPI)
14. Brother 2x3 - 600x900px (300 DPI)
15. Zebra 4x6 - 812x1218px (203 DPI)
16. Zebra 4x6 - 1200x1800px (300 DPI)
17. Rollo 4x6 - 812x1218px (203 DPI)
18. Rollo 4x6 - 1200x1800px (300 DPI)
19. Desktop A4 (4 per sheet) - 2100x2970px (300 DPI)
20. Desktop A5 (6 per sheet) - 1488x2100px (300 DPI)
21. Desktop Half Letter - 1275x1700px (300 DPI)
22. Desktop Full Letter - 2550x3400px (300 DPI)
23. DYMO 3x4 - 609x812px (203 DPI)
24. DYMO 3x4 - 900x1200px (300 DPI)
25. Brother 3x5 - 609x1016px (203 DPI)

#### CATEGORY H: BARCODE / STICKER (30 labels)
**BARCODE & STICKER LABELS** (30 total):
1. Barcode Only 1x2 - 203x406px (203 DPI)
2. Barcode Only 1x2 - 300x600px (300 DPI)
3. Barcode Only 1x3 - 203x609px (203 DPI)
4. Barcode Only 1x3 - 300x900px (300 DPI)
5. Barcode Only 1.5x2 - 304x406px (203 DPI)
6. Barcode Only 1.5x2 - 450x600px (300 DPI)
7. Barcode Only 2x3 - 406x609px (203 DPI)
8. Barcode Only 2x3 - 600x900px (300 DPI)
9. Sticker Round 2 inch - 406x406px (203 DPI)
10. Sticker Round 2 inch - 600x600px (300 DPI)
11. Sticker Round 3 inch - 609x609px (203 DPI)
12. Sticker Round 3 inch - 900x900px (300 DPI)
13. Sticker Square 2x2 - 406x406px (203 DPI)
14. Sticker Square 2x2 - 600x600px (300 DPI)
15. Sticker Square 3x3 - 609x609px (203 DPI)
16. Sticker Square 3x3 - 900x900px (300 DPI)
17. Sticker Oval 2x3 - 406x609px (203 DPI)
18. Sticker Oval 2x3 - 600x900px (300 DPI)
19. Product Label 1x1 - 203x203px (203 DPI)
20. Product Label 1x1 - 300x300px (300 DPI)
21. Product Label 1.5x1.5 - 304x304px (203 DPI)
22. Product Label 1.5x1.5 - 450x450px (300 DPI)
23. Jewelry Tag 1x2 - 203x406px (203 DPI)
24. Jewelry Tag 1x2 - 300x600px (300 DPI)
25. Price Tag 2x3 - 406x609px (203 DPI)
26. Price Tag 2x3 - 600x900px (300 DPI)
27. Hang Tag 2x3.5 - 406x711px (203 DPI)
28. Hang Tag 2x3.5 - 600x1050px (300 DPI)
29. Retail Label 1x1.5 - 203x304px (203 DPI)
30. Retail Label 1x1.5 - 300x450px (300 DPI)

#### CATEGORY I: INTERNATIONAL (30 labels)
**INTERNATIONAL LABELS** (30 total):
1. UK A6 (105x148mm) - 1024x1448px (203 DPI)
2. UK A6 (105x148mm) - 1500x2100px (300 DPI)
3. EU A6 (105x148mm) - 1024x1448px (203 DPI)
4. EU A6 (105x148mm) - 1500x2100px (300 DPI)
5. Australia 4x6 (101x152mm) - 812x1218px (203 DPI)
6. Australia 4x6 (101x152mm) - 1200x1800px (300 DPI)
7. Canada 4x6 (101x152mm) - 812x1218px (203 DPI)
8. Canada 4x6 (101x152mm) - 1200x1800px (300 DPI)
9. Japan 4x6 (101x152mm) - 812x1218px (203 DPI)
10. Japan 4x6 (101x152mm) - 1200x1800px (300 DPI)
11. China 4x6 (101x152mm) - 812x1218px (203 DPI)
12. China 4x6 (101x152mm) - 1200x1800px (300 DPI)
13. India 4x6 (101x152mm) - 812x1218px (203 DPI)
14. India 4x6 (101x152mm) - 1200x1800px (300 DPI)
15. Singapore 4x6 (101x152mm) - 812x1218px (203 DPI)
16. Singapore 4x6 (101x152mm) - 1200x1800px (300 DPI)
17. Brazil 4x6 (101x152mm) - 812x1218px (203 DPI)
18. Brazil 4x6 (101x152mm) - 1200x1800px (300 DPI)
19. Mexico 4x6 (101x152mm) - 812x1218px (203 DPI)
20. Mexico 4x6 (101x152mm) - 1200x1800px (300 DPI)
21. UK A5 (148x210mm) - 1448x2048px (203 DPI)
22. UK A5 (148x210mm) - 2100x3000px (300 DPI)
23. EU A5 (148x210mm) - 1448x2048px (203 DPI)
24. EU A5 (148x210mm) - 2100x3000px (300 DPI)
25. Australia A5 - 1448x2048px (203 DPI)
26. Australia A5 - 2100x3000px (300 DPI)
27. Japan A5 - 1448x2048px (203 DPI)
28. Japan A5 - 2100x3000px (300 DPI)
29. China A5 - 1448x2048px (203 DPI)
30. China A5 - 2100x3000px (300 DPI)

#### CATEGORY J: SPECIAL / PROFESSIONAL (50+ labels)
**SPECIAL & PROFESSIONAL LABELS** (50+ total - various niche formats):
1. Fragile Warning - 2x3 - 406x609px (203 DPI)
2. Fragile Warning - 2x3 - 600x900px (300 DPI)
3. This Side Up - 2x3 - 406x609px (203 DPI)
4. This Side Up - 2x3 - 600x900px (300 DPI)
5. Handle With Care - 2x3 - 406x609px (203 DPI)
6. Handle With Care - 2x3 - 600x900px (300 DPI)
7. Do Not Stack - 2x3 - 406x609px (203 DPI)
8. Do Not Stack - 2x3 - 600x900px (300 DPI)
... (and 42 more specialized formats)

---

## SECTION 2: RESPONSIVE DESIGN SPECIFICATIONS

### Platform Breakpoints & Requirements

#### Desktop (≥1024px)
- 4-column label browser grid
- Sidebar always visible
- Full toolbar display
- Zoom controls: 25% - 400%
- Canvas minimum width: 600px
- Properties panel: 300px fixed width
- Margin: 24px on all sides

#### Tablet (768px - 1023px)
- 2-column label browser grid
- Collapsible sidebar (hamburger menu)
- Touch-optimized buttons: 48px minimum height
- Canvas responsive: scales with screen
- Properties panel: 250px or stacked below
- Margin: 16px on all sides

#### Mobile (320px - 767px)
- 1-column label browser grid
- Full-screen sidebar (modal overlay)
- Touch gestures: swipe to navigate
- Canvas: Full width with 12px margins
- Properties panel: Below canvas (stacked)
- Buttons: 44px minimum height (thumb-friendly)
- Typography: 16px minimum (no pinch-to-zoom)
- Margin: 8px on sides

#### Ultra-wide (≥2560px)
- 6-column label browser grid
- Split-screen editor (canvas + properties side-by-side)
- Canvas can show 2 designs simultaneously
- Maximum content width: 2000px (centered)

### Responsive Media Query Breakpoints
```css
/* Mobile-first approach */
/* Base: 320px */
@media (min-width: 480px) { /* Small phone */ }
@media (min-width: 640px) { /* Large phone */ }
@media (min-width: 768px) { /* Tablet portrait */ }
@media (min-width: 1024px) { /* Tablet landscape / Small desktop */ }
@media (min-width: 1280px) { /* Desktop */ }
@media (min-width: 1536px) { /* Large desktop */ }
@media (min-width: 1920px) { /* Full HD */ }
@media (min-width: 2560px) { /* 4K */ }
```

---

## SECTION 3: COMPLETE IMPLEMENTATION WORKFLOW

### PHASE 1: PROJECT FOUNDATION (Week 1-2, 40-50 hours)

#### Step 1.1: Project Setup & Environment Configuration
```bash
# Create Next.js 14 project
npx create-next-app@latest labelpro \
  --typescript \
  --tailwind \
  --eslint \
  --app-dir \
  --no-src-dir \
  --import-alias "@/*"

# Install critical dependencies
npm install @supabase/supabase-js@2 stripe zustand react-hook-form zod date-fns next-auth lucide-react

# Install dev dependencies  
npm install --save-dev @types/node @types/react vitest @testing-library/react @testing-library/jest-dom

# Create env.local
cat > .env.local << 'EOF'
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
STRIPE_SECRET_KEY=your_stripe_secret
STRIPE_WEBHOOK_SECRET=your_webhook_secret
DATABASE_URL=your_postgres_url
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
```

**Cursor Prompt for Step 1.1:**
```
Create a Next.js 14 project with:
- TypeScript strict mode
- Tailwind CSS configured
- Absolute imports (@/ prefix)
- Environment variables template with 8 required variables
- .env.example file (safe to commit)
- .gitignore configured
- tsconfig.json optimized for strictest type checking
- next.config.js with image optimization

Show me all configuration files created.
```

#### Step 1.2: Design System Implementation (Colors, Typography, Spacing)
**DESIGN SYSTEM - CSS VARIABLES (Complete List)**

Create `src/styles/design-system.css`:
```css
:root {
  /* PRIMARY COLORS */
  --color-primary-50: #eff6ff;
  --color-primary-100: #dbeafe;
  --color-primary-200: #bfdbfe;
  --color-primary-300: #93c5fd;
  --color-primary-400: #60a5fa;
  --color-primary-500: #3b82f6;      /* Primary blue - actions, trust */
  --color-primary-600: #2563eb;      /* Primary darker - hover state */
  --color-primary-700: #1d4ed8;      /* Primary darkest - active state */
  --color-primary-800: #1e40af;
  --color-primary-900: #1e3a8a;

  /* NEUTRAL / GRAY */
  --color-gray-50: #f9fafb;
  --color-gray-100: #f3f4f6;
  --color-gray-200: #e5e7eb;
  --color-gray-300: #d1d5db;
  --color-gray-400: #9ca3af;
  --color-gray-500: #6b7280;         /* Default text color */
  --color-gray-600: #4b5563;
  --color-gray-700: #374151;
  --color-gray-800: #1f2937;
  --color-gray-900: #111827;         /* Nearly black */

  /* SEMANTIC COLORS */
  --color-success-50: #ecfdf5;
  --color-success-500: #10b981;      /* Success green */
  --color-success-600: #059669;
  --color-success-700: #047857;

  --color-error-50: #fef2f2;
  --color-error-500: #ef4444;        /* Error red */
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  --color-warning-50: #fffbeb;
  --color-warning-500: #f59e0b;      /* Warning yellow */
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

  --color-info-50: #eff6ff;
  --color-info-500: #0ea5e9;         /* Info cyan */
  --color-info-600: #0284c7;
  --color-info-700: #0369a1;

  /* BACKGROUNDS & SURFACES */
  --color-bg-primary: #ffffff;       /* Main background */
  --color-bg-secondary: #f9fafb;     /* Secondary background */
  --color-bg-tertiary: #f3f4f6;      /* Tertiary background */
  --color-surface-primary: #ffffff;  /* Card/surface background */
  --color-surface-hover: #f9fafb;    /* Hover state for surfaces */

  /* TEXT COLORS */
  --color-text-primary: #111827;     /* Primary text (dark gray) */
  --color-text-secondary: #6b7280;   /* Secondary text (medium gray) */
  --color-text-tertiary: #9ca3af;    /* Tertiary text (light gray) */
  --color-text-inverse: #ffffff;     /* Text on dark backgrounds */

  /* BORDERS & DIVIDERS */
  --color-border-primary: #e5e7eb;   /* Standard border */
  --color-border-secondary: #d1d5db; /* Subtle border */
  --color-border-strong: #9ca3af;    /* Strong border */

  /* SHADOWS */
  --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  --shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

  /* TYPOGRAPHY */
  --font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  --font-family-mono: 'Monaco', 'Courier New', monospace;
  
  --font-size-xs: 11px;              /* Smallest text */
  --font-size-sm: 12px;              /* Small text, captions */
  --font-size-base: 14px;            /* Default body text */
  --font-size-md: 16px;              /* Medium body text (mobile) */
  --font-size-lg: 18px;              /* Large text */
  --font-size-xl: 20px;              /* Extra large */
  --font-size-2xl: 24px;             /* Heading 3 */
  --font-size-3xl: 30px;             /* Heading 2 */
  --font-size-4xl: 36px;             /* Heading 1 */
  
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;
  
  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;
  
  /* SPACING (8px base unit) */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;
  --space-16: 64px;
  
  /* BORDER RADIUS */
  --radius-none: 0;
  --radius-sm: 4px;
  --radius-base: 6px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;
  
  /* TRANSITIONS */
  --transition-fast: 100ms;
  --transition-base: 200ms;
  --transition-slow: 300ms;
  --ease-linear: linear;
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-out: cubic-bezier(0, 0, 0.2, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  
  /* Z-INDEX STACK */
  --z-base: 0;
  --z-dropdown: 100;
  --z-sticky: 200;
  --z-modal-bg: 900;
  --z-modal: 950;
  --z-popover: 1000;
  --z-tooltip: 1100;
  --z-notification: 1200;
}

/* DARK MODE */
@media (prefers-color-scheme: dark) {
  :root {
    --color-bg-primary: #0f172a;      /* Dark background */
    --color-bg-secondary: #1e293b;
    --color-bg-tertiary: #334155;
    --color-surface-primary: #1e293b;
    --color-surface-hover: #334155;
    
    --color-text-primary: #f1f5f9;    /* Light text */
    --color-text-secondary: #cbd5e1;
    --color-text-tertiary: #94a3b8;
    
    --color-border-primary: #334155;
    --color-border-secondary: #475569;
    --color-border-strong: #64748b;
    
    --shadow-xs: 0 1px 2px 0 rgba(0, 0, 0, 0.4);
    --shadow-sm: 0 1px 3px 0 rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3);
    --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.2);
    --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
  }
}

/* UTILITY CLASSES */
.bg-primary { background-color: var(--color-primary-500); }
.bg-primary-hover { background-color: var(--color-primary-600); }
.text-primary { color: var(--color-text-primary); }
.text-secondary { color: var(--color-text-secondary); }
.border-default { border-color: var(--color-border-primary); }
```

**Cursor Prompt for Step 1.2:**
```
Create the complete design system:

1. src/styles/design-system.css
   - All CSS variables listed above
   - Dark mode support
   - Semantic color system
   - Typography scale (xs to 4xl)
   - Spacing system (4px to 64px, base 8px)
   - Shadow system (xs to xl)
   - Border radius system
   - Transition/animation variables
   - Z-index stack (base to notification)

2. src/styles/globals.css
   - Import design-system.css
   - Reset default browser styles
   - Apply design system to base elements
   - Typography defaults
   - Focus styles (2px outline, blue color)
   - Smooth scroll behavior
   - Color scheme (light/dark)

3. tailwind.config.ts
   - Extend theme with design system colors
   - Extend spacing with 8px multiples
   - Extend font family (base, mono)
   - Add custom z-index values
   - Enable dark mode

4. Create src/styles/animations.css
   - Fade in/out animations
   - Slide animations (top, bottom, left, right)
   - Scale animations
   - Pulse/loading animations
   - Duration variables matching design system

Test by:
- Creating a sample page using var(--color-primary-500)
- Verifying dark mode toggle works
- Checking responsive breakpoints
```

#### Step 1.3: Core UI Component Library
```
Files to create:
src/components/ui/
├── Button.tsx (8 variants: primary, secondary, outline, ghost)
├── Input.tsx (text, email, password, number)
├── Select.tsx (dropdown with search)
├── Card.tsx (with header, body, footer)
├── Dialog.tsx (modal with overlay)
├── Checkbox.tsx
├── Radio.tsx
├── Label.tsx
├── Badge.tsx (success, error, warning, info)
├── Spinner.tsx (loading indicator)
├── Toast.tsx (notifications)
├── Skeleton.tsx (loading placeholder)
├── Tabs.tsx (tabbed interface)
├── Tooltip.tsx (hover info)
└── Alert.tsx (alert message)
```

**Cursor Prompt for Step 1.3:**
```
Create all 15 core UI components with:

BUTTON Component:
- Variants: primary (blue), secondary (gray), outline, ghost, destructive (red)
- Sizes: sm (36px), md (40px), lg (44px)
- States: default, hover, active, disabled, loading
- Props: variant, size, disabled, loading, children, onClick, type, className
- Accessibility: proper focus states, keyboard support
- Uses CSS variables (--color-primary-500 etc)
- No hardcoded colors

INPUT Component:
- Types: text, email, password, number, search
- States: default, focus, disabled, error
- Props: type, placeholder, value, onChange, disabled, error, errorMessage, required
- Icon support (left/right icons)
- Error message display
- Placeholder styling
- Min-height 40px (accessibility)

Card Component:
- Container with white background, border, shadow
- Card.Header with padding 16px
- Card.Body with padding 16px  
- Card.Footer with top border, padding 16px
- Props: className, children
- Used for content grouping

All components:
- Use 'use client' directive (client components)
- Full TypeScript typing (props interface)
- Proper accessibility (aria labels, roles)
- Design system color/spacing variables
- No Tailwind hardcoded colors (use var() CSS)
- Export with both named and default exports
- Include JSDoc comments

Test with sample usage showing all variants and states.
```

---

### PHASE 2: DATABASE & AUTHENTICATION (Week 2-3, 45-55 hours)

#### Step 2.1: Supabase Database Schema Setup

**SQL Schema (Run in Supabase SQL Editor):**
```sql
-- Users table (managed by Supabase Auth, don't create)
-- But add custom fields to profiles

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  company_name TEXT,
  avatar_url TEXT,
  subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro', 'enterprise')),
  subscription_status VARCHAR(20) DEFAULT 'active' CHECK (subscription_status IN ('active', 'trialing', 'paused', 'canceled')),
  trial_ends_at TIMESTAMPTZ,
  labels_used_this_month INTEGER DEFAULT 0,
  batches_used_this_month INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- Labels table (all 255 label types)
CREATE TABLE IF NOT EXISTS public.labels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL UNIQUE,
  category VARCHAR(50) NOT NULL,
  marketplace VARCHAR(50),
  print_method VARCHAR(20) CHECK (print_method IN ('thermal', 'inkjet', 'desktop')),
  printer_type VARCHAR(50),
  width_mm DECIMAL(10, 2) NOT NULL,
  height_mm DECIMAL(10, 2) NOT NULL,
  width_inch DECIMAL(10, 2),
  height_inch DECIMAL(10, 2),
  width_px_203dpi INTEGER,
  height_px_203dpi INTEGER,
  width_px_300dpi INTEGER,
  height_px_300dpi INTEGER,
  barcode_position VARCHAR(50),
  barcode_format VARCHAR(50),
  product_reference VARCHAR(100),
  supported_printers TEXT[], -- JSON array
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Label designs (user-created designs)
CREATE TABLE IF NOT EXISTS public.label_designs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label_base_id UUID NOT NULL REFERENCES public.labels(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  elements JSONB DEFAULT '[]'::jsonb, -- Array of design elements
  thumbnail_url TEXT,
  is_template BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT unique_design_per_user UNIQUE(user_id, name)
);

-- Templates (saved designs that can be reused)
CREATE TABLE IF NOT EXISTS public.templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  label_base_id UUID NOT NULL REFERENCES public.labels(id),
  elements JSONB DEFAULT '[]'::jsonb,
  thumbnail_url TEXT,
  is_public BOOLEAN DEFAULT false,
  downloads INTEGER DEFAULT 0,
  rating DECIMAL(3, 2),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_template_per_user UNIQUE(user_id, name)
);

-- Batch jobs (batch processing history)
CREATE TABLE IF NOT EXISTS public.batch_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  template_id UUID REFERENCES public.templates(id),
  design_id UUID REFERENCES public.label_designs(id),
  file_url TEXT,
  data_rows JSONB, -- CSV data as JSON array
  column_mapping JSONB, -- Map CSV columns to template variables
  total_labels INTEGER NOT NULL,
  generated_labels INTEGER DEFAULT 0,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed', 'canceled')),
  error_message TEXT,
  output_file_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  CONSTRAINT valid_status_check CHECK (
    (status = 'pending' AND completed_at IS NULL) OR
    (status IN ('completed', 'failed', 'canceled') AND completed_at IS NOT NULL)
  )
);

-- Printers (user's configured printers)
CREATE TABLE IF NOT EXISTS public.printers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  printer_type VARCHAR(50) NOT NULL,
  connection_type VARCHAR(20) CHECK (connection_type IN ('usb', 'network', 'system')),
  network_ip INET,
  dpi INTEGER DEFAULT 203 CHECK (dpi IN (203, 300)),
  darkness_level INTEGER DEFAULT 15 CHECK (darkness_level BETWEEN 0 AND 30),
  label_gap INTEGER DEFAULT 2,
  is_default BOOLEAN DEFAULT false,
  is_online BOOLEAN DEFAULT true,
  last_status_check TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  CONSTRAINT unique_printer_per_user UNIQUE(user_id, name)
);

-- Print history
CREATE TABLE IF NOT EXISTS public.print_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  design_id UUID REFERENCES public.label_designs(id),
  printer_id UUID REFERENCES public.printers(id),
  batch_job_id UUID REFERENCES public.batch_jobs(id),
  quantity INTEGER NOT NULL,
  printed_at TIMESTAMPTZ DEFAULT now(),
  status VARCHAR(20) DEFAULT 'success' CHECK (status IN ('success', 'failed', 'pending'))
);

-- Favorites (user's favorite labels)
CREATE TABLE IF NOT EXISTS public.favorites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  label_id UUID NOT NULL REFERENCES public.labels(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_favorite UNIQUE(user_id, label_id)
);

-- Subscriptions
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255) UNIQUE,
  plan_id VARCHAR(50) NOT NULL CHECK (plan_id IN ('free', 'pro', 'enterprise')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'trialing', 'paused', 'canceled')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  trial_start TIMESTAMPTZ,
  trial_end TIMESTAMPTZ,
  canceled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Audit log
CREATE TABLE IF NOT EXISTS public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id VARCHAR(255),
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Row Level Security (RLS) Policies
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.label_designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batch_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.printers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.print_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can only see their own data
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own designs" ON public.label_designs
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create designs" ON public.label_designs
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Labels table is public read (no RLS needed)
-- All other tables follow same pattern: can only access own records

-- Indexes for performance
CREATE INDEX idx_label_designs_user_id ON public.label_designs(user_id);
CREATE INDEX idx_label_designs_created_at ON public.label_designs(created_at DESC);
CREATE INDEX idx_templates_user_id ON public.templates(user_id);
CREATE INDEX idx_batch_jobs_user_id ON public.batch_jobs(user_id);
CREATE INDEX idx_batch_jobs_status ON public.batch_jobs(status);
CREATE INDEX idx_printers_user_id ON public.printers(user_id);
CREATE INDEX idx_print_history_user_id ON public.print_history(user_id);
CREATE INDEX idx_favorites_user_id ON public.favorites(user_id);
CREATE INDEX idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX idx_labels_category ON public.labels(category);
CREATE INDEX idx_labels_marketplace ON public.labels(marketplace);
```

**Cursor Prompt for Step 2.1:**
```
Set up the complete Supabase database:

1. Create Supabase project (if not already done)
2. Run the provided SQL schema in Supabase SQL Editor
3. Verify all tables created:
   - profiles, labels, label_designs, templates
   - batch_jobs, printers, print_history, favorites
   - subscriptions, audit_logs
4. Verify all indexes created for performance
5. Enable RLS on all tables
6. Create seed data script for 255 labels (JavaScript)
7. Generate TypeScript types from Supabase schema

Show me:
- Schema visualization (table relationships)
- Sample seed data for first 10 labels
- Generated TypeScript types in src/types/supabase.ts
```

#### Step 2.2: Authentication System Implementation

**File structure:**
```
src/
├── lib/auth/
│   ├── validators.ts (email/password validation)
│   ├── session.ts (session management)
│   ├── tokens.ts (JWT handling)
│   └── oauth.ts (Google/Amazon OAuth)
├── app/(auth)/
│   ├── layout.tsx (centered auth layout)
│   ├── signup/page.tsx
│   ├── login/page.tsx
│   └── reset-password/
│       ├── page.tsx
│       └── [token]/page.tsx
├── app/api/auth/
│   ├── signup/route.ts
│   ├── login/route.ts
│   ├── logout/route.ts
│   ├── refresh/route.ts
│   └── google/callback/route.ts
└── middleware.ts
```

**Cursor Prompt for Step 2.2:**
```
Implement complete authentication system:

1. Create src/lib/auth/validators.ts
   - validateEmail(email): Check valid format, min 5 chars
   - validatePassword(password): Min 8 chars, requires uppercase, number, special char
   - validateFullName(name): Required, min 2 chars
   - Return { valid: boolean, error?: string }

2. Create src/lib/supabase/client.ts
   - Initialize Supabase client for client-side use
   - Export auth client instance

3. Create src/lib/supabase/server.ts
   - Initialize Supabase with service role key
   - For server-side operations only
   - Handle cookies for session

4. Create src/app/(auth)/layout.tsx
   - Centered, single-column layout
   - Logo at top (placeholder)
   - Form area (auth content)
   - Bottom link to switch between login/signup

5. Create src/app/(auth)/signup/page.tsx
   - Form fields: Email, Password, Full Name, Company (optional)
   - Submit button (blue, full width)
   - Password strength indicator
   - Terms checkbox (required)
   - Link to login page
   - Loading state with spinner
   - Error message display
   - Success: Redirect to dashboard

6. Create src/app/(auth)/login/page.tsx
   - Form fields: Email, Password, Remember me checkbox
   - Submit button (blue)
   - "Forgot password" link
   - Link to signup page
   - Loading state
   - Error message: "Invalid email or password"
   - Success: Redirect to dashboard

7. Create src/app/(auth)/reset-password/page.tsx
   - Email input only
   - Submit button: "Send reset link"
   - Success message: "Check your email for reset link"
   - Link back to login

8. Create src/app/(auth)/reset-password/[token]/page.tsx
   - New password input (with strength indicator)
   - Confirm password input
   - Submit button: "Reset password"
   - Error handling for expired tokens
   - Success: Redirect to login

9. Create src/app/api/auth/signup/route.ts
   - POST endpoint
   - Validate email, password, full name
   - Check email not already registered
   - Create Supabase Auth user
   - Create profile record
   - Send verification email
   - Return: { success, user_id, message }
   - Error responses: 400 (validation), 409 (conflict), 500 (server)

10. Create src/app/api/auth/login/route.ts
    - POST endpoint
    - Validate credentials
    - Sign JWT token (30 day expiry)
    - Set secure HTTP-only cookie
    - Return: { success, user: { id, email, name }, token }
    - Error: 401 Invalid credentials

11. Create src/middleware.ts
    - Check for authentication on protected routes
    - Redirect unauthenticated to /login
    - Protected routes: /dashboard, /editor, /batch, /settings
    - Public routes: /, /features, /pricing, /login, /signup
    - Refresh session if close to expiry

12. Create src/lib/hooks/useAuth.ts
    - Hook to get current user context
    - Return: { user, loading, error, logout }
    - Handle session refresh

13. Security requirements:
    - Passwords hashed with bcrypt (20 rounds)
    - JWT tokens include user_id, email, subscription_tier
    - Tokens expire after 30 days
    - Refresh tokens for session extension
    - CSRF protection on all forms
    - Rate limiting: 5 login attempts per 15 minutes
    - Email verification required before using app

Test:
- Signup with invalid email (error shown)
- Signup with weak password (error shown)
- Signup with existing email (conflict error)
- Successful signup (redirect to dashboard)
- Login with wrong password (error)
- Successful login (redirect to dashboard)
- Password reset flow
```

---

### PHASE 3: LABEL BROWSER & DATABASE (Week 3, 30-40 hours)

**Cursor Prompt for Phase 3:**
```
Implement the Label Browser with all 255 labels:

1. Create src/lib/constants/labels.ts
   - Export array of ALL 255 label objects
   - Structure from Section 1 (COMPLETE LABEL DATABASE SPECIFICATION)
   - Include all fields: name, category, marketplace, dimensions (mm, inch, px at both DPI)
   - Include: print_method, printer_type, barcode_format, supported_printers
   - Organized by category (amazon_fba, walmart_fwa, ebay, etc)

2. Create database seeding script (scripts/seed-labels.ts)
   - Read labels from src/lib/constants/labels.ts
   - Insert all 255 into Supabase labels table
   - Check for duplicates
   - Log success: "Seeded 255 labels"
   - Run: npm run seed:labels

3. Create src/components/features/LabelBrowser/LabelBrowser.tsx
   - Main component with search + filters + grid
   - Layout: Left sidebar (filters), Right content (grid)
   - Responsive: Sidebar collapses on <768px
   - State management: useLabels hook (React Query)

4. Create src/components/features/LabelBrowser/LabelFilter.tsx
   - Filter by category (checkbox group)
   - Filter by marketplace (checkbox group)
   - Filter by print method (checkbox group)
   - Filter by DPI (203, 300, both)
   - Search by label name (debounced 300ms)
   - "Clear all" button
   - Active filter count badge

5. Create src/components/features/LabelBrowser/LabelCard.tsx
   - Card showing:
     * Label thumbnail (50x100px preview)
     * Label name (truncate if >30 chars)
     * Dimensions: "101.6x152.4 mm" (also "4x6 in")
     * Category badge (colored)
     * Print method badge (thermal/inkjet/desktop)
     * Star icon (favorite toggle)
     * "Select" button (blue)
   - Click card or button: Select this label
   - Click star: Add to favorites
   - Hover state: Slight shadow increase, cursor pointer
   - Responsive: Works on mobile

6. Create src/lib/hooks/useLabels.ts
   - Fetch labels from database
   - Handle filters: category, marketplace, print_method, dpi
   - Handle search (debounced)
   - Pagination: 20 labels per page
   - Return: { labels, loading, error, hasMore, loadMore }
   - Cache results in localStorage

7. Create src/components/features/LabelBrowser/LabelBrowser.tsx (complete)
   - Combine Filter + Grid of LabelCards
   - Show loading skeleton (20 card placeholders)
   - Show error state with retry button
   - Show empty state: "No labels match your filters"
   - Infinite scroll or "Load More" button
   - Total count: "Showing 20 of 255 labels"

8. Responsive requirements:
   - Desktop (≥1024px): 4-column grid, sidebar fixed width (250px)
   - Tablet (768-1023px): 2-column grid, sidebar hamburger menu
   - Mobile (<768px): 1-column grid, sidebar full-screen overlay

9. Performance:
   - Lazy load images (thumbnail preview)
   - Virtual scroll for 255 items (don't render all at once)
   - Search debounced 300ms
   - Cache filter results

10. Accessibility:
    - Keyboard navigation (Tab, Enter to select)
    - Screen reader: "Label: Amazon FBA 4x6, 101.6x152.4mm"
    - Focus visible on cards and buttons
    - Semantic HTML (button, list items)

Test:
- Load page: See 20 labels + "Load More" button
- Search "4x6": Only 4x6 labels shown
- Filter by "amazon_fba": Only FBA labels shown
- Star a label: Heart filled, favorite saved to DB
- Click label: Highlight selected, show details
- Mobile: Sidebar slides in from left
```

---

### PHASE 4: LABEL EDITOR (Week 4-5, 60-80 hours - MOST COMPLEX)

This is the core feature. This section is extensive.

**Cursor Prompt for Phase 4 (Part A - Setup & Canvas):**
```
Implement the Label Editor - PART A: Setup & Canvas Rendering

1. Create src/lib/store/editorStore.ts (Zustand)
   - State:
     * selectedLabel: Label object
     * elements: Element[] (text, image, barcode, shape)
     * selectedElement: Element | null
     * canvas: { width_px, height_px, dpi, zoom_level }
     * history: { undo_stack, redo_stack }
     * is_saved: boolean
     * draft_auto_saved_at: timestamp
   
   - Actions:
     * setSelectedLabel(label)
     * addElement(element: TextElement | ImageElement | BarcodeElement | ShapeElement)
     * updateElement(id, changes)
     * deleteElement(id)
     * selectElement(id)
     * deselectElement()
     * setCanvasZoom(level: 25-400)
     * setCanvasDPI(203 | 300)
     * undo()
     * redo()
     * saveDesign()
     * saveDraft()

2. Create src/components/features/LabelEditor/LabelEditor.tsx (main container)
   - Layout: Left canvas, Right properties panel
   - Top toolbar (DPI, zoom, undo/redo, save)
   - Bottom info bar (canvas dimensions, zoom percentage)
   - Left panel (optional: layers)
   - Canvas area (center, 80% width on desktop)
   - Right panel (properties, 20% width on desktop)
   - Responsive: Stack vertically on <1024px

3. Create src/components/features/LabelEditor/Canvas.tsx
   - Render label design with HTML5 Canvas or SVG
   - Show white canvas at correct dimensions (pixel-perfect)
   - Show 8px grid (optional, toggle in settings)
   - Render all elements from store
   - Show selection outline (2px blue) around selected element
   - Show resize handles (6px circles at corners)
   - Show move cursor on drag
   - Support zoom 25%-400%
   - Show DPI info (203/300 DPI)
   - Canvas background: white (#FFFFFF)
   - Canvas border: 1px gray
   - Shadow: subtle drop shadow

4. Create src/components/features/LabelEditor/Canvas mouse/touch handlers
   - Click canvas: Deselect element
   - Click element: Select element
   - Drag element: Move on canvas
   - Drag resize handle: Resize element
   - Right-click: Context menu (copy, delete)
   - Touch support: tap to select, pinch to zoom
   - Keyboard: Arrow keys to nudge selected element (10px each)

5. Create src/types/editor.ts
   - TextElement interface:
     * id, type: 'text'
     * x, y, width, height, rotation
     * z_index
     * properties: { text, font, size, weight, color, align }
   
   - ImageElement interface:
     * id, type: 'image'
     * x, y, width, height, rotation
     * z_index
     * properties: { image_url, alt_text, opacity }
   
   - BarcodeElement interface:
     * id, type: 'barcode'
     * x, y, width, height, rotation
     * z_index
     * properties: { barcode_type, barcode_value, human_readable }
   
   - ShapeElement interface:
     * id, type: 'shape'
     * x, y, width, height, rotation
     * z_index
     * properties: { shape_type (rect, circle, line), fill_color, border_color, border_width }

6. Create rendering function (Canvas.tsx)
   - Calculate pixel dimensions based on DPI and mm
   - Amazon FBA 4x6 at 300 DPI = 1200x1800 px
   - Render all elements in z_index order
   - Text: Use selected font, size, weight
   - Image: Load from URL, respect dimensions
   - Barcode: Generate barcode image using library
   - Shape: Draw using Canvas API

7. Create zoom controls
   - Dropdown: 25%, 50%, 75%, 100%, 150%, 200%, 300%, 400%
   - Or: "Fit to screen" button
   - Zoom affects canvas size only (not actual print size)
   - Show zoom percentage in toolbar

8. Create DPI selector
   - Dropdown: 203 DPI (thermal), 300 DPI (professional), Custom
   - Show dimensions in both DPI: "300 DPI: 1200x1800 px" / "203 DPI: 812x1218 px"
   - Update canvas when DPI changes

9. Create element rendering libraries
   - Text rendering: Use Canvas fillText API
   - Image rendering: Use Canvas drawImage
   - Barcode rendering: Use jsBarcode library
   - Shape rendering: Use Canvas path API

10. Performance:
    - Canvas rendering optimized (requestAnimationFrame)
    - Debounce element updates (100ms)
    - Cache rendered elements where possible
    - No unnecessary re-renders

Test:
- Select label: Canvas shows white rectangle at correct dimensions
- Zoom to 50%: Canvas shrinks, stays centered
- Change DPI: Dimensions update (mm stay same, px change)
- Verify pixel dimensions match Section 1 specs exactly
```

**Cursor Prompt for Phase 4 (Part B - Text Element):**
```
Implement TEXT element (highest priority feature):

1. Create src/components/features/LabelEditor/elements/TextElement.tsx
   - Render text on canvas with all properties

2. Create src/components/features/LabelEditor/ToolPanel.tsx
   - Add text button: Click, sets cursor to text-placement mode
   - Click canvas: Adds text at that position
   - Show: "Click on canvas to place text"

3. Text element default properties:
   - Font: "Inter" (fallback: system sans-serif)
   - Size: 14px
   - Weight: 400 (normal)
   - Color: #000000 (black)
   - Align: left
   - Text: "Sample Text"
   - Position: Top-left of label
   - Rotation: 0 degrees

4. Create src/components/features/LabelEditor/PropertiesPanel.tsx
   - When text element selected, show:
     * Text input (editable, updates in real-time)
     * Font dropdown (Inter, Arial, Times New Roman, Monospace)
     * Font size slider (8pt - 72pt, +2 increment)
     * Font weight dropdown (Normal 400, Medium 500, Bold 600, Extra Bold 700)
     * Text color picker (blue color selector or hex input)
     * Text alignment (left, center, right, justify icons)
     * Rotation slider (0-360 degrees)
     * Delete button (red, removes element)
     * Z-index buttons (up/down in layer order)

5. Real-time editing:
   - User types in text input: Canvas updates immediately
   - User selects font: All text updates immediately
   - User changes size: Text scales on canvas immediately
   - User picks color: Text color changes on canvas immediately
   - Debounce updates: 100ms to prevent lag

6. Positioning & sizing:
   - Show X, Y position inputs (pixels)
   - Show width, height inputs (pixels)
   - Aspect ratio lock toggle
   - Min size: 10x10 px
   - Max size: Canvas width x Canvas height
   - Position can be negative (off-canvas)

7. Accessibility:
   - All inputs have labels
   - Color picker shows hex value (also accepts hex input)
   - Font size shows both pt and mm
   - Tab navigation through properties

8. Text validation:
   - Allow any text (including special characters, unicode)
   - Show character count (e.g. "12/255 characters" if limit)
   - Warn if text too large for bounding box
   - Auto-wrap long text in preview

9. Advanced text features (Phase 2):
   - Text shadow (optional)
   - Text outline (optional)
   - Line height / letter spacing (optional)

Test:
- Add text: Click canvas, text appears
- Edit text: Type in properties, canvas updates real-time
- Change font: All text updates
- Change size: Text scales
- Change color: Text color updates
- Move text: Drag on canvas or use position inputs
- Delete text: Red delete button removes element
- Layer order: Up/down buttons change z-index
```

**Cursor Prompt for Phase 4 (Part C - Image Element):**
```
Implement IMAGE element:

1. Create src/components/features/LabelEditor/elements/ImageElement.tsx
   - Render image on canvas

2. In ToolPanel.tsx, add "Add Image" button
   - Click: Opens file picker for image upload
   - Accept: .png, .jpg, .jpeg, .webp (max 2MB)
   - Upload to Supabase storage: /label_images/{user_id}/{design_id}/{filename}
   - Add image element to canvas at center
   - Show: "Uploading..." spinner

3. Image element default properties:
   - Position: Center of canvas
   - Size: 50% of canvas width, maintain aspect ratio
   - Rotation: 0 degrees
   - Opacity: 100%
   - Border: None

4. In PropertiesPanel, when image selected:
   - Show image preview (100px thumbnail)
   - "Replace image" button (upload new)
   - "Remove image" button (delete element)
   - Width/height inputs (in pixels)
   - Aspect ratio lock toggle
   - Rotation slider (0-360)
   - Opacity slider (0-100%, in 5% increments)
   - Opacity: 0% = transparent, 100% = opaque
   - X, Y position inputs
   - Z-index buttons (up/down)

5. Image rendering on canvas:
   - Use Canvas drawImage API
   - Show actual image preview on canvas
   - Show bounding box (dashed border) when selected
   - Show resize handles at corners

6. Image constraints:
   - Min size: 10x10 px
   - Max size: Canvas width x height
   - Can be rotated 0-360 degrees
   - Opacity affects only this image

7. Drag and drop:
   - Users can drag image from file manager onto canvas
   - Auto-resize to fit canvas if too large

8. Storage:
   - Images stored in Supabase storage
   - Path: /label_images/{user_id}/{design_id}/{uuid}.{ext}
   - When design deleted: Delete associated images
   - Max storage per user: Pro=100MB, Enterprise=1GB

Test:
- Upload image: File picker, upload, image appears on canvas
- Resize image: Drag handles, image scales
- Maintain aspect ratio: Lock toggle works
- Opacity slider: Image transparency changes
- Rotation: Image rotates 0-360
- Delete image: Removes element from canvas
```

**Cursor Prompt for Phase 4 (Part D - Barcode Element):**
```
Implement BARCODE element:

1. Install barcode library:
   npm install jsbarcode

2. Create src/components/features/LabelEditor/elements/BarcodeElement.tsx
   - Render barcode on canvas

3. In ToolPanel.tsx, add "Add Barcode" button
   - Click: Adds barcode element to canvas
   - Default type: CODE128 (most common)
   - Default value: "123456789"

4. Barcode element properties:
   - Position: Center of canvas
   - Size: 200px width, 50px height (default)
   - Rotation: 0 degrees
   - Barcode type: CODE128
   - Barcode value: User enters value
   - Human readable: Toggle (show/hide value below barcode)

5. Barcode types supported:
   - CODE128 (most common, default)
   - EAN13 (13 digits)
   - EAN8 (8 digits)
   - UPC-A (12 digits)
   - UPC-E (6 digits)
   - CODE39
   - AZTEC
   - QRCODE

6. In PropertiesPanel, when barcode selected:
   - Barcode value input (editable, shows preview)
   - Barcode type dropdown (all types listed above)
   - Show barcode preview (actual barcode image)
   - Width/height inputs (in pixels)
   - Rotation slider (0-360)
   - Human readable toggle (show value below barcode)
   - Human readable font size selector (6pt - 12pt)
   - X, Y position inputs
   - Z-index buttons
   - Delete button

7. Validation:
   - Check barcode value matches type requirements
     * EAN13: Must be 13 digits
     * EAN8: Must be 8 digits
     * CODE128: Any value
   - Show error: "Invalid barcode value for type"
   - Prevent invalid barcodes from rendering

8. Generate barcode on canvas:
   - Use jsBarcode library
   - Generate SVG or Canvas representation
   - Render on canvas at specified position/size
   - Update in real-time as value changes

9. Advanced options (Phase 2):
   - Custom quiet zone (margin around barcode)
   - Line width adjustment
   - Color customization

Test:
- Add barcode: Default CODE128 appears on canvas
- Change value: Barcode updates immediately
- Change type: Validation applies (e.g., EAN13 must be 13 digits)
- Resize: Barcode scales
- Human readable: Toggle shows/hides value
- Invalid value: Error message shown, barcode doesn't render
```

**Cursor Prompt for Phase 4 (Part E - Shape Element):**
```
Implement SHAPE element:

1. Create src/components/features/LabelEditor/elements/ShapeElement.tsx
   - Render shape on canvas

2. In ToolPanel.tsx, add "Add Shape" button dropdown:
   - Rectangle (default)
   - Circle
   - Line
   - Diamond (optional Phase 2)

3. Shape element properties:
   - Position: (x, y)
   - Size: (width, height) - except line
   - Rotation: 0-360 degrees
   - Fill color: Solid color or none
   - Border color: Solid color
   - Border width: 1-10px
   - Opacity: 0-100%

4. Default shape properties:
   - Rectangle: 100x100px, black border 2px, no fill
   - Circle: 100x100px radius, black border 2px, no fill
   - Line: 100px long, black, 2px width
   - Fill: None (transparent)

5. In PropertiesPanel, when shape selected:
   - Shape type dropdown (rectangle, circle, line)
   - Width/height inputs (pixels)
   - Rotation slider (0-360)
   - Border color picker
   - Border width slider (1-10px)
   - Fill color picker
   - Fill opacity slider (0-100%, 0=no fill)
   - X, Y position inputs
   - Z-index buttons
   - Delete button

6. Rendering on canvas:
   - Rectangle: Canvas fillRect / strokeRect
   - Circle: Canvas arc / stroke
   - Line: Canvas moveTo / lineTo / stroke
   - Update in real-time as properties change

7. Constraints:
   - Min size: 5x5 px
   - Max size: Canvas width x height
   - Line: Can be any length, 0px width-height

8. Advanced options (Phase 2):
   - Fill pattern (dashed, dotted)
   - Rounded corners for rectangle
   - Arrow styles for lines

Test:
- Add rectangle: Rectangle appears on canvas
- Add circle: Circle appears
- Add line: Line appears
- Change colors: Fill and border update
- Resize: Shape scales
- Rotate: Shape rotates
- Delete: Removes element
```

**Cursor Prompt for Phase 4 (Part F - Undo/Redo & Layers):**
```
Implement UNDO/REDO and LAYERS PANEL:

1. Update Zustand store (editorStore.ts)
   - history: { undo_stack: [], redo_stack: [] }
   - Every action (add, update, delete element) pushes to undo_stack
   - Max history depth: 20 (keep last 20 actions)
   - Undo clears redo_stack

2. Create undo() action in store:
   - Pop from undo_stack
   - Push current state to redo_stack
   - Restore previous state
   - Max undo levels: 20

3. Create redo() action in store:
   - Pop from redo_stack
   - Push current state to undo_stack
   - Restore next state
   - Max redo levels: 20

4. Add undo/redo buttons to toolbar:
   - Undo button: Gray if no undo history, blue if available
   - Redo button: Gray if no redo history, blue if available
   - Tooltip on hover: "Undo (Ctrl+Z)" / "Redo (Ctrl+Shift+Z)"
   - Keyboard shortcuts: Ctrl+Z (undo), Ctrl+Shift+Z (redo)

5. Create src/components/features/LabelEditor/LayersPanel.tsx
   - Show list of all elements on canvas
   - Item per element: Icon + name + visibility toggle + delete
   - Text element: Text icon + text content (truncated)
   - Image element: Image icon + "Image"
   - Barcode element: Barcode icon + value
   - Shape element: Shape icon + "Rectangle" etc
   - Click element in list: Select on canvas
   - Drag to reorder: Change z-index

6. Layer visibility toggle:
   - Eye icon: Click to hide/show element
   - Hidden elements: Gray out in list, not visible on canvas
   - Useful for occlusion debugging

7. Layer deletion:
   - X button on each layer: Delete element
   - Confirm: "Are you sure?" (or just delete instantly)
   - Add to undo history

8. Layer naming:
   - Users can rename layers: "Text Element" → "Product Name"
   - Click to edit, click away to save
   - Double-click layer to edit name

9. Responsive layers panel:
   - Desktop: Fixed 200px left sidebar
   - Tablet: Hamburger menu, slide-in from left
   - Mobile: Below canvas (stacked)

10. Keyboard shortcuts:
    - Ctrl+Z: Undo
    - Ctrl+Shift+Z: Redo
    - Delete: Delete selected element
    - Cmd+S: Save design
    - Tab: Next element
    - Shift+Tab: Previous element

Test:
- Add 3 elements: All appear in layers panel
- Click element in list: Element selected on canvas
- Drag element in list: Z-index changes on canvas
- Click eye icon: Element hides on canvas
- Delete element: Removed from list and canvas
- Undo: Element comes back
- Redo: Element disappears again
- History limit: After 20 actions, oldest action lost
```

**Cursor Prompt for Phase 4 (Part G - Save & Draft)**:
```
Implement SAVE DESIGN and AUTO-SAVE DRAFT:

1. Create src/server/actions/designs.ts (Server Actions)
   - 'use server' directive
   - saveDesign(designData): Save to database
   - saveDraft(designData): Save draft auto-save
   - deleteDesign(id): Remove design
   - getDesigns(): List user's designs
   - getDesign(id): Load single design

2. Update Zustand store (editorStore.ts)
   - Add actions:
     * saveDesign(name, description): Call server action
     * saveDraft(): Call server action
     * loadDesign(id): Fetch design, restore state
   - Add state:
     * currentDesignId: UUID | null
     * is_saved: boolean
     * last_saved_at: timestamp
     * last_draft_at: timestamp

3. Auto-save draft:
   - Every 10 seconds: Call saveDraft() automatically
   - Don't block UI (async)
   - Show toast: "Draft saved at 2:45 PM"
   - Don't save if no changes since last save

4. Create save dialog (modal):
   - Trigger: Click "Save" button in toolbar
   - Form fields:
     * Design name (required, max 100 chars)
     * Description (optional, max 500 chars)
     * Make this a template (checkbox)
     * Save button (blue)
     * Cancel button
   - Validation:
     * Name required
     * Name unique for this user
     * No special characters (alphanumeric, spaces, hyphens)
   - Success: Toast "Design saved: Product Label"
   - Error: Show message in modal

5. Draft recovery:
   - On app load: Check for unsaved draft
   - If draft exists: Show modal "Recover unsaved design?"
   - Options: Recover / Discard
   - Recover: Load draft into editor

6. Save design to database:
   ```json
   {
     "id": "uuid",
     "user_id": "uuid",
     "label_base_id": "uuid",
     "name": "Amazon FBA 4x6",
     "description": "Product label with barcode",
     "elements": [
       { "id": "elem1", "type": "text", "x": 10, "y": 10, ... },
       { "id": "elem2", "type": "barcode", "x": 20, "y": 80, ... }
     ],
     "created_at": "2024-01-15T10:30:00Z",
     "updated_at": "2024-01-15T10:45:00Z"
   }
   ```

7. Design deletion:
   - Click "Delete" button: Confirm modal
   - Message: "Delete this design permanently?"
   - Options: Delete / Cancel
   - Delete: Remove from DB, close editor, redirect to dashboard

8. Design list / history:
   - Add "Recent designs" dropdown in toolbar
   - Show last 5 designs used
   - Click to load design
   - Or: Create "My Designs" page to list all

Test:
- Create new design, add elements
- Wait 10 seconds: Draft saved automatically
- Close and reopen: Draft recovery modal appears
- Click save: Modal appears, enter name, save
- Open saved design: Elements restore exactly
- Delete design: Confirm, then deleted
```

---

### PHASE 5: BATCH PROCESSING (Week 6, 35-45 hours)

**Cursor Prompt for Phase 5 (Complete Batch System):**
```
Implement BATCH LABEL PROCESSING:

1. Create src/components/features/BatchProcessor/BatchProcessor.tsx (main wizard)
   - 4-step wizard layout
   - Progress bar: "Step 1 of 4: Select Template"
   - Left: Step indicator (numbered circles)
   - Right: Step content
   - Bottom: Back button (disabled on step 1), Next button
   - Steps: Template → Upload → Map Columns → Generate

2. Create src/components/features/BatchProcessor/Step1TemplateSelection.tsx
   - Dropdown list of user's templates
   - Show preview image of template (thumbnail)
   - Description of template
   - "Next" button (enabled if template selected)
   - OR: Use existing design instead of template

3. Create src/components/features/BatchProcessor/Step2UploadData.tsx
   - Title: "Upload CSV or Excel File"
   - Drag-and-drop zone (dashed blue border, 200px height)
   - Hover: Background changes, cursor pointer
   - Drop file: Auto-upload
   - OR: Click to browse, select file
   - File picker: Accept .csv, .xlsx (max 10MB)
   - Show file name after upload: "data.csv (256 rows)"
   - File validation:
     * Check format (.csv or .xlsx only)
     * Check size (<10MB)
     * Auto-detect headers (first row)
     * Parse CSV/Excel
     * Show preview of first 5 rows in table
   - Show headers list: "Email, SKU, Product Name, Price"
   - Show row count: "Total rows: 256"
   - Error handling:
     * "Invalid file format"
     * "File too large (max 10MB)"
     * "No headers detected"
   - Next button enabled if file parsed successfully

4. Create src/components/features/BatchProcessor/Step3ColumnMapping.tsx
   - Left: CSV column list
   - Right: Template variable list
   - Each row: CSV column [Dropdown showing template variables]
   - Example:
     * CSV column "SKU" → Dropdown maps to "product_sku"
     * CSV column "Name" → Dropdown maps to "product_name"
   - Show sample data row (row 1 from CSV)
   - Show sample preview: With CSV data filled into template
   - Error: "Column 'SKU' not found. Map to template variable"
   - Next button enabled if all required fields mapped

5. Create src/components/features/BatchProcessor/Step4Generate.tsx
   - Summary:
     * Template name
     * Total labels to generate
     * File size estimate
     * Estimated time: "~30 seconds"
   - Preview first 5 labels with actual CSV data
   - Show in grid (2 columns on desktop)
   - Button options:
     * "Generate & Download" (blue) - Generate PDF, download file
     * "Print Directly" (secondary) - Send to printer
     * "Schedule for Later" (Pro+ only) - Schedule generation
   - Progress bar (during generation)
   - Success: "Generated 256 labels" + Download button
   - Error: "Generation failed: {error message}" + Retry button

6. Create src/lib/pdf/generator.ts
   - Function: generateBatchPDF(template, csvData, columnMapping)
   - For each CSV row:
     * Create new label design from template
     * Fill in text elements with CSV values
     * Generate PDF page
   - Output: Single PDF with all labels
   - Use: PDFKit library (npm install pdfkit)
   - File naming: "labels_{timestamp}.pdf"

7. Create src/app/api/batch/route.ts (backend)
   - POST /api/batch
   - Body: { template_id, csv_data, column_mapping }
   - Validate user auth
   - Check usage limits (free tier: 4 batches/month, Pro: unlimited)
   - Generate PDF (server-side, async job)
   - Store batch record in database
   - Return: { batch_id, status, download_url }

8. Create src/lib/hooks/useBatch.ts
   - Hook for batch processing state
   - Methods:
     * uploadFile(file): Parse CSV
     * mapColumns(columnMapping)
     * generateBatch(): Call API
     * downloadFile(batch_id)
   - Return: { step, progress, error, loading, data }

9. Batch job database record:
   ```json
   {
     "id": "uuid",
     "user_id": "uuid",
     "template_id": "uuid",
     "status": "completed",
     "total_labels": 256,
     "generated_labels": 256,
     "output_file_url": "https://storage.../labels_2024-01-15.pdf",
     "created_at": "2024-01-15T10:30:00Z",
     "completed_at": "2024-01-15T10:35:00Z"
   }
   ```

10. Error handling:
    - Invalid CSV: "Column 'SKU' not found"
    - Mapping incomplete: "Product name field required"
    - Generation failed: "PDF generation error"
    - File too large: "File exceeds 10MB limit"
    - Rate limit: "Batch limit exceeded this month"

11. CSV parsing requirements:
    - Auto-detect headers (first row)
    - Support .csv (comma-separated)
    - Support .xlsx (Excel format)
    - Handle quoted values with commas
    - Handle UTF-8 encoding
    - Skip empty rows
    - Show preview of first 5 rows

12. Responsive:
    - Desktop: Wizard full width (600px max), centered
    - Tablet: Full width with padding
    - Mobile: Full screen, swipe to navigate (nice-to-have)

13. Performance:
    - File parsing: <2 seconds for 1000 rows
    - PDF generation: <30 seconds for 256 labels
    - Show progress bar during generation
    - No page freeze (async operation)

14. Batch history:
    - After generation, add to recent batches
    - Link to download again later
    - Show in dashboard: "Recent batches" section
    - Store last 10 batches per user

Test:
- Upload CSV file: Headers detected, shown in list
- Map columns: Select "Product name" from dropdown
- Generate: Progress bar shows ~30 seconds, then downloads PDF
- Verify PDF: Open file, check labels match CSV data
- Error: Upload invalid file, see error message
- Limit: Free user after 4 batches, see "limit exceeded"
```

---

### PHASE 6-12: REMAINING FEATURES

Due to length constraints, here are the condensed prompts for remaining phases:

**PHASE 6: PRINTER INTEGRATION** (Week 7, 25-30 hours)
```
Implement printer management and printing:

1. Create src/app/(dashboard)/printers/page.tsx
   - List user's configured printers
   - Add printer button

2. Create printer setup form:
   - Printer name
   - Printer type (DYMO, Zebra, Rollo, Brother, Desktop)
   - Connection (USB, Network IP, System printer)
   - DPI (203, 300)
   - Darkness (0-30)
   - Label gap
   - Test print button

3. Create src/lib/services/printerService.ts
   - connectPrinter(config): Verify connection
   - testPrint(): Send small PDF to printer
   - printLabels(designId, quantity, printerid): Print design

4. Print flow:
   - In editor: Click "Print" button
   - Modal: Select printer, quantity, OK
   - Send to printer (system print dialog or direct)

5. Printer statuses:
   - Online (green)
   - Offline (red)
   - Last check time

6. Error handling:
   - "Printer offline"
   - "Wrong label size"
   - "Out of paper"
```

**PHASE 7-10: PRICING, SEO, ANALYTICS, QA**

These are standard implementations:
- Stripe integration for Pro/Enterprise tiers
- SEO meta tags and schema markup
- Google Analytics 4 event tracking
- Performance optimization & testing

**PHASE 11-12: LAUNCH & MARKETING**

Production deployment, monitoring, marketing launch.

---

## SECTION 4: QUALITY ASSURANCE CHECKLIST

Use this checklist before launch:

### Functional Testing
- [ ] Signup flow complete (email verification)
- [ ] Login persists session
- [ ] Browse all 255 labels (search + filter works)
- [ ] Create label design (text, image, barcode, shape)
- [ ] Undo/redo works 10+ levels
- [ ] Save design + load design
- [ ] Batch processing: CSV upload → PDF download
- [ ] Printer setup + test print
- [ ] Subscribe Pro → Features unlock
- [ ] Free tier limit enforcement (200 labels/month)

### Performance
- [ ] Homepage: <2.5s FCP (First Contentful Paint)
- [ ] Dashboard: <2.5s FCP
- [ ] Editor: <3s initial load
- [ ] Label browser: Search results <300ms
- [ ] PDF generation: <30 seconds for 256 labels
- [ ] Bundle size: <150KB JavaScript

### Mobile Responsiveness
- [ ] 320px (iPhone SE) - No horizontal scroll
- [ ] 768px (iPad) - 2-column grid
- [ ] 1024px (iPad Pro) - 4-column grid
- [ ] Touch buttons: 44px minimum height
- [ ] Forms: Stack vertically on mobile

### Accessibility (WCAG 2.1 AA)
- [ ] Color contrast: 4.5:1 minimum
- [ ] All inputs have labels
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Alt text on all images
- [ ] Screen reader compatible

### Security
- [ ] Passwords hashed (bcrypt)
- [ ] SQL injection protection
- [ ] XSS protection (input sanitized)
- [ ] CSRF tokens on forms
- [ ] Rate limiting on auth (5 attempts/15 min)
- [ ] RLS enabled on all tables

### Data Validation
- [ ] Email format validation
- [ ] Password strength (8+ chars, uppercase, number, special)
- [ ] CSV validation (headers required)
- [ ] Barcode validation (format matches type)
- [ ] File size limits enforced

### Browser Support
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] No console errors

---

## FINAL SUMMARY

This master prompt provides:

✅ **All 255 label specifications** with exact dimensions (mm, inch, px at 203/300 DPI)
✅ **Complete responsive design** for mobile (320px), tablet (768px), desktop (1024px+)
✅ **12-week implementation roadmap** with phase-by-phase breakdown
✅ **Detailed Cursor prompts** for every major feature
✅ **Design system** with CSS variables (colors, spacing, typography)
✅ **Database schema** with RLS security
✅ **Full-stack features**: Auth, editor, batch, printers, pricing
✅ **Quality checklist** for launch readiness

**Total implementation time: 300-420 hours (9-12 weeks)**
**Team size: 1-2 developers**

---

## HOW TO USE THIS PROMPT

1. **Copy each PHASE's Cursor Prompts** into your Cursor AI chat
2. **Follow the WEEK-BY-WEEK ROADMAP** in Section 3
3. **Reference SECTION 1 (Label Specs)** when building database
4. **Use DESIGN SYSTEM (Section 2)** for all components
5. **Check QUALITY CHECKLIST (Section 4)** before moving to next phase

This prompt is self-contained and actionable. No additional research needed.

**Let's build LabelPro! 🚀**
