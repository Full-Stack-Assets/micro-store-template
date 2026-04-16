# Micro Store Template

This is an auto-generated Next.js store template for the **Evolution Engine**.

## Features

- ⚡ Built with Next.js 15 and React 19
- 🎨 Tailwind CSS for styling
- 🚀 Optimized for Vercel deployment
- 🔧 TypeScript support
- 📱 Responsive design
- 🎯 Dynamic brand data injection

## Usage

The Evolution Engine deploys this template to Vercel and injects brand data via the `NEXT_PUBLIC_BRAND_DATA` environment variable.

## Deployment

This template is optimized for deployment on **Vercel**, the recommended platform for Next.js applications.

**Quick Deploy:**
1. Push this repository to GitHub
2. Import to Vercel at [vercel.com/new](https://vercel.com/new)
3. Add `NEXT_PUBLIC_BRAND_DATA` environment variable
4. Deploy!

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Environment Variables

- `NEXT_PUBLIC_BRAND_DATA`: JSON string containing brand information (name, tagline, colors, images)

Example:
```json
{
  "brandName": "My Store",
  "tagline": "Shop the best products",
  "logoUrl": "https://example.com/logo.png",
  "heroImageUrl": "https://example.com/hero.jpg",
  "colorPalette": {
    "primary": "#3B82F6",
    "secondary": "#1E40AF"
  }
}
```

## Tech Stack

- **Framework**: Next.js 15
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Deployment**: Vercel
