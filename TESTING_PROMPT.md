# LabelPro Comprehensive Testing Guide

## Test Strategy

This document outlines comprehensive test prompts to verify all pages and functionality in LabelPro.

## Test Categories

### 1. Authentication Pages

#### Login Page (`/login`)
**Test Cases:**
- [ ] Page loads without errors
- [ ] Email input field exists and accepts input
- [ ] Password input field exists and accepts input
- [ ] "Remember me" checkbox exists
- [ ] "Sign in" button exists and is clickable
- [ ] "Forgot password?" link exists and navigates to reset password page
- [ ] "Don't have an account? Sign up" link exists and navigates to signup page
- [ ] OAuth buttons (Google, Amazon) are visible and clickable
- [ ] Form validation works (empty fields show errors)
- [ ] Invalid credentials show error message
- [ ] Valid credentials redirect to dashboard
- [ ] After login, user session is established

#### Signup Page (`/signup`)
**Test Cases:**
- [ ] Page loads without errors
- [ ] Full name input field exists
- [ ] Email input field exists
- [ ] Password input field exists
- [ ] Confirm password field exists (if implemented)
- [ ] Terms and conditions checkbox exists (if implemented)
- [ ] "Create account" button exists
- [ ] OAuth buttons (Google, Amazon) are visible
- [ ] Form validation works (email format, password strength)
- [ ] Successful signup creates user and redirects
- [ ] Duplicate email shows error

#### Password Reset Page (`/reset-password`)
**Test Cases:**
- [ ] Page loads without errors
- [ ] Email input field exists
- [ ] "Send reset link" button exists
- [ ] Form validation works
- [ ] Valid email sends reset link
- [ ] Success message displays after submission

#### OAuth Callback (`/auth/callback`)
**Test Cases:**
- [ ] Callback route exists
- [ ] Handles OAuth code parameter
- [ ] Exchanges code for session
- [ ] Creates/updates user profile
- [ ] Redirects to dashboard on success
- [ ] Shows error on failure

### 2. Marketing Pages

#### Homepage (`/`)
**Test Cases:**
- [ ] Page loads without errors
- [ ] Hero section displays
- [ ] Features section displays
- [ ] Pricing preview section displays
- [ ] Testimonials section displays
- [ ] CTA buttons work and link correctly
- [ ] "Get Started" button navigates to signup
- [ ] Navigation menu works
- [ ] Footer displays correctly

#### Pricing Page (`/pricing`)
**Test Cases:**
- [ ] Page loads without errors
- [ ] All 3 pricing tiers display (Starter, Pro, Enterprise)
- [ ] Pricing information is correct ($0, $7.99, $39.99)
- [ ] Feature lists display for each tier
- [ ] "Get Started" buttons exist
- [ ] Comparison table/section exists (if implemented)
- [ ] FAQ section displays (if included)

#### FAQ Page (`/faq`)
**Test Cases:**
- [ ] Page loads without errors
- [ ] All FAQ items display
- [ ] FAQ items are expandable/collapsible
- [ ] Search functionality works (if implemented)
- [ ] Content is readable and formatted correctly

#### Labels Browser Page (`/labels`)
**Test Cases:**
- [ ] Page loads without errors
- [ ] Label cards display
- [ ] Search input exists and works
- [ ] Filter sidebar displays (if implemented)
- [ ] Categories are displayed
- [ ] Label details show (dimensions, marketplace, etc.)
- [ ] "Use this label" or similar button works
- [ ] Pagination works (if implemented)

#### Blog Index (`/blog`)
**Test Cases:**
- [ ] Page loads without errors
- [ ] Blog post cards/list displays
- [ ] Post titles, excerpts, dates display
- [ ] "Read more" links work
- [ ] Pagination works (if implemented)

#### Blog Post Pages (`/blog/[slug]`)
**Test Cases:**
- [ ] All 4 blog posts are accessible:
  - `/blog/getting-started-with-labelpro`
  - `/blog/tips-for-batch-label-processing`
  - `/blog/label-format-requirements-by-marketplace`
  - `/blog/optimizing-label-workflows`
- [ ] Post content displays correctly
- [ ] Post metadata (date, author, read time) displays
- [ ] "Back to blog" link works
- [ ] Content formatting is correct (headings, lists, code blocks)

### 3. Dashboard Pages (Requires Authentication)

#### Dashboard Home (`/dashboard`)
**Test Cases:**
- [ ] Page loads (redirects to login if not authenticated)
- [ ] Stats cards display (labels created, batches processed, etc.)
- [ ] Recent activity section displays
- [ ] Quick actions work
- [ ] Navigation sidebar/menu works

#### Label Editor (`/editor`)
**Test Cases:**
- [ ] Page loads
- [ ] Canvas displays
- [ ] Tool panel displays
- [ ] Properties panel displays
- [ ] Can add text elements
- [ ] Can add image elements
- [ ] Can add barcode elements
- [ ] Can add shape elements
- [ ] Elements can be moved/dragged
- [ ] Elements can be resized
- [ ] Elements can be deleted
- [ ] Undo/redo works
- [ ] Save functionality works
- [ ] Download PDF works
- [ ] Print functionality works (if implemented)

#### Templates Page (`/templates`)
**Test Cases:**
- [ ] Page loads
- [ ] Template list displays
- [ ] Can create new template
- [ ] Can edit template
- [ ] Can delete template
- [ ] Can duplicate template
- [ ] Search/filter works

#### Batch Processing (`/batch`)
**Test Cases:**
- [ ] Page loads
- [ ] Step 1: Template selection works
- [ ] Step 2: CSV/Excel upload works
- [ ] Step 3: Column mapping works
- [ ] Step 4: Review and generate works
- [ ] Batch job creates successfully
- [ ] Progress tracking works
- [ ] Download generated labels works

#### Settings Page (`/settings`)
**Test Cases:**
- [ ] Page loads
- [ ] Account tab displays
- [ ] Billing tab displays
- [ ] Notifications tab displays
- [ ] Can update profile information
- [ ] Can change password (via reset flow)
- [ ] Can export data (GDPR)
- [ ] Can delete account
- [ ] Subscription tier displays correctly
- [ ] Notification preferences save correctly

### 4. API Endpoints

#### Authentication APIs
- [ ] `POST /api/auth/signup` - Creates user successfully
- [ ] `POST /api/auth/login` - Returns session on valid credentials
- [ ] `POST /api/auth/logout` - Invalidates session
- [ ] Rate limiting works (too many requests return 429)

#### User Data APIs
- [ ] `GET /api/user/export-data` - Returns user data JSON (requires auth)
- [ ] `DELETE /api/user/delete-account` - Soft deletes user data (requires auth)
- [ ] Rate limiting works (5 requests/hour)

#### Label APIs
- [ ] `GET /api/labels` - Returns label list
- [ ] `GET /api/labels/[id]` - Returns specific label
- [ ] `POST /api/labels/download` - Downloads label PDF (requires auth)

#### Batch APIs
- [ ] `POST /api/batch` - Creates batch job (requires auth)
- [ ] `GET /api/batch/[id]` - Returns batch job status

#### Admin APIs
- [ ] `GET /api/admin/analytics` - Returns analytics (requires admin)
- [ ] Non-admin users get 403 Forbidden

### 5. Component Functionality

#### Label Browser Component
- [ ] Search filters labels
- [ ] Category filters work
- [ ] Marketplace filters work
- [ ] Label cards display correctly
- [ ] Favorite button works (if implemented)

#### Batch Processor Component
- [ ] All 4 steps render correctly
- [ ] Step navigation works
- [ ] File upload accepts CSV/Excel
- [ ] Column mapping interface works
- [ ] Preview displays correctly

#### Admin Analytics Component
- [ ] Charts render correctly
- [ ] MRR/ARR display correctly
- [ ] Churn rate calculates correctly
- [ ] User growth displays correctly
- [ ] Feature usage displays correctly

### 6. SEO & Metadata

#### All Pages
- [ ] Page title is set correctly
- [ ] Meta description exists
- [ ] Open Graph tags exist (for marketing pages)
- [ ] Structured data (Schema.org) exists in layout
- [ ] Sitemap includes all pages (`/sitemap.xml`)
- [ ] Robots.txt is accessible (`/robots.txt`)

### 7. Error Handling

#### Error Pages
- [ ] 404 page exists and displays
- [ ] 500 error page exists (if implemented)
- [ ] Unauthorized access redirects to login
- [ ] API errors return appropriate status codes

### 8. Performance & Accessibility

#### Performance
- [ ] Pages load within reasonable time
- [ ] Images are optimized
- [ ] No console errors
- [ ] No broken links

#### Accessibility
- [ ] Keyboard navigation works
- [ ] Screen reader compatibility (if applicable)
- [ ] Color contrast is sufficient
- [ ] Form labels are associated correctly

## Test Execution Commands

### Run Development Server
```bash
npm run dev
```

### Test URLs (Development)
- Homepage: http://localhost:3000
- Login: http://localhost:3000/login
- Signup: http://localhost:3000/signup
- Dashboard: http://localhost:3000/dashboard
- Pricing: http://localhost:3000/pricing
- FAQ: http://localhost:3000/faq
- Labels: http://localhost:3000/labels
- Blog: http://localhost:3000/blog
- Settings: http://localhost:3000/settings

### Test API Endpoints
```bash
# Test labels endpoint
curl http://localhost:3000/api/labels

# Test signup (requires body)
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!@#","full_name":"Test User"}'
```

## Automated Testing Script

See `test-all-pages.js` for automated page accessibility tests.

