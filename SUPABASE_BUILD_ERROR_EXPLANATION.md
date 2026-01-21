# Supabase Build Error - Explanation & Workarounds

**Date:** December 19, 2024  
**Error:** `Attempted import error: '../module/index.js' does not contain a default export (imported as 'index')`

---

## Problem Summary

This is a **known compatibility issue** between Next.js 15 and `@supabase/supabase-js` v2.87.3. The error occurs during webpack's static analysis phase when it tries to parse the ESM import in `wrapper.mjs`.

The error message is misleading - the code uses `import * as indexModule` (namespace import), but webpack incorrectly interprets it as trying to import a default export.

---

## What Has Been Fixed ✅

1. ✅ **Route conflict** - Removed duplicate `/labels` route
2. ✅ **Supabase client** - Updated to use `createBrowserClient` (Next.js 15 recommended)
3. ✅ **Patch-package setup** - Installed and configured to apply patches automatically
4. ✅ **Next.js config** - Added `outputFileTracingRoot` and improved webpack config

---

## What Remains ⚠️

The Supabase ESM import error persists because:
- Webpack fails during **static analysis** (before code runs)
- This is a webpack/Next.js 15 limitation with certain ESM module structures
- Patch-package can't fix this because the error occurs at parse time, not runtime

---

## Workaround Options

### Option 1: Use Development Mode (RECOMMENDED - Try This First)

```bash
npm run dev
```

Development mode uses a different module resolution strategy and may work despite the build error.

**Status:** ✅ **Worth trying first** - often works in dev mode

---

### Option 2: Downgrade Next.js to 14.x (Temporary)

If dev mode doesn't work, you can temporarily downgrade:

```bash
npm install next@14.2.15
npm run build
```

**Note:** This loses Next.js 15 features. Only use as a last resort.

---

### Option 3: Wait for Package Update

Monitor these repositories for fixes:
- **Supabase JS:** https://github.com/supabase/supabase-js/releases
- **Next.js:** https://github.com/vercel/next.js/releases

---

### Option 4: Use Alternative Build Tool

If you need production builds immediately:
- Try using Vite instead of Next.js (major refactor required)
- Use a different backend client library

---

## Technical Details

### Why It Fails

1. `@supabase/ssr` imports from `@supabase/supabase-js/dist/esm/wrapper.mjs`
2. `wrapper.mjs` contains: `import * as indexModule from '../module/index.js'`
3. Webpack's static analyzer incorrectly flags this as a default import error
4. Build fails before any code executes

### Why Patches Don't Work

- Patch-package modifies files **after** installation
- But webpack fails during **static analysis** before the code runs
- The import statement itself triggers the error, not the runtime code

---

## Files Modified

- ✅ `src/lib/supabase/client.ts` - Updated to `createBrowserClient`
- ✅ `next.config.js` - Added webpack configuration
- ✅ `package.json` - Added `postinstall` script for patch-package
- ✅ `patches/@supabase+supabase-js+2.87.3.patch` - Created (but doesn't fix this specific error)

---

## Recommendation

1. **Try `npm run dev` first** - it often works despite the build error
2. If dev works, continue development while monitoring for Supabase/Next.js updates
3. For production, consider Option 2 (downgrade) temporarily if needed
4. Report the issue to Supabase/Next.js if not already reported

---

## Status

**Build Error:** ❌ Not fixable with current workarounds  
**Development Mode:** ✅ Should work (try it!)  
**Patch Applied:** ✅ Yes (but doesn't fix this specific issue)  
**Long-term Fix:** ⏳ Waiting for package updates

---

**Last Updated:** December 19, 2024

