const isProd = process.env.NODE_ENV === 'production';
const isVercel = Boolean(process.env.VERCEL);

// Vercel serves at root domain (''), while GitHub Pages CI sets NEXT_PUBLIC_BASE_PATH='/MIPS'
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isVercel ? '' : isProd ? '/MIPS' : '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: basePath,
  assetPrefix: basePath ? `${basePath}/` : undefined,
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

export default nextConfig;
