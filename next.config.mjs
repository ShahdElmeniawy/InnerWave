/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    domains: ['cdn-images.dzcdn.net', 'e-cdns-images.dzcdn.net', 'images.unsplash.com'],
  },
};

export default nextConfig;