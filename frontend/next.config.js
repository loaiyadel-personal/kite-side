/** @type {import('next').NextConfig} */

const apiOrigin = (() => {
  const url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'
  try { return new URL(url).origin } catch { return 'http://localhost:4000' }
})()

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=()',
  },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      // Next.js requires unsafe-inline for hydration scripts in production
      "script-src 'self' 'unsafe-inline'",
      // Tailwind requires unsafe-inline for utility styles
      "style-src 'self' 'unsafe-inline'",
      // API calls (via rewrite proxy = self, plus direct admin calls to API origin)
      `connect-src 'self' ${apiOrigin} https://api.open-meteo.com`,
      // Uploaded images from the backend origin + placeholder images
      `img-src 'self' data: blob: ${apiOrigin} https://api.kiteside.com https://picsum.photos`,
      // Google Maps iframe embed
      "frame-src https://maps.google.com https://www.google.com",
      "font-src 'self'",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; '),
  },
]

const nextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
      },
      {
        protocol: 'https',
        hostname: 'api.kiteside.com',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  async headers() {
    // Skip security headers in development — CSP blocks webpack eval/HMR
    if (process.env.NODE_ENV !== 'production') return []
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ]
  },
  async rewrites() {
    const backendBase = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api').replace(/\/api$/, '')
    return [
      {
        source: '/api/:path*',
        destination: `${backendBase}/api/:path*`,
      },
      {
        source: '/uploads/:path*',
        destination: `${backendBase}/uploads/:path*`,
      },
    ]
  },
}

module.exports = nextConfig
