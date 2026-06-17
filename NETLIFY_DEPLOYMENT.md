# Netlify Deployment

This project is ready to deploy on Netlify from GitHub.

## Netlify settings

Netlify will read `netlify.toml` automatically. If Netlify asks for settings manually, use:

- **Build command:** `bun run build`
- **Publish directory:** `dist`

## Required environment variables

Add these in Netlify under **Site configuration → Environment variables**:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`

Use the same values from your Lovable Cloud project environment.

## Custom domain

After the Netlify deploy works, add your custom domain in Netlify's domain settings and point your domain DNS to Netlify using the records Netlify gives you.