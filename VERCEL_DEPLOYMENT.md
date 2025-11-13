# Vercel Deployment Guide

## Step 1: Install Vercel CLI (Optional)
```bash
npm i -g vercel
```

## Step 2: Deploy via Vercel Dashboard

### Option A: GitHub Integration (Recommended)
1. Push your code to GitHub (make sure `.env` is NOT committed)
2. Go to [vercel.com](https://vercel.com) and sign in
3. Click "Add New Project"
4. Import your GitHub repository
5. Configure the project:
   - **Framework Preset**: Vite
   - **Root Directory**: `ViyukthaAi` (if your repo root is one level up)
   - **Build Command**: `npm run build` (or `cd ViyukthaAi && npm run build`)
   - **Output Directory**: `dist`
   - **Install Command**: `npm install` (or `cd ViyukthaAi && npm install`)

### Option B: Vercel CLI
```bash
cd ViyukthaAi
vercel
```

## Step 3: Add Environment Variables in Vercel

**CRITICAL**: You must add all environment variables in Vercel Dashboard:

1. Go to your project in Vercel Dashboard
2. Click **Settings** GÂ∆ **Environment Variables**
3. Add the following variables:

### Required Environment Variables:

```
VITE_SUPABASE_PROJECT_ID=ybpnizylrmsilnmlzslz
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlicG5penlscm1zaWxubWx6c2x6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE4NjAzODYsImV4cCI6MjA3NzQzNjM4Nn0.Qxn5yYxytlJ5e4F46CGR5H0pTYfo8vrBj8rQRPn6n4g
VITE_SUPABASE_URL=https://ybpnizylrmsilnmlzslz.supabase.co
```

### Groq API Keys (Add ONE of these):

**Option 1: Multiple keys (comma-separated) - RECOMMENDED**
```
VITE_GROQ_API_KEYS=your_groq_api_key_here,your_groq_api_key_2,your_groq_api_key_3,your_groq_api_key_4
```

**Option 2: Single key**
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```

### Optional Environment Variables:

```
# Razorpay Payment Gateway (if using)
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id_here

# Developer Mode (set to 'true' to bypass payment in production)
VITE_DEVELOPER_MODE=false
```

### Important Notes:
- **Select Environment**: Make sure to add these variables for **Production**, **Preview**, and **Development** environments
- **No Quotes**: Don't add quotes around the values in Vercel (unlike `.env` file)
- **Redeploy**: After adding environment variables, Vercel will automatically redeploy, or you can manually trigger a redeploy

## Step 4: Verify Deployment

1. After deployment, visit your Vercel URL
2. Check the browser console for any errors
3. Test the application features that require API keys (AI Interview, Resume Analysis, etc.)

## Troubleshooting

### 404 NOT_FOUND Error (Most Common Issue)
**Problem**: Getting 404 errors when navigating to routes like `/jobs`, `/interview`, etc.

**Solution**:
1. **Check `vercel.json` exists** in your project root (`ViyukthaAi/vercel.json`)
2. **Verify the rewrites rule** is present:
   ```json
   {
     "rewrites": [
       {
         "source": "/(.*)",
         "destination": "/index.html"
       }
     ]
   }
   ```
3. **In Vercel Dashboard**:
   - Go to **Settings** GÂ∆ **General**
   - Scroll to **Build & Development Settings**
   - Make sure **Framework Preset** is set to **Vite** (or **Other**)
   - Verify **Output Directory** is set to `dist`
   - Verify **Build Command** is `npm run build`
4. **Redeploy** after making changes
5. **Clear browser cache** and try again

### Build Fails
- Check that all dependencies are in `package.json`
- Verify build command is correct
- Check build logs in Vercel Dashboard
- Make sure Node.js version is compatible (Vercel auto-detects, but you can set it in Settings)

### Environment Variables Not Working
- Make sure variable names start with `VITE_` (required for Vite)
- Verify variables are added for the correct environment (Production/Preview/Development)
- Redeploy after adding variables
- Check that values don't have extra quotes or spaces

### API Errors
- Verify API keys are correct in Vercel Environment Variables
- Check browser console for specific error messages
- Ensure Supabase URL and keys are correct
- Verify CORS settings if making external API calls

## Additional Configuration

If your repository root is not `ViyukthaAi`, you may need to create a `vercel.json` file:

```json
{
  "buildCommand": "cd ViyukthaAi && npm run build",
  "outputDirectory": "ViyukthaAi/dist",
  "installCommand": "cd ViyukthaAi && npm install"
}
```

Or if your repo root is `ViyukthaAi`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

