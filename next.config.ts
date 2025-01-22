/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb'
    }
  },
  images: {
    domains: ["dame-au-chignon-bucket.s3.amazonaws.com"],
  },
}

module.exports = nextConfig

