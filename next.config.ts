/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb'
    }
  },
  images: {
    domains: ['your-s3-bucket-domain.amazonaws.com'],
  },
}

module.exports = nextConfig

