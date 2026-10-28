import type { ReactNode } from "react";
import { Icon } from "./ui";

type PageHeaderProps = {
  icon: ReactNode;
  title: string;
  plan: string;
  nextPayment: string;
  usage: { used: number; total: number; unit: string };
  action: string;
};

/** Title + subscription status bar shared by product pages. */
export function PageHeader({ icon, title, plan, nextPayment, usage, action }: PageHeaderProps) {
  const percent = Math.min(100, (usage.used / usage.total) * 100);
  return (
    <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-5">
      <div className="flex h-8 items-center gap-2.5">
        {icon}
        <h1 className="font-poppins text-[18px] font-medium leading-[30px] text-black">{title}</h1>
      </div>
      <div className="flex flex-wrap items-start gap-x-[30px] gap-y-4">
        <div className="flex flex-col gap-1">
          <p className="font-sans text-[14px] text-neutral">
            Plan: <strong>{plan}</strong>
          </p>
          <p className="flex items-center gap-1.5 pl-px font-sans text-[12px] font-bold text-success">
            <Icon name="status-active" width={6} height={6.00018} />
            Active
          </p>
        </div>
        <div className="flex flex-col gap-0.5 text-neutral">
          <p className="font-sans text-[12px]">Next payment in</p>
          <p className="font-sans text-[14px] font-bold">{nextPayment}</p>
        </div>
        <div className="flex items-start gap-2.5">
          <div className="flex flex-col gap-1">
            <div
              role="progressbar"
              aria-label={`${usage.unit} used`}
              aria-valuenow={Math.round(percent)}
              aria-valuemin={0}
              aria-valuemax={100}
              className="relative h-3 w-[120px] rounded-[4px] bg-white"
            >
              <span
                className="absolute inset-y-[8.33%] left-[1.2px] rounded-[3px] bg-primary"
                style={{ width: `max(24px, calc(${percent}% - 2.4px))` }}
              />
            </div>
            <p className="font-sans text-[14px] font-bold whitespace-nowrap text-neutral">
              {usage.used.toLocaleString("en-US")} / {usage.total.toLocaleString("en-US")} {usage.unit}
            </p>
          </div>
          <button
            type="button"
            className="flex h-8 w-[112px] cursor-pointer items-center justify-center gap-2.5 rounded-[6px] bg-primary p-2 font-sans text-[14px] font-bold whitespace-nowrap text-white hover:bg-primary-strong"
          >
            <Icon name="add" />
            {action}
          </button>
        </div>
      </div>
    </div>
  );
}
