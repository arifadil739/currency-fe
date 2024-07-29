/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    BASE_URL: 'https://currency-be.vercel.app/'
    // BASE_URL: 'http://localhost:3002'
  }
};

export default nextConfig;
