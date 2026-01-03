# Vercel Deployment Fix Guide

## Issue
```
No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies".
```

## Solution

### Option 1: Fix Root Directory in Vercel Dashboard (RECOMMENDED)

1. Go to your Vercel project dashboard
2. Click on **Settings**
3. Scroll to **Root Directory**
4. Make sure it's set to `./` (current directory) or leave it blank
5. Click **Save**
6. Trigger a new deployment

### Option 2: Set Root Directory via Git

If your repository structure has the Next.js app in a subdirectory, you need to specify it. Since your `package.json` is at the repository root, it should be `./` or blank.

### Option 3: Check Repository Structure

Your current structure should be:
```
mutual-funds-nav/          <- Repository root
├── package.json          <- This file has Next.js 16.1.1
├── next.config.ts
├── src/
│   └── app/
└── vercel.json
```

**✅ You have Next.js in dependencies** (line 25 of package.json: `"next": "16.1.1"`)

## Environment Variables

Make sure these are set in Vercel Dashboard → Settings → Environment Variables:

1. `DATABASE_URL` - Your PostgreSQL connection string
2. `NEXTAUTH_SECRET` - Random secret (generate with: `openssl rand -base64 32`)
3. `NEXTAUTH_URL` - Your production URL (e.g., `https://your-app.vercel.app`)

## Deployment Settings

In Vercel project settings, ensure:

- **Framework Preset**: Next.js
- **Build Command**: `bun run build` (or leave as default)
- **Install Command**: `bun install`
- **Output Directory**: `.next` (default)
- **Root Directory**: `./` or blank

## Common Issues

### 1. Multiple package.json files
If you have multiple `package.json` files in parent directories, Vercel might get confused.

**Check:**
```bash
cd /Users/archit/Desktop/mutual_funds-tracker
ls -la
```

If there's a `package.json` in the parent directory, that could be the issue.

### 2. Incorrect branch
Make sure you're deploying from the `main` branch (or whichever branch has your latest code).

### 3. Build fails locally
Test the build locally first:
```bash
bun run build
```

If this fails, fix the errors before deploying to Vercel.

## Quick Fix Steps

1. **In Vercel Dashboard:**
   - Settings → Root Directory → Leave blank or set to `./`
   - Settings → Build & Development Settings → Framework Preset → Next.js
   - Click Save

2. **Add Environment Variables:**
   - Settings → Environment Variables
   - Add: DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
   - Apply to Production, Preview, and Development

3. **Redeploy:**
   - Deployments → Click "..." → Redeploy
   - Or push a new commit to trigger deployment

## Still Having Issues?

If the issue persists, try creating a new Vercel project:

1. Delete the current Vercel project
2. Create new project in Vercel
3. Import repository: `testing-archit/mutual-funds-nav`
4. Configure:
   - Framework: Next.js (auto-detected)
   - Root Directory: (leave blank)
   - Add environment variables
5. Deploy

## Verify Locally

To ensure everything works before deploying:

```bash
# Clean build
rm -rf .next node_modules
bun install
bun run build
bun run start
```

Visit `http://localhost:3000` - if this works, Vercel deployment should work too.
