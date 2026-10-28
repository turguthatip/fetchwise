import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";

export default function DashboardLayout({ children }: LayoutProps<"/">) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="lg:pl-[280px]">
        <TopBar />
        <main className="mx-auto flex w-full max-w-[1360px] flex-col gap-[30px] px-4 pt-6 pb-8 sm:px-8 sm:pt-8">{children}</main>
      </div>
    </div>
  );
}
