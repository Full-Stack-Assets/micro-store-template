# Deployment Guide: Vercel

This guide covers deploying the Micro Store Template to Vercel, the recommended platform for this Next.js application.

## Why Vercel?

Vercel is the optimal deployment platform for this template because:
- **Native Next.js support**: Built by the creators of Next.js
- **Zero configuration**: Works out-of-the-box with sensible defaults
- **Automatic CI/CD**: Deploy on every git push
- **Preview deployments**: Every pull request gets a unique preview URL
- **Edge network**: Global CDN for optimal performance
- **Easy environment variables**: Simple injection of `NEXT_PUBLIC_BRAND_DATA`

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier available)
2. This repository pushed to GitHub, GitLab, or Bitbucket
3. Your brand data JSON prepared for the `NEXT_PUBLIC_BRAND_DATA` environment variable

## Deployment Steps

### Option 1: Deploy via Vercel Dashboard (Recommended)

1. **Connect Repository**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Click "Import Project"
   - Select your Git provider and authenticate
   - Choose this repository

2. **Configure Project**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

3. **Set Environment Variable**
   - Click "Environment Variables"
   - Add variable:
     - **Name**: `NEXT_PUBLIC_BRAND_DATA`
     - **Value**: Your brand data JSON (see example below)
     - **Environment**: Production, Preview, Development (select all)

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete (~1-2 minutes)
   - Visit your deployment URL

### Option 2: Deploy via Vercel CLI

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Deploy**
   ```bash
   vercel
   ```

4. **Add Environment Variable**
   ```bash
   vercel env add NEXT_PUBLIC_BRAND_DATA
   ```
   Then paste your brand data JSON when prompted.

5. **Deploy to Production**
   ```bash
   vercel --prod
   ```

## Environment Variable Format

The `NEXT_PUBLIC_BRAND_DATA` should be a JSON string with the following structure:

```json
{
  "brandName": "Your Brand Name",
  "tagline": "Your brand tagline",
  "logoUrl": "https://example.com/logo.png",
  "heroImageUrl": "https://example.com/hero.jpg",
  "colorPalette": {
    "primary": "#3B82F6",
    "secondary": "#1E40AF"
  }
}
```

**Note**: When adding this to Vercel, paste the entire JSON as a single-line string or multi-line (Vercel accepts both).

## Custom Domain (Optional)

1. Go to your project in Vercel Dashboard
2. Navigate to "Settings" → "Domains"
3. Add your custom domain
4. Follow DNS configuration instructions
5. Vercel automatically provisions SSL certificate

## Automatic Deployments

Once connected:
- **Production**: Every push to `main` branch triggers a production deployment
- **Preview**: Every push to any branch or PR creates a preview deployment
- **Rollback**: Easy rollback to any previous deployment via dashboard

## Monitoring & Analytics

Vercel provides built-in:
- **Real-time logs**: View build and runtime logs
- **Analytics**: Page views and web vitals (requires Vercel Analytics)
- **Performance insights**: Core Web Vitals tracking

Access via: Project Dashboard → Analytics tab

## Troubleshooting

### Build Fails
- Check build logs in Vercel dashboard
- Ensure all dependencies are in `package.json`
- Verify Node.js version compatibility (currently using Next.js 15)

### Environment Variable Not Working
- Ensure variable name is exactly `NEXT_PUBLIC_BRAND_DATA`
- Verify it's added to the correct environment (Production/Preview)
- Redeploy after adding environment variables

### Images Not Loading
- Ensure image URLs are HTTPS
- Check `next.config.js` has correct domains in `images.domains` array
- Current allowed domain: `oaidalleapiprodscus.blob.core.windows.net`

## Cost Considerations

**Free Tier Includes:**
- Unlimited deployments
- 100GB bandwidth per month
- Automatic SSL
- Preview deployments
- Custom domains

**Paid Plans** offer:
- Higher bandwidth limits
- Team collaboration features
- Advanced analytics
- Password protection

For most micro-stores, the free tier is sufficient.

## Evolution Engine Integration

For automated deployment from the Evolution Engine:

1. **Use Vercel API** to create deployments programmatically
2. **Deploy Token**: Generate at vercel.com/account/tokens
3. **API Endpoint**: `POST https://api.vercel.com/v13/deployments`
4. **Inject Brand Data**: Set via environment variable in the API call

Example API call:
```bash
curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "micro-store-template",
    "gitSource": {
      "type": "github",
      "repo": "Full-Stack-Assets/micro-store-template",
      "ref": "main"
    },
    "env": {
      "NEXT_PUBLIC_BRAND_DATA": "{ your brand JSON }"
    }
  }'
```

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js on Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Environment Variables Guide](https://vercel.com/docs/environment-variables)
- [Custom Domains](https://vercel.com/docs/custom-domains)
