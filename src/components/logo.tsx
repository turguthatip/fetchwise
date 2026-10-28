/** fetchwise mark: a bold arrow pulling inward to a corner, i.e. fetching data back. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <rect width="32" height="32" rx="8" fill="#2997FF" />
      <path d="M22.5 9.5 11 21" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M10.5 12.5V21.5H19.5" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="23" cy="9" r="2.6" fill="#00F0D3" />
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
