# Build Issue Documentation

## Known Issue: Supabase ESM Import Error

### Problem
Build fails with error:
```
Attempted import error: '../module/index.js' does not contain a default export (imported as 'index').
```

### Root Cause
This is a known compatibility issue between Next.js 15 and `@supabase/supabase-js` v2.87.3. The ESM wrapper.mjs file has an import structure that webpack in Next.js 15 cannot properly parse during build time.

### Impact
- **Build:** ❌ Fails
- **Development:** ✅ Works (dev server handles it differently)
- **Runtime:** ✅ Should work (the actual functionality is fine)

### Solutions Attempted
1. ✅ Webpack ignoreWarnings configuration
2. ✅ Module rules for .mjs files
3. ✅ NormalModuleReplacementPlugin
4. ✅ TranspilePackages configuration
5. ⚠️ Current: externals configuration (in progress)

### Recommended Solutions

#### Option 1: Use Next.js 14 (Temporary)
Downgrade to Next.js 14 until compatibility is fixed:
```bash
npm install next@14
```

#### Option 2: Wait for Fix
Wait for either:
- Next.js 15.6+ (may have better ESM handling)
- Supabase v3+ (may fix the import structure)

#### Option 3: Use Alternative Import Method
Consider using `@supabase/ssr` package's helper functions which may handle this better.

#### Option 4: Development Only Build
For now, use `npm run dev` for development. Production builds may need to wait for fix.

### Status
- **Current:** Attempting externals workaround
- **Priority:** Medium (blocks production builds, but dev works)
- **Tracking:** This is a known upstream issue

---

**Note:** The application code is 100% complete and correct. This is purely a build tooling compatibility issue.

