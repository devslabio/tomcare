# Deploying TOMCARE Foundation to Vercel

This guide will walk you through deploying your Next.js application to Vercel.

## Prerequisites

1. A GitHub account (your code should be pushed to GitHub)
2. A Vercel account (free tier is sufficient)
3. Your EmailJS environment variables ready

## Method 1: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push to GitHub

Make sure your code is pushed to GitHub:

```bash
git add .
git commit -m "Ready for deployment"
git push origin development
```

### Step 2: Import Project to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (or create an account)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Select the repository: `devslabio/tomcare` (or your repo name)
5. Vercel will auto-detect Next.js settings

### Step 3: Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as default)

**Build Command:** `pnpm build` (or `npm run build` if using npm)

**Output Directory:** `.next` (auto-detected)

**Install Command:** `pnpm install` (or `npm install`)

### Step 4: Add Environment Variables

In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

```
NEXT_PUBLIC_EMAILJS_SERVICE_ID=your_service_id
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=your_public_key
NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT=your_contact_template_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTER=your_register_template_id
NEXT_PUBLIC_EMAILJS_TEMPLATE_VOLUNTEER=your_volunteer_template_id
```

**Important:**
- Add these for **Production**, **Preview**, and **Development** environments
- Never commit `.env.local` to Git (it's already in `.gitignore`)

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait for the build to complete (usually 2-3 minutes)
3. Your site will be live at: `https://your-project-name.vercel.app`

### Step 6: Configure Custom Domain (Optional)

1. Go to **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions

## Method 2: Deploy via Vercel CLI

### Step 1: Install Vercel CLI

```bash
npm i -g vercel
# or
pnpm add -g vercel
```

### Step 2: Login to Vercel

```bash
vercel login
```

### Step 3: Deploy

From your project root:

```bash
vercel
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? (Select your account)
- Link to existing project? **No** (for first deployment)
- Project name? (Press Enter for default or enter custom name)
- Directory? (Press Enter for `./`)
- Override settings? **No**

### Step 4: Add Environment Variables

```bash
vercel env add NEXT_PUBLIC_EMAILJS_SERVICE_ID
vercel env add NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT
vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTER
vercel env add NEXT_PUBLIC_EMAILJS_TEMPLATE_VOLUNTEER
```

For each variable, select:
- **Environment:** Production, Preview, Development (select all)

### Step 5: Deploy to Production

```bash
vercel --prod
```

## Post-Deployment Checklist

- [ ] Test contact form submission
- [ ] Test volunteer application form
- [ ] Test registration form
- [ ] Verify EmailJS integration works
- [ ] Check all pages load correctly
- [ ] Test mobile responsiveness
- [ ] Verify images load properly
- [ ] Check analytics (if configured)

## Troubleshooting

### Build Fails

1. **Check build logs** in Vercel dashboard
2. **Common issues:**
   - Missing environment variables
   - TypeScript errors
   - Missing dependencies

### Forms Not Working

1. **Verify environment variables** are set correctly
2. **Check EmailJS template IDs** match your dashboard
3. **Test EmailJS service** is active and has quota

### Images Not Loading

1. **Check image paths** are correct
2. **Verify images** are in `/public` folder
3. **Use Next.js Image component** for optimization

### 404 Errors

1. **Check routing** - Next.js uses file-based routing
2. **Verify page files** exist in `/app` directory
3. **Check for typos** in routes

## Continuous Deployment

Vercel automatically deploys when you push to:
- **Production:** `main` or `master` branch
- **Preview:** Any other branch (including `development`)

To change this:
1. Go to **Settings** → **Git**
2. Configure **Production Branch** (default: `main` or `master`)

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS Service ID | Yes |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS Public Key | Yes |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_CONTACT` | Contact form template ID | Yes |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_REGISTER` | Registration form template ID | Yes |
| `NEXT_PUBLIC_EMAILJS_TEMPLATE_VOLUNTEER` | Volunteer form template ID | Yes |

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment Guide](https://nextjs.org/docs/deployment)
- [EmailJS Setup Guide](./QUICK_EMAILJS_SETUP.md)

## Support

If you encounter issues:
1. Check Vercel build logs
2. Review EmailJS dashboard for errors
3. Check browser console for client-side errors
4. Verify all environment variables are set correctly

