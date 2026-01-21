# LabelPro Production Deployment Guide

## ⚠️ CRITICAL: Before Deployment

### 1. Rotate ALL Credentials
Your current credentials in `.env.local` are exposed. You MUST:
- Generate new Supabase project keys
- Create new Google OAuth credentials
- Generate new database password
- Create new Sentry project

### 2. Environment Setup

1. Copy `.env.local.example` to `.env.local`
2. Fill in ALL required values with NEW credentials
3. Verify `.env.local` is in `.gitignore`
4. NEVER commit `.env.local` to git

## Database Setup

### Step 1: Create Supabase Project
1. Go to https://supabase.com
2. Create new project
3. Wait for database to provision

### Step 2: Run Schema Migration
1. Open Supabase SQL Editor
2. Copy contents of `scripts/database-schema-production.sql`
3. Execute the SQL
4. Verify all tables created

### Step 3: Configure Storage
```sql
-- Create storage bucket for PDFs
INSERT INTO storage.buckets (id, name, public) 
VALUES ('label-pdfs', 'label-pdfs', false);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('label-images', 'label-images', true);

-- Storage policies
CREATE POLICY "Users can upload own PDFs"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'label-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can read own PDFs"
ON storage.objects FOR SELECT
USING (bucket_id = 'label-pdfs' AND auth.uid()::text = (storage.foldername(name))[1]);
```

## Vercel Deployment

### Step 1: Install Vercel CLI
```bash
npm i -g vercel
```

### Step 2: Link Project
```bash
vercel link
```

### Step 3: Set Environment Variables
```bash
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add NEXT_PUBLIC_APP_URL
vercel env add GOOGLE_CLIENT_ID
vercel env add GOOGLE_CLIENT_SECRET
```

### Step 4: Deploy
```bash
vercel --prod
```

## Post-Deployment Checklist

### Security
- [ ] All credentials rotated
- [ ] .env.local not in git
- [ ] Rate limiting enabled
- [ ] CORS configured
- [ ] HTTPS enforced

### Database
- [ ] Schema deployed
- [ ] RLS policies active
- [ ] Indexes created
- [ ] Backup configured

### Features
- [ ] Email verification working
- [ ] Authentication working
- [ ] PDF generation working
- [ ] File upload working
- [ ] Batch processing working

### Monitoring
- [ ] Sentry configured
- [ ] Error tracking active
- [ ] Performance monitoring
- [ ] Uptime monitoring

### Testing
- [ ] All pages load
- [ ] Auth flow works
- [ ] Label creation works
- [ ] Batch processing works
- [ ] Mobile responsive

## Required Services

### 1. Supabase (Database & Auth)
- Plan: Free tier OK for MVP
- Upgrade to Pro ($25/mo) when you hit limits

### 2. Vercel (Hosting)
- Plan: Pro ($20/mo) required for production
- Free tier has limits that won't work

### 3. Email Service (Choose one)
- Resend: $20/mo for 50k emails
- SendGrid: Free tier 100 emails/day

### 4. Sentry (Error Tracking)
- Plan: Free tier OK for MVP
- 5k errors/month included

## Cost Estimate

### Minimum Monthly Cost
- Vercel Pro: $20
- Supabase: $0 (free tier)
- Email: $0-20
- Sentry: $0 (free tier)
**Total: $20-40/month**

### At Scale (1000 users)
- Vercel Pro: $20
- Supabase Pro: $25
- Email: $20
- Sentry: $26
**Total: $91/month**

## Troubleshooting

### Build Fails
- Check all env vars are set
- Verify Node version (18+)
- Clear `.next` folder

### Database Connection Fails
- Verify Supabase URL correct
- Check RLS policies
- Verify user has permissions

### Email Not Sending
- Check email service configured
- Verify API keys
- Check spam folder

## Support

For issues:
1. Check Vercel logs
2. Check Supabase logs
3. Check Sentry errors
4. Review this guide

## Next Steps After Deployment

1. Set up custom domain
2. Configure email templates
3. Add payment integration (Stripe)
4. Set up monitoring alerts
5. Create backup strategy
6. Load test the application
7. Security audit
8. Performance optimization
