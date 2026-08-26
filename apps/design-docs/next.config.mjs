/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,
  transpilePackages: [
    "@kimgseok/design-button",
    "@kimgseok/design-examples",
    "@kimgseok/design-feedback",
    "@kimgseok/design-forms",
    "@kimgseok/design-icons",
    "@kimgseok/design-navigation",
    "@kimgseok/design-overlays",
    "@kimgseok/design-primitives",
    "@kimgseok/design-tokens",
  ],
};

export default nextConfig;
