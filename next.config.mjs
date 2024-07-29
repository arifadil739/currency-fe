/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: 'http://192.168.31.40:3001'
    // BASE_URL: 'http://localhost:3001'
  }
};

export default nextConfig;
