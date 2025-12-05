# Netlify Deployment Guide

## Quick Deploy

1. **Connect Repository to Netlify**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub repository: `ArivunidhiA/HIGH-PERFORMANCE-AD-BIDDING-ENGINE`

2. **Configure Build Settings**
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/dist`
   - Node version: `18` (set in Netlify dashboard)

3. **Set Environment Variables** (Optional - for API connections)
   - Go to Site settings > Build & deploy > Environment variables
   - Add if you have a backend API:
     - `VITE_API_URL` = `/api/v1` (or your API URL)
     - `VITE_WS_URL` = `wss://your-api-gateway.com` (or your WebSocket URL)

4. **Deploy**
   - Click "Deploy site"
   - Netlify will automatically build and deploy your frontend

## Configuration Files

- `netlify.toml` - Already configured with:
  - Build command and publish directory
  - SPA routing (all routes redirect to index.html)
  - API proxy configuration (update with your API URL)

## Notes

- The frontend is a standalone React SPA that works without a backend
- If you deploy the API gateway separately, update the redirects in `netlify.toml`
- WebSocket connections require a separate WebSocket server (not included in Netlify static hosting)
- All pages are client-side rendered and work independently

## Troubleshooting

- **Build fails**: Check Node version is set to 18 in Netlify settings
- **Routes not working**: Ensure the SPA redirect rule is in `netlify.toml`
- **API calls fail**: Update `VITE_API_URL` environment variable or configure API proxy in `netlify.toml`

