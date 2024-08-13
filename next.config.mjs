/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    styleTimes: {
      dynamic: 30,
    },
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
