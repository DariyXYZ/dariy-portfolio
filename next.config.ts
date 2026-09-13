import type { NextConfig } from "next";

/**
 * Сайт публикуется статикой в корне собственного домена на GitHub Pages.
 * Оптимизация картинок отключена:
 * на Pages нет сервера, который умеет их пересобирать.
 */
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
