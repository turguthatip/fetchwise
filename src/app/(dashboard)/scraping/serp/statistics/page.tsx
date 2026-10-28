import type { Metadata } from "next";
import { NavTabs, SERP_TABS } from "@/components/nav-tabs";
import { StatisticsView } from "./statistics-view";

export const metadata: Metadata = {
  title: "SERP statistics",
  description: "Track daily SERP scraping requests, success rates and response times, and export usage as CSV or text.",
  alternates: { canonical: "/scraping/serp/statistics" },
};

export default function SerpStatisticsPage() {
  return (
    <>
      <NavTabs tabs={SERP_TABS} label="SERP Scraping API" />
      <StatisticsView />
    </>
  );
}
