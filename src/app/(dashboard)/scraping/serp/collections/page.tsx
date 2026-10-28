import type { Metadata } from "next";
import { NavTabs, SERP_TABS } from "@/components/nav-tabs";
import { CollectionsView } from "./collections-view";

export const metadata: Metadata = { title: "SERP collections" };

export default function SerpCollectionsPage() {
  return (
    <>
      <NavTabs tabs={SERP_TABS} label="SERP Scraping API" />
      <CollectionsView />
    </>
  );
}
