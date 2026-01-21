# LabelPro - Runtime Testing Checklist

**Last Updated:** December 19, 2024  
**Purpose:** Comprehensive checklist for runtime testing and verification

---

## PRE-TESTING SETUP

### Environment Setup
- [ ] Copy `.env.example` to `.env.local`
- [ ] Fill in all REQUIRED environment variables
- [ ] Verify Supabase connection works
- [ ] Run `npm install` to ensure all dependencies are installed
- [ ] Run `npm run build` to check for build errors
- [ ] Run `npx tsc --noEmit` to check for TypeScript errors

### Database Setup
- [ ] Run database schema SQL files in Supabase
- [ ] Verify all 10 tables are created
- [ ] Run `npm run seed:labels` to seed 255 labels
- [ ] Verify label count: `SELECT COUNT(*) FROM labels;` (should be 255)
- [ ] Verify RLS policies are enabled on all tables
- [ ] Verify indexes are created

---

## SECTION 1: AUTHENTICATION FLOW

### Signup Flow
- [ ] Navigate to `/signup`
- [ ] Form validation works (email format, password strength)
- [ ] Password strength indicator shows
- [ ] Submit button disabled until form is valid
- [ ] Can create new account
- [ ] Receives verification email (if enabled)
- [ ] Redirects to dashboard after signup
- [ ] Profile created with subscription_tier="free"

### Login Flow
- [ ] Navigate to `/login`
- [ ] Can login with email/password
- [ ] "Remember me" checkbox works
- [ ] "Forgot password?" link works
- [ ] Error messages display correctly
- [ ] Redirects to dashboard after login
- [ ] Session persists on page refresh

### Password Reset
- [ ] Request password reset
- [ ] Receives reset email
- [ ] Can access reset link
- [ ] Can set new password
- [ ] Can login with new password

### Protected Routes
- [ ] Unauthenticated user redirected from `/dashboard` to `/login`
- [ ] Unauthenticated user redirected from `/editor` to `/login`
- [ ] Unauthenticated user redirected from `/batch` to `/login`
- [ ] Authenticated user can access all protected routes
- [ ] Public routes (`/`, `/features`, `/pricing`) accessible without auth

### OAuth (if configured)
- [ ] Google Sign-In button works (if configured)
- [ ] Amazon Sign-In button works (if configured)
- [ ] OAuth redirects correctly
- [ ] OAuth creates user profile

---

## SECTION 2: LABEL BROWSER

### Label Display
- [ ] Navigate to `/labels`
- [ ] Page title "Label Browser" displays
- [ ] Label grid displays (4 columns on desktop)
- [ ] Labels load correctly
- [ ] Label cards show correct information (name, dimensions)
- [ ] Label cards show category badges
- [ ] Images/placeholders display correctly

### Search Functionality
- [ ] Search input is visible
- [ ] Search is debounced (300ms delay)
- [ ] Search filters labels by name
- [ ] Search filters labels by category
- [ ] "No results" message shows when no matches
- [ ] Clear search button works

### Filter Functionality
- [ ] Category filter dropdown works
- [ ] Print method filter works
- [ ] DPI filter works
- [ ] Multiple filters work together
- [ ] Clear filters button resets all filters
- [ ] Filter state persists (optional)

### Label Details
- [ ] Click label card shows details (modal or page)
- [ ] Dimensions displayed (mm, inches, pixels)
- [ ] Category badge displayed
- [ ] Print method displayed
- [ ] DPI options displayed
- [ ] "Use This Label" button navigates to editor

### Favorites
- [ ] Star icon on label cards
- [ ] Click star adds to favorites
- [ ] Click star again removes from favorites
- [ ] Favorites persist after page refresh
- [ ] Can filter by favorites only
- [ ] Favorites count displays correctly

### Pagination/Load More
- [ ] "Load More" button appears when more labels available
- [ ] Clicking loads next batch
- [ ] Button disabled when all labels loaded
- [ ] Label count updates correctly

---

## SECTION 3: LABEL EDITOR

### Canvas Rendering
- [ ] Canvas displays when label selected
- [ ] Canvas shows correct dimensions
- [ ] Canvas background is white
- [ ] Grid overlay toggles on/off
- [ ] Canvas scales correctly with zoom

### Label Selection
- [ ] Can select label from browser
- [ ] Editor loads with selected label
- [ ] Dimensions update based on label
- [ ] DPI selector works (203/300)
- [ ] Canvas size updates with DPI change

### Text Element
- [ ] "Add Text" button works
- [ ] Text appears on canvas at click position
- [ ] Can select text element
- [ ] Selection outline (blue border) appears
- [ ] Properties panel shows text element properties:
  - [ ] Text input field
  - [ ] Font dropdown
  - [ ] Font size slider
  - [ ] Font weight selector
  - [ ] Color picker
  - [ ] Alignment buttons (left, center, right)
  - [ ] Rotation slider
  - [ ] Position inputs (X, Y)
  - [ ] Width/height inputs
  - [ ] Delete button
  - [ ] Z-index buttons (bring to front, send to back)
- [ ] Editing text updates on canvas in real-time
- [ ] Can drag text element to new position
- [ ] Can resize text element
- [ ] Can delete text element

### Image Element
- [ ] "Add Image" button works
- [ ] File picker opens
- [ ] Can upload image file (JPG, PNG, WebP)
- [ ] Image uploads to Supabase storage
- [ ] Image appears on canvas
- [ ] Can select image element
- [ ] Properties panel shows image properties:
  - [ ] Preview thumbnail
  - [ ] Width/height inputs
  - [ ] Aspect ratio lock toggle
  - [ ] Rotation slider
  - [ ] Opacity slider (0-100%)
  - [ ] Position inputs
  - [ ] Replace button
  - [ ] Delete button
- [ ] Can drag image to new position
- [ ] Can resize image (with/without aspect ratio lock)
- [ ] Opacity changes update on canvas

### Barcode Element
- [ ] "Add Barcode" button works
- [ ] Barcode appears on canvas
- [ ] Can select barcode element
- [ ] Properties panel shows barcode properties:
  - [ ] Value input
  - [ ] Type dropdown (CODE128, EAN13, UPC, etc.)
  - [ ] Human readable toggle
  - [ ] Width/height inputs
  - [ ] Rotation
  - [ ] Position inputs
  - [ ] Delete button
- [ ] Barcode type validation works (EAN13 = 13 digits)
- [ ] Barcode renders correctly based on type
- [ ] Can drag and resize barcode

### Shape Element
- [ ] "Add Shape" dropdown shows options
- [ ] Rectangle option works
- [ ] Circle option works
- [ ] Line option works
- [ ] Can select shape element
- [ ] Properties panel shows shape properties:
  - [ ] Shape type dropdown
  - [ ] Width/height inputs
  - [ ] Border color picker
  - [ ] Border width slider
  - [ ] Fill color picker
  - [ ] Fill opacity slider
  - [ ] Rotation
  - [ ] Delete button
- [ ] Shapes render correctly on canvas
- [ ] Can drag and resize shapes

### Layers Panel
- [ ] Layers panel visible on left side
- [ ] Shows all elements in correct order (bottom to top)
- [ ] Click element in layers panel selects it on canvas
- [ ] Can drag elements in layers panel to reorder
- [ ] Z-index updates when reordering
- [ ] Visibility toggle (eye icon) works
- [ ] Delete button in layers panel works
- [ ] Element count displays correctly

### Undo/Redo
- [ ] Undo button (or Ctrl+Z) works
- [ ] Redo button (or Ctrl+Shift+Z) works
- [ ] Undo reverts last action
- [ ] Redo reapplies undone action
- [ ] Buttons disabled when no history available
- [ ] History limit enforced (max 20 actions)

### Save Design
- [ ] Save button exists
- [ ] Clicking save opens modal
- [ ] Modal has design name input
- [ ] Modal has description input (optional)
- [ ] Modal has "Save as template" checkbox
- [ ] Can save design successfully
- [ ] Design saved to database
- [ ] Toast notification appears
- [ ] Can reload saved design later

### Auto-Save Draft
- [ ] Auto-saves every 10 seconds (check console/logs)
- [ ] Toast notification shows "Draft saved"
- [ ] Can reload page and recover draft
- [ ] Draft recovery modal appears on reload
- [ ] Can choose to recover or discard draft
- [ ] Recovery loads previous state correctly

### Keyboard Shortcuts
- [ ] Delete key deletes selected element
- [ ] Arrow keys move selected element (1px increments)
- [ ] Shift+Arrow keys move 10px increments
- [ ] Escape deselects element
- [ ] Ctrl+S saves design
- [ ] Ctrl+Z undoes action
- [ ] Ctrl+Shift+Z redoes action
- [ ] Ctrl+C copies element (if implemented)
- [ ] Ctrl+V pastes element (if implemented)

### Download/Export
- [ ] Download button works
- [ ] Can download as PDF
- [ ] Can download as PNG (if implemented)
- [ ] PDF has correct dimensions
- [ ] All elements render correctly in PDF

### Print
- [ ] Print button opens print modal
- [ ] Can select printer
- [ ] Can configure print settings
- [ ] Print job executes successfully
- [ ] Print history records the job

---

## SECTION 4: BATCH PROCESSING

### Step 1: Template Selection
- [ ] Template dropdown displays
- [ ] Shows user's saved templates
- [ ] Shows public templates (if any)
- [ ] Preview image displays for templates
- [ ] Can select a template
- [ ] Next button enabled after selection

### Step 2: CSV Upload
- [ ] Drag-and-drop zone works
- [ ] File picker button works
- [ ] Accepts .csv files
- [ ] Accepts .xlsx files
- [ ] Rejects files >10MB with error
- [ ] Preview table shows first 5 rows
- [ ] Row count displays correctly
- [ ] Headers detected automatically
- [ ] Next button enabled after upload

### Step 3: Column Mapping
- [ ] CSV columns listed
- [ ] Dropdown for each column
- [ ] Template variables shown
- [ ] Sample preview updates as mapping changes
- [ ] Next button disabled until all required fields mapped
- [ ] Validation shows errors for missing required fields

### Step 4: Generate
- [ ] Summary shows template name
- [ ] Summary shows label count
- [ ] Summary shows estimated time
- [ ] Preview shows first 5 labels
- [ ] "Generate & Download" button works
- [ ] Progress bar shows during generation
- [ ] Generation completes <30 seconds (for small batches)
- [ ] PDF downloads automatically
- [ ] PDF contains all labels correctly formatted

### Batch History
- [ ] Batch saved to database
- [ ] Navigate to `/batch/history`
- [ ] Shows recent batches
- [ ] Shows batch info (name, date, count, status)
- [ ] Can redownload completed batches
- [ ] Status indicators work (pending, processing, completed, failed)

### Usage Limits
- [ ] Free tier: Limited to 4 batches/month
- [ ] Pro tier: Unlimited batches
- [ ] Error message shows when limit reached
- [ ] Upgrade prompt appears when limit reached

---

## SECTION 5: PRINTER INTEGRATION

### Printer Settings Page
- [ ] Navigate to `/printers`
- [ ] "Add Printer" button visible
- [ ] List of printers displays
- [ ] Each printer shows:
  - [ ] Name
  - [ ] Type
  - [ ] Connection type
  - [ ] Status (Online/Offline)
  - [ ] Edit button
  - [ ] Delete button
  - [ ] Test print button
- [ ] Can set default printer (radio button)

### Add Printer Form
- [ ] Form opens (modal or page)
- [ ] Printer name input works
- [ ] Printer type dropdown shows options (DYMO, Zebra, Rollo, Brother, Generic)
- [ ] Connection type dropdown works (USB, Network, System)
- [ ] USB port selector works (if USB selected)
- [ ] Network IP input works (if Network selected)
- [ ] DPI dropdown works
- [ ] Darkness slider works (0-30)
- [ ] Label gap selector works
- [ ] Save button creates printer
- [ ] Error validation works

### Test Print
- [ ] Test print button works
- [ ] Modal or confirmation appears
- [ ] Test label prints successfully
- [ ] Success message displays
- [ ] Error message displays if print fails

---

## SECTION 6: TEMPLATES

### Templates List
- [ ] Navigate to `/templates`
- [ ] Shows user's templates
- [ ] Shows public templates
- [ ] Template cards display correctly
- [ ] Can filter by user/public
- [ ] Can search templates

### Template Management
- [ ] Can view template details
- [ ] Can use template (opens in editor)
- [ ] Can edit template (if owner)
- [ ] Can delete template (if owner)
- [ ] Can download template
- [ ] Can make template public/private

---

## SECTION 7: RESPONSIVE DESIGN

### Mobile (320px width)
- [ ] Single column layout
- [ ] No horizontal scroll
- [ ] Buttons are touch-friendly (44px minimum)
- [ ] Hamburger menu works (if implemented)
- [ ] Forms stack vertically
- [ ] Navigation accessible
- [ ] Editor canvas responsive

### Tablet (768px width)
- [ ] Two-column layout where appropriate
- [ ] Sidebar collapses/hides
- [ ] No horizontal scroll
- [ ] Touch interactions work

### Desktop (1024px+)
- [ ] Four-column grid where appropriate
- [ ] Sidebar visible
- [ ] Proper spacing maintained
- [ ] All features accessible

---

## SECTION 8: PERFORMANCE

### Page Load Metrics (Lighthouse)
- [ ] First Contentful Paint (FCP) < 2500ms
- [ ] Largest Contentful Paint (LCP) < 2500ms
- [ ] Cumulative Layout Shift (CLS) < 0.1
- [ ] Time to Interactive (TTI) < 5000ms
- [ ] Total Blocking Time (TBT) < 300ms
- [ ] Lighthouse Performance Score ≥ 90

### Runtime Performance
- [ ] Search results appear < 300ms
- [ ] Filter updates < 200ms
- [ ] Element render < 100ms
- [ ] Drag operations smooth (60fps)
- [ ] Zoom operations smooth
- [ ] No console errors
- [ ] No memory leaks

### Bundle Size
- [ ] JavaScript bundle < 150KB (gzipped)
- [ ] Total page size < 500KB
- [ ] Images optimized (WebP where possible)
- [ ] Code splitting working

---

## SECTION 9: ACCESSIBILITY

### Keyboard Navigation
- [ ] Tab through all interactive elements
- [ ] Focus outline visible on all elements
- [ ] Focus order logical
- [ ] No keyboard traps
- [ ] Escape closes modals
- [ ] Enter activates buttons
- [ ] Arrow keys work in dropdowns

### Screen Reader
- [ ] Page titles set correctly
- [ ] Heading hierarchy correct (h1, h2, h3)
- [ ] Alt text on all images
- [ ] Form labels present and linked
- [ ] Button text clear and descriptive
- [ ] ARIA labels where needed

### Color Contrast
- [ ] Text on background ≥ 4.5:1 contrast ratio
- [ ] Buttons ≥ 4.5:1 contrast ratio
- [ ] Links ≥ 4.5:1 contrast ratio
- [ ] Error messages visible

---

## SECTION 10: SECURITY

### Authentication Security
- [ ] Passwords hashed (not plaintext in database)
- [ ] JWT tokens signed
- [ ] Tokens expire correctly (30 days)
- [ ] HTTP-only cookies used
- [ ] Secure flag on cookies (HTTPS)
- [ ] SameSite=Strict on cookies

### Protection
- [ ] CSRF tokens on forms (if implemented)
- [ ] User input sanitized
- [ ] No SQL injection vulnerability (using parameterized queries)
- [ ] Rate limiting works (5 attempts/15min)
- [ ] Email verification required (if enabled)
- [ ] RLS policies enforced

---

## SECTION 11: BROWSER COMPATIBILITY

Test on latest versions:
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge
- [ ] Mobile Chrome
- [ ] Mobile Safari

---

## SECTION 12: ERROR HANDLING

### Error Scenarios
- [ ] Network errors handled gracefully
- [ ] API errors show user-friendly messages
- [ ] 404 page displays correctly
- [ ] 500 errors show error boundary
- [ ] Form validation errors display
- [ ] Loading states show during async operations

---

## TESTING NOTES

### Date Tested: _______________
### Tester: _______________
### Browser Used: _______________
### Device: _______________

### Critical Issues Found:
1. 
2. 
3. 

### Major Issues Found:
1. 
2. 
3. 

### Minor Issues Found:
1. 
2. 
3. 

### Overall Status:
- [ ] ✅ PASS - Ready for production
- [ ] ⚠️ PASS WITH NOTES - Minor issues to fix
- [ ] ❌ FAIL - Major issues to fix

---

## NEXT STEPS AFTER TESTING

1. Document all issues found
2. Prioritize fixes (Critical → Major → Minor)
3. Re-test after fixes
4. Perform final QA review
5. Deploy to staging environment
6. Perform staging verification
7. Deploy to production

