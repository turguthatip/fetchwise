"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Logo } from "./logo";
import { Icon, cx } from "./ui";

type Item = {
  label: string;
  icon: string;
  href?: string;
  isNew?: boolean;
  subscribed?: boolean;
  hasChildren?: boolean;
};

const PRODUCTS: Item[] = [
  { label: "Residential Proxies", icon: "menu-residential", isNew: true, hasChildren: true },
  { label: "ISP Proxies", icon: "menu-isp", isNew: true, subscribed: true, hasChildren: true },
  { label: "Datacenter Proxies", icon: "menu-datacenter", hasChildren: true },
  { label: "Site Unblocker", icon: "menu-unblocker", href: "/site-unblocker", subscribed: true },
];

const SCRAPING = [
  { label: "SERP", href: "/scraping/serp" },
  { label: "eCommerce" },
  { label: "Web" },
  { label: "Social media" },
  { label: "No code scraper" },
];

const ACCOUNT: Item[] = [
  { label: "Billing", icon: "menu-billing" },
  { label: "Settings", icon: "menu-settings", hasChildren: true },
  { label: "Help & Support", icon: "menu-help", hasChildren: true },
];

function ItemIcon({ name }: { name: string }) {
  // Residential and ISP icons are exported at 16px; the rest at 19.137px.
  if (name === "menu-residential") {
    return (
      <span className="flex size-4 items-center justify-center">
        <Icon name={name} width={12.833} height={14} />
      </span>
    );
  }
  if (name === "menu-isp") return <Icon name={name} size={16} />;
  return <Icon name={name} size={19.137} />;
}

function SubscribedMarker() {
  return <span className="absolute top-3 -left-3 h-4 w-1 rounded-r-[4px] bg-info" aria-hidden="true" />;
}

function NewFlag() {
  return (
    <span className="rounded-[20px] border border-brand px-2 py-0.5 font-poppins text-[8px] font-semibold leading-none tracking-[0.8px] text-brand uppercase">
      New
    </span>
  );
}

function Row({ item, active }: { item: Item; active?: boolean }) {
  const content: ReactNode = (
    <>
      <ItemIcon name={item.icon} />
      <span className="flex items-center gap-1">
        <span className={cx("font-poppins text-[14px] text-white", !active && "opacity-70")}>{item.label}</span>
        {item.isNew && <NewFlag />}
      </span>
      {item.subscribed && <SubscribedMarker />}
      {item.hasChildren && <Icon name="menu-dropdown" width={16} height={21} className="absolute top-3 right-3 opacity-70" />}
    </>
  );
  const className = cx(
    "relative flex w-full items-center gap-2 rounded-[4px] p-3 text-left transition-colors",
    active ? "bg-white/[0.06]" : "hover:bg-white/[0.04]",
  );
  if (item.href) {
    return (
      <Link href={item.href} className={className} aria-current={active ? "page" : undefined}>
        {content}
      </Link>
    );
  }
  return (
    <div className={cx(className, "cursor-default")} title="Not part of this demo">
      {content}
    </div>
  );
}

function Nav({ pathname }: { pathname: string }) {
  const onScraping = pathname.startsWith("/scraping");
  const [scrapingOpen, setScrapingOpen] = useState(onScraping);
  return (
    <nav aria-label="Main" className="flex flex-col gap-6">
      <Row item={{ label: "Dashboard", icon: "menu-dashboard" }} />
      <div className="flex flex-col gap-1">
        {PRODUCTS.map((item) => (
          <Row key={item.label} item={item} active={Boolean(item.href && pathname.startsWith(item.href))} />
        ))}
        <div className={cx("relative flex flex-col gap-3 rounded-[4px] p-3", (scrapingOpen || onScraping) && "bg-white/[0.04]")}>
          <button
            type="button"
            aria-expanded={scrapingOpen}
            onClick={() => setScrapingOpen((open) => !open)}
            className="relative flex w-full cursor-pointer items-center gap-2 text-left"
          >
            <ItemIcon name="menu-scraping" />
            <span className={cx("font-poppins text-[14px] text-white", !onScraping && "opacity-70")}>Scraping</span>
            <Icon name="menu-dropdown-open" width={16} height={21} className={cx("absolute top-0 right-0", scrapingOpen && "rotate-180")} />
          </button>
          <SubscribedMarker />
          {scrapingOpen && (
            <>
              <span className="h-px w-full bg-white/10" aria-hidden="true" />
              {SCRAPING.map((child) => {
                const active = Boolean(child.href && pathname.startsWith(child.href));
                const label = (
                  <span className={cx("font-poppins text-[14px] font-light text-white", !active && "opacity-50")}>{child.label}</span>
                );
                return child.href ? (
                  <Link key={child.label} href={child.href} aria-current={active ? "page" : undefined} className="relative flex items-center gap-2 pl-6 hover:opacity-100">
                    {active && <Icon name="menu-status" className="absolute top-[2.5px] left-0" />}
                    {label}
                  </Link>
                ) : (
                  <span key={child.label} title="Not part of this demo" className="relative flex items-center gap-2 pl-6">
                    {label}
                  </span>
                );
              })}
            </>
          )}
        </div>
        <Row item={{ label: "Tools", icon: "menu-tools" }} />
      </div>
      <div className="flex flex-col">
        {ACCOUNT.map((item) => (
          <Row key={item.label} item={item} />
        ))}
      </div>
    </nav>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  return (
    <>
      {/* Desktop */}
      <aside className="scroll-dark fixed inset-y-0 left-0 z-20 hidden w-[280px] overflow-y-auto bg-neutral px-3 pt-6 pb-6 lg:block">
        <Link href="/scraping/serp" className="mb-6 ml-3 flex h-[28px] items-center" aria-label="fetchwise home">
          <Logo />
        </Link>
        <Nav pathname={pathname} />
      </aside>

      {/* Mobile */}
      <div className="sticky top-0 z-30 flex h-16 items-center justify-between bg-neutral px-4 lg:hidden">
        <Link href="/scraping/serp" aria-label="fetchwise home">
          <Logo />
        </Link>
        <button
          type="button"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
          className="flex size-10 cursor-pointer items-center justify-center rounded-[6px] text-white hover:bg-white/10"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            {mobileOpen ? (
              <path d="m5 5 10 10M15 5 5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            ) : (
              <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>
      {mobileOpen && (
        <div className="fixed inset-0 top-16 z-30 lg:hidden">
          <button type="button" aria-label="Close menu" className="absolute inset-0 bg-neutral/40" onClick={() => setMobileOpen(false)} />
          <div
            className="scroll-dark relative h-full w-[280px] max-w-[85vw] overflow-y-auto bg-neutral px-3 py-6"
            onClick={(event) => {
              if ((event.target as HTMLElement).closest("a")) setMobileOpen(false);
            }}
          >
            <Nav pathname={pathname} />
          </div>
        </div>
      )}
    </>
  );
}
