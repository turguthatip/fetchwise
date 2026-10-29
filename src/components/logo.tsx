/** fetchwise symbol: three forward chevrons fading in, in the brand color. */
export function LogoMark({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={(size * 20) / 28} viewBox="0 0 28 20" fill="none" aria-hidden="true">
      <g stroke="#F44862" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4l6 6-6 6" strokeOpacity="0.4" />
        <path d="M11 4l6 6-6 6" strokeOpacity="0.7" />
        <path d="M18 4l6 6-6 6" />
      </g>
    </svg>
  );
}

/** fetchwise logo: chevron symbol plus wordmark whose "i" carries a brand-colored square tittle. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`inline-flex items-center gap-1.5 ${className}`}>
      <LogoMark />
      <span className="inline-flex font-poppins text-[22px] font-semibold leading-none tracking-[-0.2px] text-white">
        fetchw
        <span className="relative">
          ı
          <span className="absolute top-[-1px] left-1/2 size-[5px] -translate-x-1/2 rounded-[1.5px] bg-brand" />
        </span>
        se
      </span>
    </span>
  );
}
