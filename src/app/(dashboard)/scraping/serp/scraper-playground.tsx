"use client";

import Image from "next/image";
import { useMemo, useState, type FormEvent, type ReactNode } from "react";
import { CodeBlock, CopyButton, DownloadButton, LanguageMenu, Panel, type Language } from "@/components/code-panel";
import { Button, FieldLabel, Icon, MoreOptions, Segmented, Select, Switch, TextInput, cx } from "@/components/ui";
import {
  DEFAULT_PARAMS,
  DEVICES,
  DOMAINS,
  LOCALES,
  LOCATIONS,
  TARGETS,
  TBM_OPTIONS,
  buildRequest,
  buildResponse,
  mockResults,
  type SerpParams,
} from "@/lib/serp";

const VIEWS = ["Enterprise", "Response", "Request"] as const;
type View = (typeof VIEWS)[number];

const INITIAL_TASK = "7115939496947926017";

function Stepper({ id, value, onChange, min = 1, max = 100 }: { id: string; value: number; onChange: (value: number) => void; min?: number; max?: number }) {
  const clamp = (next: number) => Math.min(max, Math.max(min, next));
  const button = "flex w-6 cursor-pointer items-center justify-center font-sans text-[14px] text-neutral hover:bg-n06 disabled:cursor-not-allowed disabled:opacity-40";
  return (
    <div className="flex h-8 w-[100px] overflow-hidden rounded-[4px] border border-n20 bg-white">
      <button type="button" aria-label="Decrease" className={button} disabled={value <= min} onClick={() => onChange(clamp(value - 1))}>
        –
      </button>
      <input
        id={id}
        inputMode="numeric"
        value={value}
        onChange={(event) => {
          const next = Number(event.target.value.replace(/\D/g, ""));
          if (!Number.isNaN(next)) onChange(clamp(next || min));
        }}
        className="w-0 flex-1 text-center font-sans text-[14px] text-neutral outline-none"
      />
      <button type="button" aria-label="Increase" className={button} disabled={value >= max} onClick={() => onChange(clamp(value + 1))}>
        +
      </button>
    </div>
  );
}

function Column({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <div className={cx("flex min-w-0 flex-col gap-4", className)}>
      <p className="font-poppins text-[10px] uppercase leading-[12px] tracking-[1px] text-ink">{title}</p>
      {children}
    </div>
  );
}

function SwitchRow({ label, param, checked, onChange }: { label: string; param: string; checked: boolean; onChange: (value: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <FieldLabel param={param} info={`${label} (${param})`}>
        {label}
      </FieldLabel>
      <Switch checked={checked} onChange={onChange} label={label} />
    </div>
  );
}

function LivePreview({ query, custom }: { query: string; custom: boolean }) {
  if (!custom) {
    return (
      <div className="relative aspect-[534/295] w-full bg-white">
        <Image
          src="/images/serp-live-preview.png"
          alt="Rendered Google results page for the query “pizza”"
          fill
          sizes="(min-width: 1024px) 534px, 100vw"
          className="object-contain"
          priority
        />
        {/* Masks from the design that hide personal details in the screenshot. */}
        <span className="absolute top-[40.7%] left-[19.1%] h-[4.4%] w-[29.4%] bg-white" />
        <span className="absolute top-[24.7%] left-[17.4%] h-[4.4%] w-[4.5%] bg-white" />
      </div>
    );
  }
  return (
    <div className="scroll-light aspect-[534/295] w-full overflow-auto bg-white p-4 font-sans">
      <p className="mb-3 text-[11px] text-n50">About 1,240,000,000 results (0.42 seconds)</p>
      <ol className="flex flex-col gap-3">
        {mockResults(query).map((result) => (
          <li key={result.pos}>
            <p className="truncate text-[11px] text-[#188038]">{result.url}</p>
            <p className="truncate text-[14px] text-[#1a0dab]">{result.title}</p>
            <p className="line-clamp-2 text-[11px] text-n80">{result.desc}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function ScraperPlayground() {
  const [params, setParams] = useState<SerpParams>(DEFAULT_PARAMS);
  const [submitted, setSubmitted] = useState<SerpParams>(DEFAULT_PARAMS);
  const [taskId, setTaskId] = useState(INITIAL_TASK);
  const [loading, setLoading] = useState(false);
  const [moreOptions, setMoreOptions] = useState(true);
  const [view, setView] = useState<View>("Response");
  const [language, setLanguage] = useState<Language>("cURL");

  const set = <K extends keyof SerpParams>(key: K, value: SerpParams[K]) => setParams((current) => ({ ...current, [key]: value }));

  const response = useMemo(() => buildResponse(submitted, taskId), [submitted, taskId]);
  const request = useMemo(() => buildRequest(params, language, view === "Enterprise"), [params, language, view]);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!params.query.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setSubmitted(params);
      setTaskId(`71159394969${String(Date.now()).slice(-8)}`);
      setLoading(false);
      setView("Response");
    }, 700);
  };

  const showResponse = view === "Response";

  return (
    <>
      <form onSubmit={onSubmit} className="flex flex-col overflow-hidden rounded-[6px] bg-white">
        <div className="flex flex-wrap items-end justify-between gap-4 px-4 py-6 sm:px-6 sm:py-8">
          <div className="flex w-full flex-wrap items-end gap-2.5 xl:w-auto xl:flex-nowrap">
            <div className="flex w-full flex-col gap-2.5 sm:w-[239px]">
              <FieldLabel htmlFor="target" info="Choose which search engine and result type to scrape.">
                Target
              </FieldLabel>
              <Select id="target" value={params.target} onChange={(event) => set("target", event.target.value)}>
                {TARGETS.map((target) => (
                  <option key={target.value} value={target.value}>
                    {target.label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="flex w-full flex-col gap-2 sm:w-[379px] sm:max-w-full">
              <FieldLabel htmlFor="query" param="Query" info="The search phrase to scrape results for.">
                Search query
              </FieldLabel>
              <TextInput id="query" icon="target" value={params.query} onChange={(event) => set("query", event.target.value)} placeholder="Enter a search query" required />
            </div>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? "Scraping…" : "Start scraping"}
            </Button>
          </div>
          <a href="#documentation" className="flex h-8 items-center gap-1.5 font-roboto text-[14px] leading-[20px] text-primary-p99 hover:underline">
            Documentation
            <Icon name="external-link" />
          </a>
        </div>

        <div className="h-px bg-n10" />

        <div className="flex flex-col gap-4 p-4 sm:p-6">
          <p className="font-poppins text-[10px] uppercase leading-[12px] tracking-[1px] text-neutral">Parameters</p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <div className="flex flex-col gap-2.5">
              <FieldLabel htmlFor="locale" param="locale" info="Interface language of the results page.">
                Language
              </FieldLabel>
              <Select id="locale" value={params.locale} onChange={(event) => set("locale", event.target.value)}>
                {LOCALES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2.5">
              <FieldLabel htmlFor="geo" param="geo" info="Where the search should appear to come from.">
                Location
              </FieldLabel>
              <Select id="geo" value={params.geo} onChange={(event) => set("geo", event.target.value)}>
                {LOCATIONS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2.5">
              <FieldLabel htmlFor="domain" param="domain" info="Top-level domain of the search engine.">
                Web domain
              </FieldLabel>
              <Select id="domain" value={params.domain} onChange={(event) => set("domain", event.target.value)}>
                {DOMAINS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
            </div>
            <div className="flex flex-col gap-2.5">
              <FieldLabel htmlFor="device" param="device_type" info="Device and browser used to render the page.">
                Device type and browser
              </FieldLabel>
              <Select id="device" value={params.device} onChange={(event) => set("device", event.target.value)}>
                {DEVICES.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </Select>
            </div>
          </div>

          <MoreOptions open={moreOptions} onToggle={() => setMoreOptions((open) => !open)} />

          {moreOptions && (
            <div className="flex flex-col gap-6 lg:flex-row">
              <Column title="Pagination" className="lg:w-[298px] lg:shrink-0">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="page-from" param="page_from" info="First results page to scrape.">
                    Starting page number
                  </FieldLabel>
                  <Stepper id="page-from" value={params.pageFrom} onChange={(value) => set("pageFrom", value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="num-pages" param="num_pages" info="How many pages to scrape.">
                    Page number
                  </FieldLabel>
                  <Stepper id="num-pages" value={params.numPages} onChange={(value) => set("numPages", value)} />
                </div>
              </Column>
              <span className="hidden w-px self-stretch bg-n10 lg:block" />
              <Column title="Target specific" className="lg:w-[320px] lg:shrink-0">
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="results-language" param="google_results_language">
                    Results language
                  </FieldLabel>
                  <Select id="results-language" value={params.resultsLanguage} onChange={(event) => set("resultsLanguage", event.target.value)}>
                    {LOCALES.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </Select>
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="tbs" param="google_tbs" info="Extra filters, e.g. qdr:w for results from the past week.">
                    TBs
                  </FieldLabel>
                  <TextInput id="tbs" value={params.tbs} onChange={(event) => set("tbs", event.target.value)} placeholder="Enter google TBS" />
                </div>
                <div className="flex flex-col gap-2">
                  <FieldLabel htmlFor="tbm" param="google_tbm" info="Search vertical, e.g. images or news.">
                    TBM
                  </FieldLabel>
                  <Select id="tbm" value={params.tbm} onChange={(event) => set("tbm", event.target.value)} className={params.tbm ? undefined : "[&_select]:text-n50"}>
                    {TBM_OPTIONS.map((option) => (
                      <option key={option} value={option}>
                        {option || "Select google TBM"}
                      </option>
                    ))}
                  </Select>
                </div>
              </Column>
              <span className="hidden w-px self-stretch bg-n10 lg:block" />
              <Column title="Other" className="flex-1">
                <SwitchRow label="Parse results" param="parse" checked={params.parse} onChange={(value) => set("parse", value)} />
                <SwitchRow label="Autocorrection" param="google_nfpr" checked={params.autocorrect} onChange={(value) => set("autocorrect", value)} />
                <SwitchRow label="Save search" param="google_save_search" checked={params.saveSearch} onChange={(value) => set("saveSearch", value)} />
              </Column>
            </div>
          )}
        </div>
      </form>

      <section className="flex flex-col gap-[30px]" aria-label="Code snippets">
        <Segmented label="Code view" options={VIEWS} value={view} onChange={setView} />
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          {showResponse ? (
            <Panel
              title="Response"
              className="h-[385px]"
              actions={
                <>
                  <DownloadButton dark label=".JSON" filename={`fetchwise-${taskId}.json`} content={response} type="application/json" />
                  <CopyButton text={response} />
                </>
              }
            >
              <CodeBlock code={response} highlight="json" className={cx("h-full", loading && "opacity-50")} />
            </Panel>
          ) : (
            <Panel
              title={view === "Enterprise" ? "Batch request" : "Request"}
              className="h-[385px]"
              actions={
                <>
                  <LanguageMenu value={language} onChange={setLanguage} />
                  <CopyButton text={request} />
                </>
              }
            >
              <CodeBlock code={request} highlight={language === "cURL" ? "shell" : "json"} className="h-full" />
            </Panel>
          )}
          <Panel title="Live Preview" tone="light">
            <div className="border-t border-n15">
              <LivePreview query={submitted.query} custom={submitted.query.trim().toLowerCase() !== "pizza"} />
            </div>
          </Panel>
        </div>
      </section>
    </>
  );
}
