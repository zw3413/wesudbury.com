/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: process.env.GOOGLE_MAPS_API_KEY,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://maps.googleapis.com;`,
          },
        ],
      },
    ]
  },
  images: {
    domains: ['localhost', 'wesudbury.com'], // Add your production domain here
  },
}

module.exports = nextConfig

