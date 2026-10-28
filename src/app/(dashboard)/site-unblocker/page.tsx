import type { Metadata } from "next";
import { NavTabs } from "@/components/nav-tabs";
import { PageHeader } from "@/components/page-header";
import { Icon } from "@/components/ui";
import { UnblockerPlayground } from "./unblocker-playground";

export const metadata: Metadata = { title: "Site Unblocker" };

export default function SiteUnblockerPage() {
  return (
    <>
      <PageHeader
        icon={<Icon name="unblocker" width={30.2} height={29.19} />}
        title="Site Unblocker"
        plan="Starter"
        nextPayment="6 days"
        usage={{ used: 300.09, total: 3000, unit: "GB" }}
        action="Buy traffic"
      />
      <NavTabs
        label="Site Unblocker"
        tabs={[
          { label: "API Authentication" },
          { label: "API Playground", href: "/site-unblocker" },
          { label: "Statistics" },
          { label: "Pricing" },
        ]}
      />
      <UnblockerPlayground />
    </>
  );
}
