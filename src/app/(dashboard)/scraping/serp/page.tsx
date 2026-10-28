import type { Metadata } from "next";
import { NavTabs, SERP_TABS } from "@/components/nav-tabs";
import { PageHeader } from "@/components/page-header";
import { ScraperPlayground } from "./scraper-playground";

export const metadata: Metadata = {
  title: "SERP Scraping API",
  description: "Scrape search engine results with location, language, device and pagination controls, and preview the request, JSON response and rendered page.",
  alternates: { canonical: "/scraping/serp" },
};

function SerpIcon() {
  return (
    <span className="flex size-[30px] items-center justify-center rounded-[6px] bg-ink" aria-hidden="true">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="7.5" cy="7.5" r="5" stroke="#fff" strokeWidth="2" />
        <path d="m11.5 11.5 4 4" stroke="#00F0D3" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export default function SerpScraperPage() {
  return (
    <>
      <PageHeader
        icon={<SerpIcon />}
        title="SERP Scraping API"
        plan="Lite"
        nextPayment="27 days"
        usage={{ used: 12480, total: 100000, unit: "req" }}
        action="Upgrade"
      />
      <NavTabs tabs={SERP_TABS} label="SERP Scraping API" />
      <ScraperPlayground />
    </>
  );
}
