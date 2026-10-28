/**
 * Public origin used for canonical URLs, the sitemap and share images.
 * Set NEXT_PUBLIC_SITE_URL once the site has its own domain; on Vercel the
 * production domain is picked up automatically.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000");

export const SITE_NAME = "fetchwise";
export const SITE_DESCRIPTION =
  "fetchwise is a web scraping dashboard: run SERP scraping jobs, schedule collections, track usage statistics and unblock sites from one place.";

export const PAGES = [
  { path: "/scraping/serp", priority: 1 },
  { path: "/scraping/serp/collections", priority: 0.8 },
  { path: "/scraping/serp/statistics", priority: 0.8 },
  { path: "/site-unblocker", priority: 0.9 },
] as const;
