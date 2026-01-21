# Quick Testing Guide

## 🚀 Start Development Server

```bash
npm run dev
```

Server will start at: http://localhost:3000

---

## ✅ Test Checklist (5 Minutes)

### 1. Schema.org Structured Data (1 min)
**Action**: View page source
- Open: http://localhost:3000
- Right-click → "View Page Source" (or Ctrl+U)
- Search (Ctrl+F) for: `application/ld+json`
- **Expected**: Find 2 script tags with JSON-LD data

**Quick Validation**: Copy the JSON and paste at https://validator.schema.org/

---

### 2. FAQ Page (1 min)
**Action**: Visit FAQ page
- Open: http://localhost:3000/faq
- **Expected**: 
  - Page loads
  - 15 FAQ items visible
  - Click items to expand/collapse
  - Mobile responsive

---

### 3. Blog Content (2 min)
**Action**: Browse blog
- Open: http://localhost:3000/blog
- **Expected**: 4 articles listed
- Click each article:
  - "Getting Started with LabelPro"
  - "10 Tips for Efficient Batch Label Processing"
  - "Understanding Label Format Requirements by Marketplace"
  - "Optimizing Your Label Workflows"
- **Expected**: Full content displays with proper formatting

---

### 4. GDPR Export (1 min) ⚠️ Requires Login
**Action**: Export user data
1. Log in at: http://localhost:3000/login
2. Go to: Settings → Account
3. Scroll to "Data Export" section
4. Click "Export My Data"
5. **Expected**: JSON file downloads

---

### 5. Admin Analytics (1 min) ⚠️ Requires Admin Access
**Action**: View analytics dashboard
1. Log in as admin user (must have `is_admin: true` in database)
2. Navigate to: http://localhost:3000/admin/analytics
3. **Expected**:
   - Metrics display (MRR, Churn, Conversion Rate)
   - Charts render (Line, Pie, Bar charts)
   - Data formatted correctly

---

## 🔍 Verification Commands

### Check Schema.org in Browser Console:
```javascript
// Run in browser console on homepage
const scripts = document.querySelectorAll('script[type="application/ld+json"]')
console.log('Schema.org scripts found:', scripts.length)
scripts.forEach((script, i) => {
  console.log(`Script ${i+1}:`, JSON.parse(script.textContent))
})
```

### Test Rate Limiting (using curl):
```bash
# Test export endpoint (should allow 5 requests/hour)
for i in {1..6}; do
  curl -X GET http://localhost:3000/api/user/export-data \
    -H "Cookie: your-session-cookie" \
    -w "\nStatus: %{http_code}\n"
  sleep 1
done
```

---

## ⚠️ Common Issues

### Issue: Schema.org not in page source
**Solution**: Check that `src/app/layout.tsx` has the structured data scripts in `<head>`

### Issue: FAQ page shows empty
**Solution**: Verify `expandedFAQs` array has 15 items

### Issue: Blog articles not loading
**Solution**: Check that blog post slugs match in both `blog/page.tsx` and `blog/[slug]/page.tsx`

### Issue: Admin analytics shows error
**Solution**: 
- Verify user has `is_admin: true` in database
- Check browser console for API errors
- Verify `/api/admin/analytics` endpoint is accessible

### Issue: Rate limiting not working
**Solution**: 
- Verify rate limiting middleware is called in API routes
- Check that `rateLimitAPI` function is imported
- Test with multiple rapid requests

---

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Schema.org:
[ ] Scripts visible in page source
[ ] JSON validates at schema.org/validator

FAQ Page:
[ ] Page loads at /faq
[ ] All 15 FAQs visible
[ ] Accordion works
[ ] Mobile responsive

Blog:
[ ] 4 articles listed
[ ] Each article displays correctly
[ ] Formatting renders properly

GDPR Export:
[ ] Button visible in settings
[ ] Download works
[ ] JSON structure correct

Admin Analytics:
[ ] Metrics display
[ ] Charts render
[ ] Data accurate

Rate Limiting:
[ ] Limits enforced
[ ] Headers present
[ ] 429 status when exceeded
```

---

## ✅ Success Criteria

All tests pass if:
- ✅ Schema.org scripts visible in page source
- ✅ FAQ page loads with 15 items
- ✅ All 4 blog articles accessible
- ✅ GDPR export downloads JSON file
- ✅ Admin analytics shows metrics and charts
- ✅ Rate limiting returns 429 after limits

---

**Ready to test!** 🎉

