import type { Metadata } from "next";
import { NavTabs, SERP_TABS } from "@/components/nav-tabs";
import { StatisticsView } from "./statistics-view";

export const metadata: Metadata = { title: "SERP statistics" };

export default function SerpStatisticsPage() {
  return (
    <>
      <NavTabs tabs={SERP_TABS} label="SERP Scraping API" />
      <StatisticsView />
    </>
  );
}
