/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  transpilePackages: [
    "@kimgseok/design-button",
    "@kimgseok/design-feedback",
    "@kimgseok/design-icons",
    "@kimgseok/design-primitives",
    "@kimgseok/design-tokens",
  ],
};

export default nextConfig;
