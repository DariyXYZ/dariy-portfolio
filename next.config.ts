import type { NextConfig } from "next";

/**
 * Сайт публикуется статикой на GitHub Pages в подпапке репозитория,
 * поэтому нужен basePath и отключённая оптимизация картинок:
 * на Pages нет сервера, который умеет их пересобирать.
 */
const nextConfig: NextConfig = {
  output: "export",
  basePath: "/dariy-portfolio",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
