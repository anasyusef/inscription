/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    fontLoaders: [
      {
        loader: "@next/font/google",
        options: { subsets: ["latin"] },
      },
    ],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cowqtapcweplnajtasry.supabase.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
