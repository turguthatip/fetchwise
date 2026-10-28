"use client";

import { useMemo, useState, type PointerEvent } from "react";
import { Checkbox, Icon, Pagination, cx, downloadFile, useCopy } from "@/components/ui";
import { LAST_DAY, lastDays, shiftDays, statsBetween, type DayStat } from "@/lib/stats";

const RANGES = ["Last week", "Last month", "Custom"] as const;
type Range = (typeof RANGES)[number];

const COLUMNS = [
  { key: "date", label: "Date" },
  { key: "requests", label: "Requests" },
  { key: "successful", label: "Successful" },
  { key: "failed", label: "Failed" },
  { key: "avgMs", label: "Avg. response" },
] as const;
type SortKey = (typeof COLUMNS)[number]["key"];

const PAGE_SIZE = 10;
const W = 1000;
const H = 300;

const formatDay = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
const formatNumber = (value: number) => value.toLocaleString("en-US");

function smoothPath(points: Array<[number, number]>) {
  if (points.length === 1) return `M0,${points[0][1]} L${W},${points[0][1]}`;
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [x0, y0] = points[Math.max(0, i - 1)];
    const [x1, y1] = points[i];
    const [x2, y2] = points[i + 1];
    const [x3, y3] = points[Math.min(points.length - 1, i + 2)];
    const clampY = (y: number) => Math.min(H, Math.max(0, y));
    const c1 = [x1 + (x2 - x0) / 6, clampY(y1 + (y2 - y0) / 6)];
    const c2 = [x2 - (x3 - x1) / 6, clampY(y2 - (y3 - y1) / 6)];
    d += ` C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${x2},${y2}`;
  }
  return d;
}

function Chart({ data }: { data: DayStat[] }) {
  const peak = useMemo(() => data.reduce((best, day, index) => (day.requests > data[best].requests ? index : best), 0), [data]);
  const [hover, setHover] = useState<number | null>(null);
  const max = Math.max(...data.map((day) => day.requests), 1) * 1.6;
  const points = data.map((day, index): [number, number] => [
    data.length === 1 ? W / 2 : (index / (data.length - 1)) * W,
    H - (day.requests / max) * H,
  ]);
  const line = smoothPath(points);
  const active = hover ?? peak;
  const activePoint = points[active];
  const labelEvery = Math.max(1, Math.ceil(data.length / 9));

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientX - rect.left) / rect.width;
    setHover(Math.round(ratio * (data.length - 1)));
  };

  return (
    <div className="flex h-full flex-col">
      <div className="relative flex-1" onPointerMove={onMove} onPointerLeave={() => setHover(null)}>
        {[0, 25, 50, 75].map((top) => (
          <span key={top} className="absolute inset-x-0 h-px bg-n10" style={{ top: `${top}%` }} />
        ))}
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <defs>
            <linearGradient id="requests-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2997FF" stopOpacity="0.75" />
              <stop offset="1" stopColor="#2997FF" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L${W},${H} L0,${H} Z`} fill="url(#requests-fill)" />
          <path d={line} fill="none" stroke="#2997FF" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        </svg>
        {activePoint && (
          <>
            <span className="pointer-events-none absolute inset-y-0 w-px bg-primary" style={{ left: `${(activePoint[0] / W) * 100}%` }} />
            <span
              className="pointer-events-none absolute size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary ring-2 ring-white"
              style={{ left: `${(activePoint[0] / W) * 100}%`, top: `${(activePoint[1] / H) * 100}%` }}
            />
            <div
              className={cx(
                "pointer-events-none absolute top-2 rounded-[6px] bg-neutral px-3 py-2 font-roboto text-[12px] text-white shadow-card",
                activePoint[0] / W > 0.7 ? "-translate-x-[calc(100%+12px)]" : "translate-x-3",
              )}
              style={{ left: `${(activePoint[0] / W) * 100}%` }}
            >
              <p className="text-n30">{formatDay(data[active].date)}</p>
              <p className="font-bold">{formatNumber(data[active].requests)} requests</p>
            </div>
          </>
        )}
      </div>
      <div className="mt-[30px] border-t border-n10 pt-[9px]">
        <div className="relative h-[11px] font-roboto text-[10px] leading-none text-n50">
          {data.map((day, index) =>
            (index % labelEvery === 0 && data.length - 1 - index >= labelEvery / 2) || index === data.length - 1 ? (
              <span
                key={day.date}
                className={cx("absolute whitespace-nowrap", index === 0 ? "" : index === data.length - 1 ? "-translate-x-full" : "-translate-x-1/2")}
                style={{ left: `${data.length === 1 ? 50 : (index / (data.length - 1)) * 100}%` }}
              >
                {formatDay(day.date)}
              </span>
            ) : null,
          )}
        </div>
      </div>
    </div>
  );
}

function toCsv(rows: DayStat[], separator: string) {
  const header = COLUMNS.map((column) => column.label).join(separator);
  return [header, ...rows.map((row) => COLUMNS.map((column) => row[column.key]).join(separator))].join("\n");
}

function ExportButton({ label, icon, onClick }: { label: string; icon: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-8 cursor-pointer items-center gap-2 rounded-[6px] border border-neutral px-4 font-poppins text-[14px] font-medium leading-[28px] text-n94 hover:bg-n04"
    >
      {label}
      <Icon name={icon} />
    </button>
  );
}

export function StatisticsView() {
  const [range, setRange] = useState<Range>("Last month");
  const [from, setFrom] = useState(shiftDays(LAST_DAY, -13));
  const [to, setTo] = useState(LAST_DAY);
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: "date", dir: -1 });
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const { copied, copy } = useCopy();

  const data = useMemo(() => {
    if (range === "Last week") return lastDays(7);
    if (range === "Last month") return lastDays(30);
    return statsBetween(from, to);
  }, [range, from, to]);

  const rows = useMemo(
    () => [...data].sort((a, b) => (a[sort.key] < b[sort.key] ? -1 : a[sort.key] > b[sort.key] ? 1 : 0) * sort.dir),
    [data, sort],
  );
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const pageRows = rows.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const exportRows = selected.size ? rows.filter((row) => selected.has(row.date)) : rows;
  const allOnPage = pageRows.length > 0 && pageRows.every((row) => selected.has(row.date));
  const someOnPage = pageRows.some((row) => selected.has(row.date));

  const changeRange = (next: Range) => {
    setRange(next);
    setPage(1);
    setSelected(new Set());
  };

  const toggle = (date: string, on: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (on) next.add(date);
      else next.delete(date);
      return next;
    });

  const dateInput = "h-8 rounded-[5px] border border-n20 bg-white px-2 font-sans text-[13px] text-neutral outline-none focus:border-primary-p99";

  return (
    <div className="flex flex-col overflow-hidden rounded-[6px] bg-white shadow-card">
      <div className="flex min-h-14 flex-wrap items-center justify-end gap-x-4 gap-y-2 px-4 py-3 sm:px-6">
        {range === "Custom" && (
          <div className="flex items-center gap-2 font-roboto text-[12px] text-n50">
            <label className="sr-only" htmlFor="stats-from">From</label>
            <input id="stats-from" type="date" value={from} max={to} onChange={(event) => { setFrom(event.target.value); setPage(1); }} className={dateInput} />
            –
            <label className="sr-only" htmlFor="stats-to">To</label>
            <input id="stats-to" type="date" value={to} min={from} max={LAST_DAY} onChange={(event) => { setTo(event.target.value); setPage(1); }} className={dateInput} />
          </div>
        )}
        <div role="tablist" aria-label="Date range" className="flex items-center gap-2">
          {RANGES.map((option) => {
            const active = option === range;
            return (
              <button
                key={option}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => changeRange(option)}
                className={cx(
                  "cursor-pointer rounded-[6px] px-2 py-1.5 font-roboto text-[14px] font-bold leading-[20px] text-ink",
                  active ? "bg-n10" : "underline decoration-n50 decoration-dotted underline-offset-4 hover:bg-n04",
                )}
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-[280px] px-4 pt-4 pb-6 sm:h-[437px] sm:p-6">
        {data.length ? <Chart key={`${range}-${data.length}-${data[0].date}`} data={data} /> : <p className="font-roboto text-[14px] text-n50">Pick a valid date range.</p>}
      </div>

      <div className="scroll-light overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-n04">
              {COLUMNS.map((column, index) => {
                const active = sort.key === column.key;
                return (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={active ? (sort.dir === 1 ? "ascending" : "descending") : "none"}
                    className={cx("h-[53px] text-left font-normal", index === 0 ? "pl-6" : "", index === COLUMNS.length - 1 && "pr-6")}
                  >
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <Checkbox
                          label="Select all rows on this page"
                          checked={allOnPage}
                          indeterminate={!allOnPage && someOnPage}
                          onChange={(on) => pageRows.forEach((row) => toggle(row.date, on))}
                        />
                      )}
                      <button
                        type="button"
                        onClick={() => setSort({ key: column.key, dir: active ? (sort.dir === 1 ? -1 : 1) : -1 })}
                        className="flex cursor-pointer items-center gap-1 py-1.5 font-poppins text-[12px] uppercase leading-[12px] tracking-[1.2px] whitespace-nowrap text-n80"
                      >
                        {column.label}
                        <Icon name="sort" className={cx(active ? "opacity-100" : "opacity-50", active && sort.dir === 1 && "rotate-180")} />
                      </button>
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.date} className={cx("border-b border-n20 font-roboto text-[14px] leading-[20px] text-neutral", selected.has(row.date) && "bg-primary-p15/40")}>
                <td className="h-[52px] pl-6">
                  <div className="flex items-center gap-2">
                    <Checkbox label={`Select ${row.date}`} checked={selected.has(row.date)} onChange={(on) => toggle(row.date, on)} />
                    {row.date}
                  </div>
                </td>
                <td>{formatNumber(row.requests)}</td>
                <td>{formatNumber(row.successful)}</td>
                <td>{formatNumber(row.failed)}</td>
                <td className="pr-6">{(row.avgMs / 1000).toFixed(2)} s</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 sm:px-6">
        {rows.length > PAGE_SIZE ? (
          <Pagination page={currentPage} pageCount={pageCount} pageSize={PAGE_SIZE} total={rows.length} onPage={setPage} />
        ) : (
          <span />
        )}
        <div className="flex flex-wrap items-center gap-[13px]">
          <span className="font-roboto text-[12px] text-n50" aria-live="polite">
            {copied ? "Copied to clipboard" : `${exportRows.length} ${exportRows.length === 1 ? "row" : "rows"}`}
          </span>
          <ExportButton label="Copy" icon="copy-outline" onClick={() => copy(toCsv(exportRows, "\t"))} />
          <ExportButton label=".csv" icon="upload" onClick={() => downloadFile("fetchwise-serp-statistics.csv", toCsv(exportRows, ","), "text/csv")} />
          <ExportButton label=".txt" icon="upload" onClick={() => downloadFile("fetchwise-serp-statistics.txt", toCsv(exportRows, "\t"), "text/plain")} />
        </div>
      </div>
    </div>
  );
}
