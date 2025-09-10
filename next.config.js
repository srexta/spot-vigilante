/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com', 'images.unsplash.com'],
  },
  // Optimize for Vercel deployment
  output: 'standalone',
  // Enable static optimization where possible
  trailingSlash: false,
}

module.exports = nextConfig