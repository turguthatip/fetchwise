"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "./ui";

export type Tab = { label: string; href?: string };

const tabClass = "relative flex h-10 shrink-0 items-center justify-center px-4 py-1.5 font-poppins text-[14px] font-medium leading-[28px] whitespace-nowrap";

export function NavTabs({ tabs, label, inset }: { tabs: Tab[]; label: string; inset?: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className={cx("no-scrollbar flex gap-2 overflow-x-auto border-b border-n20 sm:gap-8", inset && "px-6")}>
      {tabs.map((tab) => {
        const active = tab.href === pathname;
        if (!tab.href) {
          return (
            <span key={tab.label} className={cx(tabClass, "cursor-default text-neutral")} title="Not part of this demo">
              {tab.label}
            </span>
          );
        }
        return (
          <Link
            key={tab.label}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={cx(tabClass, active ? "text-primary" : "text-neutral hover:text-primary")}
          >
            {tab.label}
            {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
          </Link>
        );
      })}
    </nav>
  );
}

export const SERP_TABS: Tab[] = [
  { label: "Scraper", href: "/scraping/serp" },
  { label: "Collection Management", href: "/scraping/serp/collections" },
  { label: "Statistics", href: "/scraping/serp/statistics" },
  { label: "API Authentication" },
  { label: "Pricing" },
  { label: "Get started" },
];
