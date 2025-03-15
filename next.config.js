/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    unoptimized: true,
  },
  // This will help with localStorage issues during server-side rendering
  experimental: {
    appDir: true,
  },
}

module.exports = nextConfig
