import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/manage/",
    },
    sitemap: "https://flashie.app/sitemap.xml",
  };
}
