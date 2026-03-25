import { withSentryConfig } from "@sentry/nextjs";

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "**" },
      { protocol: "https", hostname: "i.pinimg.com", pathname: "**" },
      { protocol: "https", hostname: "foresthistory.org", pathname: "**" },
      {
        protocol: "https",
        hostname: "www.thegreatoutdoorsmag.com",
        pathname: "**",
      },
      { protocol: "https", hostname: "alpkit.com", pathname: "**" },
      { protocol: "https", hostname: "assets.icebreaker.com", pathname: "**" },
      { protocol: "https", hostname: "images.ctfassets.net", pathname: "**" },
      {
        protocol: "https",
        hostname: "www.plasticsoupfoundation.org",
        pathname: "**",
      },
      { protocol: "https", hostname: "cdn11.bigcommerce.com", pathname: "**" },
      { protocol: "https", hostname: "marmotau.com", pathname: "**" },
      { protocol: "https", hostname: "cdn2.apstatic.com", pathname: "**" },
      {
        protocol: "https",
        hostname: "s3.us-east-1.amazonaws.com",
        pathname: "**",
      },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "**" },
    ],
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/beas-kund-trek",
        destination: "/treks/beas-kund-trek",
        permanent: true,
      },
      {
        source: "/bhrigu-lake-trek",
        destination: "/treks/bhrigu-lake-trek",
        permanent: true,
      },
      {
        source: "/ranisui-lake-trek",
        destination: "/treks/ranisui-lake-trek",
        permanent: true,
      },
    ];
  },
};

const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  widenClientFileUpload: true,
  hideSourceMaps: true,
};

export default withSentryConfig(nextConfig, sentryWebpackPluginOptions);
