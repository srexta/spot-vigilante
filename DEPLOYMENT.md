# Spot Vigilante - Vercel Deployment Guide

## Prerequisites
- GitHub account
- Vercel account (free tier available)
- Supabase account (for PostgreSQL database)
- Cloudinary account (for image storage)

## Step 1: Prepare Your Code

### 1.1 Commit Your Code
```bash
git add .
git commit -m "Initial commit: Spot Vigilante application ready for deployment"
```

### 1.2 Create GitHub Repository
1. Go to [GitHub](https://github.com) and create a new repository
2. Name it: `spot-vigilante` (or your preferred name)
3. Make it **Public** (required for free Vercel deployment)
4. Don't initialize with README (we already have files)

### 1.3 Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/spot-vigilante.git
git branch -M main
git push -u origin main
```

## Step 2: Set Up Supabase Database

### 2.1 Create Supabase Project
1. Go to [Supabase](https://supabase.com)
2. Create a new project
3. Note down your database URL from Settings > Database

### 2.2 Run Database Migration
```bash
# Update your .env with Supabase database URL
npx prisma db push
```

## Step 3: Deploy to Vercel

### 3.1 Connect to Vercel
1. Go to [Vercel](https://vercel.com)
2. Sign in with your GitHub account
3. Click "New Project"
4. Import your `spot-vigilante` repository
5. Vercel will auto-detect it's a Next.js project

### 3.2 Configure Environment Variables
In Vercel dashboard, go to your project > Settings > Environment Variables and add:

```
DATABASE_URL=postgresql://postgres:[YOUR_PASSWORD]@db.[YOUR_PROJECT_REF].supabase.co:5432/postgres
JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production-12345
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
NEXT_PUBLIC_ADMIN_LOGIN=spotvigilante2024admin
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
```

### 3.3 Deploy
1. Click "Deploy" in Vercel
2. Wait for deployment to complete (usually 2-3 minutes)
3. Your app will be available at: `https://your-app-name.vercel.app`

## Step 4: Post-Deployment Setup

### 4.1 Test Your Application
1. **Public Pages**:
   - Visit: `https://your-app-name.vercel.app` (Submit form)
   - Visit: `https://your-app-name.vercel.app/spots` (View submissions)

2. **Admin Dashboard**:
   - Visit: `https://your-app-name.vercel.app/findspotvigilanteadminusage`
   - Password: `spotvigilante2024admin`

### 4.2 Update App URL
After deployment, update the `NEXT_PUBLIC_APP_URL` environment variable in Vercel with your actual Vercel URL.

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain
1. In Vercel dashboard, go to your project > Settings > Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Supabase PostgreSQL connection string | `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-jwt-key-here` |
| `CLOUDINARY_CLOUD_NAME` | Your Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Your Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Your Cloudinary API secret | `your_api_secret` |
| `NEXT_PUBLIC_ADMIN_LOGIN` | Admin dashboard password | `spotvigilante2024admin` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel app URL | `https://your-app.vercel.app` |

## Troubleshooting

### Common Issues:

1. **Database Connection Error**:
   - Check DATABASE_URL format
   - Ensure Supabase project is active
   - Run `npx prisma db push` locally first

2. **Image Upload Issues**:
   - Verify Cloudinary credentials
   - Check CLOUDINARY_* environment variables

3. **Admin Access Issues**:
   - Verify NEXT_PUBLIC_ADMIN_LOGIN is set
   - Check admin URL: `/findspotvigilanteadminusage`

4. **Build Errors**:
   - Check Vercel build logs
   - Ensure all dependencies are in package.json
   - Verify TypeScript compilation

## Security Notes

- Change the default admin password in production
- Use strong JWT secrets
- Keep environment variables secure
- Consider adding rate limiting for production use

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify all environment variables are set
3. Test locally first with production environment variables
4. Check Supabase and Cloudinary service status

---

**Your Spot Vigilante application is now ready for production deployment!** 🚀