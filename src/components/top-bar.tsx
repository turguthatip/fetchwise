"use client";

import { useState } from "react";
import { Icon, Menu } from "./ui";

const CURRENCIES = ["(USD)$", "(EUR)€", "(GBP)£"] as const;
type Currency = (typeof CURRENCIES)[number];

export function TopBar() {
  const [currency, setCurrency] = useState<Currency>("(USD)$");
  const iconButton = "flex cursor-pointer items-start rounded-[4px] p-1 hover:bg-n06";
  return (
    <header className="flex h-10 items-center justify-between bg-white px-4 py-2 sm:px-6">
      <div className="flex items-center gap-3">
        <span className="relative flex size-6 items-center justify-center">
          <Icon name="avatar" size={24} className="absolute inset-0" />
          <span className="relative font-poppins text-[14px] leading-none text-white">A</span>
        </span>
        <span className="font-poppins text-[12px] leading-[15px] text-n50">Alex Morgan</span>
      </div>
      <div className="flex items-center gap-2">
        <Menu
          label="Currency"
          value={currency}
          options={CURRENCIES}
          onSelect={setCurrency}
          triggerClassName={`${iconButton} items-center gap-1 font-poppins text-[14px] leading-none text-neutral`}
          trigger={
            <>
              {currency}
              <Icon name="topbar-dropdown" />
            </>
          }
        />
        <span className="hidden items-center gap-1 p-1 font-poppins text-[14px] leading-none text-neutral sm:flex">
          <Icon name="topbar-wallet" alt="Balance" />
          $100.00
        </span>
        <button type="button" aria-label="Language" className={iconButton}>
          <Icon name="topbar-language" />
        </button>
        <button type="button" aria-label="Log out" className={iconButton}>
          <Icon name="topbar-logout" />
        </button>
      </div>
    </header>
  );
}
