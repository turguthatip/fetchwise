import { useId } from "react";

/** fetchwise mark: an "f" whose top stroke ends in an outbound arrow. */
export function LogoMark({ size = 28 }: { size?: number }) {
  const gradientId = useId();
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#2997FF" />
          <stop offset="1" stopColor="#00F0D3" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill={`url(#${gradientId})`} />
      <path
        d="M21 9.5h-2.4c-2.3 0-3.6 1.4-3.6 3.7V24"
        stroke="#fff"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 16h7.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      <path
        d="M19.6 6.6 22.5 9.5l-2.9 2.9"
        stroke="#fff"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="22.5" cy="22.5" r="2" fill="#fff" fillOpacity="0.75" />
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <LogoMark />
      <span className="font-poppins text-[19px] font-semibold leading-none tracking-[-0.2px] text-white">
        fetch<span className="text-info">wise</span>
      </span>
    </span>
  );
}
