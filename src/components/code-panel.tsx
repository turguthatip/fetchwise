"use client";

import type { ReactNode } from "react";
import { Button, Icon, Menu, cx, downloadFile, useCopy } from "./ui";

export const LANGUAGES = ["cURL", "Node", "Python"] as const;
export type Language = (typeof LANGUAGES)[number];

type Highlight = "json" | "shell";

/** Colours string literals the way the design does: values pink in JSON, quoted args green in shell. */
function highlightLine(line: string, mode: Highlight): ReactNode[] {
  const pattern = mode === "json" ? /"(?:[^"\\]|\\.)*"(\s*:)?/g : /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"/g;
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of line.matchAll(pattern)) {
    const index = match.index ?? 0;
    if (index > last) parts.push(line.slice(last, index));
    const isKey = mode === "json" && Boolean(match[1]);
    parts.push(
      <span key={index} className={isKey ? undefined : mode === "json" ? "text-code-string" : "text-code-shell"}>
        {match[0]}
      </span>,
    );
    last = index + match[0].length;
  }
  if (last < line.length) parts.push(line.slice(last));
  return parts;
}

type CodeBlockProps = {
  code: string;
  highlight: Highlight;
  className?: string;
};

export function CodeBlock({ code, highlight, className }: CodeBlockProps) {
  const lines = code.split("\n");
  return (
    <div className={cx("scroll-dark flex gap-2 overflow-auto bg-neutral px-5 pb-5 text-[14px] leading-[23px]", className)}>
      <div aria-hidden="true" className="shrink-0 font-sans text-n30 select-none">
        {lines.map((_, index) => (
          <div key={index}>{index + 1}</div>
        ))}
      </div>
      <pre className="font-mono whitespace-pre text-white">
        {lines.map((line, index) => (
          <div key={index}>{highlightLine(line, highlight) as ReactNode}{line === "" ? " " : null}</div>
        ))}
      </pre>
    </div>
  );
}

type PanelProps = {
  title: string;
  tone?: "dark" | "light";
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
};

export function Panel({ title, tone = "dark", actions, children, className }: PanelProps) {
  const dark = tone === "dark";
  return (
    <section className={cx("flex min-w-0 flex-col overflow-hidden rounded-[6px] border border-n15", dark ? "bg-neutral" : "bg-code-light", className)}>
      <header className="flex h-[72px] shrink-0 items-center justify-between gap-3 p-5">
        <h3 className={cx("font-poppins text-[18px] font-bold leading-[22px] whitespace-nowrap", dark ? "text-white" : "text-neutral")}>
          {title}
        </h3>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </header>
      <div className="min-h-0 flex-1">{children}</div>
    </section>
  );
}

export function CopyButton({ text }: { text: string }) {
  const { copied, copy } = useCopy();
  return (
    <Button variant="light" onClick={() => copy(text)} aria-live="polite">
      {copied ? "Copied" : "Copy"}
      <Icon name="copy-light" />
    </Button>
  );
}

export function LanguageMenu({ value, onChange }: { value: Language; onChange: (value: Language) => void }) {
  return (
    <Menu
      label="Code language"
      value={value}
      options={LANGUAGES}
      onSelect={onChange}
      triggerClassName="inline-flex h-8 cursor-pointer items-center gap-2 rounded-[6px] border border-n15 bg-white px-[11px] font-sans text-[14px] font-bold text-ink hover:bg-n04"
      trigger={
        <>
          {value}
          <Icon name="chevron-down-dark" />
        </>
      }
    />
  );
}

export function DownloadButton({ label, filename, content, type, dark }: { label: string; filename: string; content: string; type: string; dark?: boolean }) {
  return (
    <button
      type="button"
      onClick={() => downloadFile(filename, content, type)}
      className={cx(
        "inline-flex h-8 cursor-pointer items-center gap-1 rounded-[5px] px-2 font-roboto text-[14px] font-bold",
        dark ? "text-white hover:bg-white/10" : "text-neutral hover:bg-n06",
      )}
    >
      {label}
      <Icon name={dark ? "download-light" : "download"} />
    </button>
  );
}
