"use client";

import Image from "next/image";
import {
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type InputHTMLAttributes,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";

export function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type IconProps = {
  name: string;
  size?: number;
  width?: number;
  height?: number;
  className?: string;
  alt?: string;
};

/** Renders an icon exported from the Figma file (public/icons). */
export function Icon({ name, size = 16, width, height, className, alt = "" }: IconProps) {
  return (
    <Image
      src={`/icons/${name}.svg`}
      width={width ?? size}
      height={height ?? size}
      alt={alt}
      loading="eager"
      className={cx("shrink-0", className)}
    />
  );
}

export function ParamChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex h-[19px] items-center rounded-[6px] bg-n06 px-1.5 font-sans text-[14px] leading-none text-chip">
      {children}
    </span>
  );
}

type FieldLabelProps = {
  children: ReactNode;
  param?: string;
  info?: string;
  htmlFor?: string;
  muted?: boolean;
};

export function FieldLabel({ children, param, info, htmlFor, muted }: FieldLabelProps) {
  return (
    <div className="flex min-h-[19px] flex-wrap items-center gap-x-2 gap-y-1">
      <label
        htmlFor={htmlFor}
        className={cx(
          "font-poppins text-[10px] uppercase leading-[12px] tracking-[1px] whitespace-nowrap",
          muted ? "text-n50" : "text-neutral",
        )}
      >
        {children}
      </label>
      {param && <ParamChip>{param}</ParamChip>}
      {info && (
        <span title={info} className="inline-flex cursor-help">
          <Icon name="info" alt={info} />
        </span>
      )}
    </div>
  );
}

const fieldBase =
  "h-8 w-full rounded-[5px] border border-n20 bg-white font-sans text-[14px] text-neutral outline-none transition-colors placeholder:text-n50 focus:border-primary-p99 disabled:cursor-not-allowed disabled:bg-n04 disabled:text-n50";

export function Select({ className, children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={cx("relative", className)}>
      <select {...props} className={cx(fieldBase, "appearance-none pr-9 pl-2.5")}>
        {children}
      </select>
      <Icon
        name="chevron-down"
        className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2"
      />
    </div>
  );
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & { icon?: string };

export function TextInput({ icon, className, ...props }: TextInputProps) {
  return (
    <div className={cx("relative", className)}>
      {icon && (
        <Icon name={icon} className="pointer-events-none absolute top-1/2 left-[11px] -translate-y-1/2" />
      )}
      <input {...props} className={cx(fieldBase, icon ? "pl-[37px]" : "pl-[11px]", "pr-[11px]")} />
    </div>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "outline-primary" | "light" | "ghost";
  size?: "md" | "sm";
};

export function Button({ variant = "primary", size = "md", className, ...props }: ButtonProps) {
  return (
    <button
      type="button"
      {...props}
      className={cx(
        "inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-[6px] whitespace-nowrap transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        size === "md" ? "px-4 font-poppins text-[16px] font-medium leading-[28px]" : "px-4 font-poppins text-[14px] font-medium leading-[28px]",
        variant === "primary" && "bg-primary text-white hover:bg-primary-strong",
        variant === "outline" && "border border-neutral bg-white text-n94 hover:bg-n04",
        variant === "outline-primary" && "border border-primary bg-white text-primary hover:bg-primary-p15",
        variant === "light" && "border border-n15 bg-white px-[11px] font-sans text-[14px] font-bold text-ink hover:bg-n04",
        variant === "ghost" && "px-2 font-roboto text-[14px] font-bold",
        className,
      )}
    />
  );
}

type SwitchProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  size?: "md" | "sm";
  disabled?: boolean;
};

export function Switch({ checked, onChange, label, size = "md", disabled }: SwitchProps) {
  const md = size === "md";
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cx(
        "flex shrink-0 cursor-pointer items-center rounded-[24px] p-[3px] transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        md ? "h-6 min-w-12" : "h-4 min-w-8",
        checked ? "justify-end bg-primary" : "justify-start bg-n20",
      )}
    >
      <span className={cx("rounded-full bg-white shadow-sm", md ? "size-[18px]" : "size-[10px]")} />
    </button>
  );
}

type SegmentedProps<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  label: string;
};

export function Segmented<T extends string>({ options, value, onChange, label }: SegmentedProps<T>) {
  return (
    <div role="tablist" aria-label={label} className="inline-flex h-10 items-center gap-1.5 self-start rounded-[6px] bg-n10 p-1">
      {options.map((option) => {
        const active = option === value;
        return (
          <button
            key={option}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(option)}
            className={cx(
              "flex h-8 cursor-pointer items-center rounded-[4px] px-4 py-[7px] font-roboto text-[14px] font-bold leading-[20px] transition-colors",
              active ? "bg-white text-primary shadow-tiny" : "text-neutral hover:bg-white/60",
            )}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}

/** "More options" divider pill from the design. */
export function MoreOptions({ open, onToggle }: { open: boolean; onToggle: () => void }) {
  return (
    <div className="flex w-full items-center">
      <span className="h-px flex-1 bg-n10" />
      <button
        type="button"
        aria-expanded={open}
        onClick={onToggle}
        className="flex cursor-pointer items-center gap-2.5 rounded-full border border-n10 bg-white px-3 py-0.5 font-roboto text-[10px] leading-[18px] text-black hover:bg-n04"
      >
        {open ? "Less Options" : "More Options"}
        <Icon name="chevron-small" className={open ? "-rotate-90" : "rotate-90"} />
      </button>
      <span className="h-px flex-1 bg-n10" />
    </div>
  );
}

type CheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  indeterminate?: boolean;
  large?: boolean;
};

export function Checkbox({ checked, onChange, label, indeterminate, large }: CheckboxProps) {
  const box = large ? 26 : 16;
  const on = checked || indeterminate;
  return (
    <label className="relative inline-flex shrink-0 cursor-pointer" style={{ width: box, height: box }}>
      <input
        type="checkbox"
        aria-label={label}
        checked={checked}
        ref={(node) => {
          if (node) node.indeterminate = Boolean(indeterminate);
        }}
        onChange={(event) => onChange(event.target.checked)}
        className="peer absolute inset-0 cursor-pointer opacity-0"
      />
      {on ? (
        <span
          className={cx(
            "pointer-events-none absolute flex items-center justify-center rounded-[2px] bg-primary text-white",
            large ? "inset-[5px]" : "inset-0",
          )}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            {indeterminate && !checked ? (
              <path d="M2 5h6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            ) : (
              <path d="m1.8 5.2 2.1 2.1 4.3-4.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            )}
          </svg>
        </span>
      ) : (
        <Icon name={large ? "check-26" : "checkbox-off"} size={box} className="pointer-events-none" />
      )}
      <span className="pointer-events-none absolute -inset-0.5 rounded-[4px] peer-focus-visible:ring-2 peer-focus-visible:ring-primary/50" />
    </label>
  );
}

type PaginationProps = {
  page: number;
  pageCount: number;
  pageSize: number;
  total: number;
  onPage: (page: number) => void;
};

export function Pagination({ page, pageCount, pageSize, total, onPage }: PaginationProps) {
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const navButton =
    "flex size-8 cursor-pointer items-center justify-center rounded-[5px] border border-n15 hover:bg-n04 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="flex items-center justify-end gap-3 px-6 py-2">
      <p className="font-sans text-[14px] font-bold text-black">
        {start}-{end} of {total}
      </p>
      <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onPage(page - 1)} className={navButton}>
        <Icon name="arrow-left" />
      </button>
      <span className="flex h-8 items-center rounded-[5px] border border-n15 px-3 font-sans text-[14px] font-bold text-ink">
        {page}/{Math.max(pageCount, 1)}
      </span>
      <button type="button" aria-label="Next page" disabled={page >= pageCount} onClick={() => onPage(page + 1)} className={navButton}>
        <Icon name="arrow-left" className="rotate-180" />
      </button>
    </div>
  );
}

/** Closes a popover when clicking outside of it or pressing Escape. */
export function useDismiss(open: boolean, close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) close();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("pointerdown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open, close]);
  return ref;
}

type MenuProps<T extends string> = {
  value?: T;
  options: readonly T[];
  onSelect: (value: T) => void;
  trigger: ReactNode;
  triggerClassName?: string;
  label: string;
  align?: "left" | "right";
  up?: boolean;
};

export function Menu<T extends string>({ value, options, onSelect, trigger, triggerClassName, label, align = "right", up }: MenuProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useDismiss(open, () => setOpen(false));
  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={label}
        onClick={() => setOpen((current) => !current)}
        className={triggerClassName}
      >
        {trigger}
      </button>
      {open && (
        <div
          role="menu"
          className={cx(
            "absolute z-30 min-w-[96px]",
            up ? "bottom-[calc(100%+4px)]" : "top-[calc(100%+4px)]",
            " overflow-hidden rounded-[6px] border border-n15 bg-white py-1 shadow-card",
            align === "right" ? "right-0" : "left-0",
          )}
        >
          {options.map((option) => (
            <button
              key={option}
              type="button"
              role="menuitem"
              onClick={() => {
                onSelect(option);
                setOpen(false);
              }}
              className={cx(
                "block w-full cursor-pointer px-[18px] text-left font-sans text-[14px] leading-[26px] whitespace-nowrap hover:bg-n06",
                option === value ? "font-bold text-primary" : "text-neutral",
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function useCopy() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 1500);
    return () => clearTimeout(timer);
  }, [copied]);
  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };
  return { copied, copy };
}

export function downloadFile(filename: string, content: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
