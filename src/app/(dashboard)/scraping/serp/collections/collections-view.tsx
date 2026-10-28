"use client";

import { useMemo, useState } from "react";
import { Checkbox, Icon, Menu, Pagination, TextInput, cx } from "@/components/ui";

type Collection = {
  id: number;
  name: string;
  target: string;
  requests: number;
  nextRun: string;
  delivery: string;
  enabled: boolean;
};

const INITIAL: Collection[] = [
  { id: 1, name: "Pizza places NYC", target: "Google Search", requests: 1240, nextRun: "Oct 30, 2026", delivery: "Webhook", enabled: true },
  { id: 2, name: "Running shoes", target: "Google Shopping", requests: 860, nextRun: "Oct 30, 2026", delivery: "Email", enabled: false },
  { id: 3, name: "Competitor pricing", target: "Google Shopping", requests: 4310, nextRun: "Oct 31, 2026", delivery: "Amazon S3", enabled: true },
  { id: 4, name: "Hotel deals Paris", target: "Google Search", requests: 312, nextRun: "Nov 1, 2026", delivery: "Webhook", enabled: true },
  { id: 5, name: "Coffee machines", target: "Bing Search", requests: 0, nextRun: "Nov 2, 2026", delivery: "Email", enabled: false },
  { id: 6, name: "Brand keywords", target: "Google Search", requests: 15890, nextRun: "Oct 30, 2026", delivery: "Google Cloud", enabled: true },
  { id: 7, name: "Electric bikes", target: "Google Images", requests: 97, nextRun: "Nov 3, 2026", delivery: "Webhook", enabled: false },
  { id: 8, name: "Laptop reviews", target: "Bing Search", requests: 2205, nextRun: "Nov 4, 2026", delivery: "Amazon S3", enabled: true },
  { id: 9, name: "Local plumbers", target: "Google Search", requests: 48, nextRun: "Nov 5, 2026", delivery: "Email", enabled: false },
  { id: 10, name: "Vegan recipes", target: "Google Search", requests: 730, nextRun: "Nov 6, 2026", delivery: "Webhook", enabled: true },
  { id: 11, name: "Concert tickets", target: "Google Search", requests: 5120, nextRun: "Nov 7, 2026", delivery: "Google Cloud", enabled: true },
];

const PAGE_SIZE = 5;
const FILTERS = ["All", "Active"] as const;
type Filter = (typeof FILTERS)[number];
const ACTIONS = ["Run now", "Duplicate", "Delete"] as const;

const headCell = "h-10 text-left font-poppins text-[10px] font-normal uppercase leading-[12px] tracking-[1px] whitespace-nowrap text-n50";

export function CollectionsView() {
  const [collections, setCollections] = useState(INITIAL);
  const [filter, setFilter] = useState<Filter>("All");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [notice, setNotice] = useState("");

  const visible = useMemo(
    () =>
      collections.filter(
        (item) => (filter === "All" || item.enabled) && item.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [collections, filter, search],
  );
  const pageCount = Math.max(1, Math.ceil(visible.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const rows = visible.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const allSelected = rows.length > 0 && rows.every((row) => selected.has(row.id));
  const someSelected = rows.some((row) => selected.has(row.id));

  const update = (id: number, patch: Partial<Collection>) =>
    setCollections((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));

  const toggleSelected = (id: number, on: boolean) =>
    setSelected((current) => {
      const next = new Set(current);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const nextId = () => Math.max(0, ...collections.map((item) => item.id)) + 1;

  const runAction = (item: Collection, action: (typeof ACTIONS)[number]) => {
    if (action === "Run now") {
      update(item.id, { requests: item.requests + 1 });
      setNotice(`Started a run for “${item.name}”.`);
    } else if (action === "Duplicate") {
      setCollections((current) => {
        const index = current.findIndex((entry) => entry.id === item.id);
        const copy = { ...item, id: nextId(), name: `${item.name} (copy)`, requests: 0, enabled: false };
        return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)];
      });
      setNotice(`Duplicated “${item.name}”.`);
    } else {
      setCollections((current) => current.filter((entry) => entry.id !== item.id));
      toggleSelected(item.id, false);
      setNotice(`Deleted “${item.name}”.`);
    }
  };

  const createCollection = () => {
    const created: Collection = { id: nextId(), name: "Untitled collection", target: "Google Search", requests: 0, nextRun: "Not scheduled", delivery: "Webhook", enabled: false };
    setCollections((current) => [created, ...current]);
    setFilter("All");
    setSearch("");
    setPage(1);
    setNotice("Created “Untitled collection”.");
  };

  return (
    <section className="flex flex-col gap-[26px] rounded-[6px] bg-white pt-6" aria-labelledby="collections-title">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-6">
        <h2 id="collections-title" className="font-poppins text-[18px] font-medium leading-[36px] text-ink">
          My collections
        </h2>
        <button
          type="button"
          onClick={createCollection}
          className="flex h-8 cursor-pointer items-center justify-center rounded-[6px] bg-primary-p99 px-4 font-poppins text-[14px] font-medium leading-[28px] text-white hover:bg-primary-strong"
        >
          Create collection
        </button>
      </div>

      <div role="tablist" aria-label="Collection filter" className="flex gap-8 border-b border-n20 px-4 sm:px-6">
        {FILTERS.map((option) => {
          const active = option === filter;
          return (
            <button
              key={option}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => {
                setFilter(option);
                setPage(1);
              }}
              className={cx(
                "relative flex h-10 cursor-pointer items-center px-4 py-1.5 font-poppins text-[14px] font-medium leading-[28px]",
                active ? "text-primary" : "text-neutral hover:text-primary",
              )}
            >
              {option}
              {active && <span className="absolute inset-x-0 -bottom-px h-0.5 bg-primary" />}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap items-center gap-[15px] px-4 sm:px-6">
        <TextInput
          icon="search"
          aria-label="Search by name"
          placeholder="Search by name"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setPage(1);
          }}
          className="w-full sm:w-[284px] [&_input]:h-[34px]"
        />
        <p className="font-poppins text-[10px] uppercase leading-[12px] tracking-[1px] text-n80">
          Total {visible.length} {visible.length === 1 ? "collection" : "collections"}
        </p>
        <p className="font-roboto text-[12px] text-n50 sm:ml-auto" aria-live="polite">
          {notice}
        </p>
      </div>

      <div className="flex flex-col">
        <div className="scroll-light relative overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse">
            <thead>
              <tr className="border-b border-n20">
                <th scope="col" className={cx(headCell, "w-[265px] pl-6")}>
                  <div className="flex items-center gap-1">
                    <Checkbox
                      label="Select all collections on this page"
                      checked={allSelected}
                      indeterminate={!allSelected && someSelected}
                      onChange={(on) => rows.forEach((row) => toggleSelected(row.id, on))}
                    />
                    <Icon name="header-chevron" size={12} />
                    <span className="ml-1">Name</span>
                  </div>
                </th>
                <th scope="col" className={cx(headCell, "w-[120px]")}>Target</th>
                <th scope="col" className={cx(headCell, "w-[135px]")}>Requests</th>
                <th scope="col" className={cx(headCell, "w-[141px]")}>Next run</th>
                <th scope="col" className={cx(headCell, "w-[183px]")}>Delivery</th>
                <th scope="col" className={cx(headCell, "pr-6")}>
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item, index) => (
                <tr key={item.id} className={cx("border-b border-n20 font-roboto text-[14px] text-neutral", selected.has(item.id) && "bg-primary-p15/40")}>
                  <td className="h-16 pl-6">
                    <div className="flex items-center gap-1">
                      <Checkbox large label={`Select ${item.name}`} checked={selected.has(item.id)} onChange={(on) => toggleSelected(item.id, on)} />
                      <span className="truncate leading-[26px]">{item.name}</span>
                    </div>
                  </td>
                  <td className="leading-[20px] whitespace-nowrap">{item.target}</td>
                  <td className="leading-[20px]">{item.requests.toLocaleString("en-US")}</td>
                  <td className="leading-[20px] whitespace-nowrap">
                    {item.enabled ? item.nextRun : <span className="text-n50">Paused</span>}
                  </td>
                  <td className="leading-[20px] whitespace-nowrap">
                    <span className="flex items-center gap-1.5">
                      <Icon name="delivery" />
                      {item.delivery}
                    </span>
                  </td>
                  <td className="pr-6">
                    <div className="flex items-center justify-end gap-2.5">
                      <Menu
                        label={`Actions for ${item.name}`}
                        options={ACTIONS}
                        onSelect={(action) => runAction(item, action)}
                        up={index >= rows.length - 2 && rows.length > 2}
                        triggerClassName="flex h-8 cursor-pointer items-center gap-2 rounded-[6px] px-4 font-roboto text-[14px] leading-[26px] text-neutral hover:bg-n04"
                        trigger={
                          <>
                            Actions
                            <Icon name="chevron-down-actions" />
                          </>
                        }
                      />
                      <button
                        type="button"
                        onClick={() => update(item.id, { enabled: !item.enabled })}
                        className={cx(
                          "flex h-8 w-[105px] cursor-pointer items-center justify-center gap-1 rounded-[6px] px-4 font-poppins text-[14px] font-medium leading-[28px] transition-colors",
                          item.enabled
                            ? "border border-primary text-primary hover:bg-primary-p15"
                            : "bg-primary-p99 text-white hover:bg-primary-strong",
                        )}
                      >
                        <Icon name={item.enabled ? "pause" : "play"} />
                        {item.enabled ? "Disable" : "Enable"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={6} className="h-24 text-center font-roboto text-[14px] text-n50">
                    No collections match “{search}”.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <Pagination page={currentPage} pageCount={pageCount} pageSize={PAGE_SIZE} total={visible.length} onPage={setPage} />
      </div>
    </section>
  );
}
