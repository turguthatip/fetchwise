"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent } from "react";
import { CodeBlock, CopyButton, LanguageMenu, Panel, type Language } from "@/components/code-panel";
import { Button, FieldLabel, Icon, MoreOptions, Segmented, Select, Switch, TextInput, cx } from "@/components/ui";

const LOCALES = ["United States", "United Kingdom", "Germany", "France", "Japan", "Brazil"] as const;
const IPS: Record<string, string> = {
  "United States": "203.0.113.42",
  "United Kingdom": "198.51.100.17",
  Germany: "192.0.2.88",
  France: "198.51.100.203",
  Japan: "203.0.113.150",
  Brazil: "192.0.2.61",
};
const DEVICES = ["Desktop", "Mobile"] as const;
const VIEWS = ["Request", "Response"] as const;
type View = (typeof VIEWS)[number];

const PROXY = "unblock.fetchwise.io:60000";
const CREDENTIALS = "fw_demo_user:demo_password";
const DEFAULT_URL = "https://ip.fetchwise.io";

type Header = { name: string; value: string };

type Options = {
  url: string;
  locale: string;
  automaticHeaders: boolean;
  headers: Header[];
  device: string;
  render: boolean;
  session: string;
};

function headerArgs(options: Options) {
  const args: Header[] = [{ name: "X-FW-Geo", value: options.locale }];
  if (options.device !== "Desktop") args.push({ name: "X-FW-Device-Type", value: options.device.toLowerCase() });
  if (options.render) args.push({ name: "X-FW-Headless", value: "html" });
  if (options.session) args.push({ name: "X-FW-Session-Id", value: options.session });
  if (!options.automaticHeaders) args.push(...options.headers);
  return args;
}

function buildRequest(options: Options, language: Language) {
  const headers = headerArgs(options);
  if (language === "Node") {
    return [
      `import { HttpsProxyAgent } from "https-proxy-agent";`,
      `import fetch from "node-fetch";`,
      ``,
      `const agent = new HttpsProxyAgent("http://${CREDENTIALS}@${PROXY}");`,
      `const response = await fetch("${options.url}", {`,
      `  agent,`,
      `  headers: {`,
      ...headers.map((header) => `    "${header.name}": "${header.value}",`),
      `  },`,
      `});`,
      `console.log(await response.text());`,
    ].join("\n");
  }
  if (language === "Python") {
    return [
      `import requests`,
      ``,
      `proxies = {"https": "http://${CREDENTIALS}@${PROXY}"}`,
      `headers = {`,
      ...headers.map((header) => `    "${header.name}": "${header.value}",`),
      `}`,
      ``,
      `response = requests.get("${options.url}", proxies=proxies, headers=headers, verify=False)`,
      `print(response.text)`,
    ].join("\n");
  }
  return [
    `curl -k -x ${PROXY} '${options.url}' \\`,
    ...headers.map((header) => `      -H '${header.name}: ${header.value}' \\`),
    `      -U '${CREDENTIALS}'`,
  ].join("\n");
}

function buildResponse(options: Options) {
  return [
    "HTTP/1.1 200 OK",
    "content-type: text/html; charset=utf-8",
    `x-fw-geo: ${options.locale}`,
    `x-fw-ip: ${IPS[options.locale]}`,
    "x-fw-status: unblocked",
    "",
    "<html>",
    "  <body>",
    `    Your Ip is: ${IPS[options.locale]}`,
    "  </body>",
    "</html>",
  ].join("\n");
}

export function UnblockerPlayground() {
  const [options, setOptions] = useState<Options>({
    url: DEFAULT_URL,
    locale: "United States",
    automaticHeaders: true,
    headers: [],
    device: "Desktop",
    render: false,
    session: "",
  });
  const [draft, setDraft] = useState<Header>({ name: "", value: "" });
  const [sent, setSent] = useState<Options | null>(null);
  const [loading, setLoading] = useState(false);
  const [moreOptions, setMoreOptions] = useState(false);
  const [view, setView] = useState<View>("Request");
  const [language, setLanguage] = useState<Language>("cURL");

  const set = <K extends keyof Options>(key: K, value: Options[K]) => setOptions((current) => ({ ...current, [key]: value }));
  const request = useMemo(() => buildRequest(options, language), [options, language]);
  const response = useMemo(() => (sent ? buildResponse(sent) : "Send a request to see the response."), [sent]);

  const addHeader = () => {
    if (!draft.name.trim()) return;
    set("headers", [...options.headers, { name: draft.name.trim(), value: draft.value.trim() }]);
    setDraft({ name: "", value: "" });
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setSent(options);
      setLoading(false);
    }, 700);
  };

  const manualDisabled = options.automaticHeaders;
  const smallInput = "h-8 w-full rounded-[4px] border border-n20 bg-white px-4 font-roboto text-[12px] text-neutral outline-none placeholder:text-n50 focus:border-primary-p99 disabled:cursor-not-allowed disabled:bg-n04";

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-5 rounded-[6px] bg-white p-4 sm:p-6">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-5">
          <div className="flex w-full max-w-[504px] min-w-0 flex-col gap-2">
            <FieldLabel htmlFor="search-url" muted>
              Search URL
            </FieldLabel>
            <TextInput id="search-url" icon="target" type="url" required value={options.url} onChange={(event) => set("url", event.target.value)} className="[&_input]:text-ink" />
            <p className="font-poppins text-[10px] text-neutral">Example: https://twitter.com/username</p>
          </div>
          <Button type="submit" disabled={loading} className="w-full sm:w-auto">
            {loading ? "Sending…" : "Send request"}
          </Button>
        </div>
        <a href="#documentation" className="flex items-center gap-1 font-roboto text-[14px] font-medium leading-[26px] text-primary-p99 hover:underline">
          Documentation
          <Icon name="external-link" />
        </a>
      </form>

      <section className="flex flex-col gap-4 rounded-[6px] bg-white p-4 sm:p-6" aria-label="Parameters">
        <p className="font-poppins text-[10px] uppercase leading-[12px] tracking-[1px] text-n50">Parameters</p>
        <div className="flex flex-wrap items-start gap-5">
          <div className="flex w-full flex-col gap-2.5 lg:w-[508px]">
            <FieldLabel htmlFor="locale">Locale</FieldLabel>
            <div className="flex flex-col gap-1.5">
              <Select id="locale" value={options.locale} onChange={(event) => set("locale", event.target.value)}>
                {LOCALES.map((locale) => (
                  <option key={locale}>{locale}</option>
                ))}
              </Select>
              <p className="font-poppins text-[10px] text-neutral">Specify from which location to access a particular website.</p>
            </div>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-2 sm:flex-row sm:items-end sm:gap-[5px] lg:w-auto">
            <div className="flex flex-col gap-2 sm:w-[141px]">
              <div className="flex h-5 items-center gap-2">
                <label htmlFor="header-name" className="font-poppins text-[10px] uppercase leading-[12px] tracking-[1px] text-neutral">
                  Header
                </label>
                <span title="Turn off automatic headers to send your own." className="inline-flex cursor-help">
                  <Icon name="tooltip" alt="Turn off automatic headers to send your own." />
                </span>
              </div>
              <input
                id="header-name"
                placeholder="my-header"
                disabled={manualDisabled}
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                className={smallInput}
              />
            </div>
            <div className="flex flex-col items-end gap-1 sm:w-[320px]">
              <div className="flex h-5 items-center gap-0.5">
                <span id="auto-header-label" className="font-poppins text-[10px] uppercase leading-[12px] tracking-[1px] text-neutral">
                  Automatic header
                </span>
                <Switch size="sm" label="Automatic header" checked={options.automaticHeaders} onChange={(value) => set("automaticHeaders", value)} />
              </div>
              <div className="flex w-full gap-1">
                <input
                  aria-label="Header value"
                  placeholder="your header content here"
                  disabled={manualDisabled}
                  value={draft.value}
                  onChange={(event) => setDraft({ ...draft, value: event.target.value })}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addHeader();
                    }
                  }}
                  className={smallInput}
                />
                <button
                  type="button"
                  onClick={addHeader}
                  disabled={manualDisabled || !draft.name.trim()}
                  className="flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-[6px] bg-primary px-4 font-poppins text-[14px] font-medium leading-[28px] text-white hover:bg-primary-strong disabled:cursor-not-allowed disabled:bg-n20 disabled:text-n40"
                >
                  <Icon name="plus" className={manualDisabled || !draft.name.trim() ? undefined : "brightness-0 invert"} />
                  Add new
                </button>
              </div>
            </div>
          </div>
        </div>

        {options.headers.length > 0 && (
          <ul className={cx("flex flex-wrap gap-2", manualDisabled && "opacity-50")} aria-label="Custom headers">
            {options.headers.map((header, index) => (
              <li key={`${header.name}-${index}`} className="flex items-center gap-2 rounded-full bg-n06 py-1 pr-1 pl-3 font-roboto text-[12px] text-ink">
                <span>
                  <strong>{header.name}</strong>: {header.value || "—"}
                </span>
                <button
                  type="button"
                  aria-label={`Remove ${header.name}`}
                  onClick={() => set("headers", options.headers.filter((_, i) => i !== index))}
                  className="flex size-5 cursor-pointer items-center justify-center rounded-full text-n50 hover:bg-white hover:text-neutral"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}

        <MoreOptions open={moreOptions} onToggle={() => setMoreOptions((open) => !open)} />

        {moreOptions && (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            <div className="flex flex-col gap-2.5">
              <FieldLabel htmlFor="device" param="X-FW-Device-Type">Device type</FieldLabel>
              <Select id="device" value={options.device} onChange={(event) => set("device", event.target.value)}>
                {DEVICES.map((device) => (
                  <option key={device}>{device}</option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2.5">
              <FieldLabel htmlFor="session" param="X-FW-Session-Id" info="Reuse the same IP across requests.">
                Session
              </FieldLabel>
              <TextInput id="session" placeholder="e.g. checkout-42" value={options.session} onChange={(event) => set("session", event.target.value)} />
            </div>
            <div className="flex flex-col gap-2.5">
              <FieldLabel param="X-FW-Headless" info="Render JavaScript before returning the page.">
                JavaScript rendering
              </FieldLabel>
              <div className="flex h-8 items-center">
                <Switch label="JavaScript rendering" checked={options.render} onChange={(value) => set("render", value)} />
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="flex flex-col gap-7" aria-label="Code snippets">
        <Segmented label="Code view" options={VIEWS} value={view} onChange={setView} />
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <Panel
            title={view}
            className="h-[365px]"
            actions={
              <>
                {view === "Request" && <LanguageMenu value={language} onChange={setLanguage} />}
                <CopyButton text={view === "Request" ? request : response} />
              </>
            }
          >
            <CodeBlock code={view === "Request" ? request : response} highlight={view === "Request" && language === "cURL" ? "shell" : "json"} className={cx("h-full", loading && "opacity-50")} />
          </Panel>
          <Panel title="Live Preview" tone="light" className="h-[365px]">
            <div className="relative h-full overflow-hidden border-t border-n15 bg-white">
              {sent ? (
                <p className="p-2 font-serif text-[10px] text-black">Your Ip is: {IPS[sent.locale]}</p>
              ) : (
                <Image
                  src="/images/unblocker-live-preview.png"
                  alt="Rendered page reading “Your Ip is: XXXXXXXXXXXX”"
                  width={690}
                  height={462}
                  className="absolute top-[0.51%] left-0 h-[110.6%] w-full max-w-none"
                />
              )}
            </div>
          </Panel>
        </div>
      </section>
    </>
  );
}
