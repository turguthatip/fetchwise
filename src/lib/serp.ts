import type { Language } from "@/components/code-panel";

export const TARGETS = [
  { label: "Google search", value: "google_search" },
  { label: "Google shopping", value: "google_shopping_search" },
  { label: "Google images", value: "google_images" },
  { label: "Bing search", value: "bing_search" },
] as const;

export const LOCALES = ["English", "German", "French", "Spanish", "Lithuanian", "Japanese"] as const;
export const LOCATIONS = ["United States", "United Kingdom", "Germany", "France", "Spain", "Japan"] as const;
export const DOMAINS = [".com", ".co.uk", ".de", ".fr", ".es", ".co.jp"] as const;
export const DEVICES = ["Desktop", "Desktop Chrome", "Desktop Firefox", "Mobile", "Mobile Android", "Mobile iOS"] as const;
export const TBM_OPTIONS = ["", "isch (images)", "nws (news)", "shop (shopping)", "vid (videos)"] as const;

export type SerpParams = {
  target: string;
  query: string;
  locale: string;
  geo: string;
  domain: string;
  device: string;
  pageFrom: number;
  numPages: number;
  resultsLanguage: string;
  tbs: string;
  tbm: string;
  parse: boolean;
  autocorrect: boolean;
  saveSearch: boolean;
};

export const DEFAULT_PARAMS: SerpParams = {
  target: "google_search",
  query: "Pizza",
  locale: "English",
  geo: "United States",
  domain: ".com",
  device: "Desktop",
  pageFrom: 1,
  numPages: 10,
  resultsLanguage: "English",
  tbs: "",
  tbm: "",
  parse: true,
  autocorrect: true,
  saveSearch: true,
};

const LOCALE_CODES: Record<string, string> = {
  English: "en",
  German: "de",
  French: "fr",
  Spanish: "es",
  Lithuanian: "lt",
  Japanese: "ja",
};

const ENDPOINT = "https://scraper-api.fetchwise.io/v2/scrape";
const BATCH_ENDPOINT = "https://scraper-api.fetchwise.io/v2/task/batch";

export function buildPayload(params: SerpParams) {
  const payload: Record<string, string | number | boolean> = {
    target: params.target,
    query: params.query,
    locale: LOCALE_CODES[params.locale] ?? "en",
    geo: params.geo,
    domain: params.domain.replace(/^\./, ""),
    device_type: params.device.toLowerCase().replace(/ /g, "_"),
    page_from: params.pageFrom,
    num_pages: params.numPages,
    google_results_language: LOCALE_CODES[params.resultsLanguage] ?? "en",
    parse: params.parse,
    google_nfpr: !params.autocorrect,
    google_save_search: params.saveSearch,
  };
  if (params.tbs) payload.google_tbs = params.tbs;
  if (params.tbm) payload.google_tbm = params.tbm.split(" ")[0];
  return payload;
}

export function buildRequest(params: SerpParams, language: Language, batch = false) {
  const url = batch ? BATCH_ENDPOINT : ENDPOINT;
  const payload = buildPayload(params);
  const json = JSON.stringify(batch ? { ...payload, query: [payload.query] } : payload, null, 2);
  const indented = (spaces: number) => json.split("\n").join(`\n${" ".repeat(spaces)}`);

  if (language === "Node") {
    return [
      `const response = await fetch("${url}", {`,
      `  method: "POST",`,
      `  headers: {`,
      `    "Content-Type": "application/json",`,
      `    "Authorization": "Basic <YOUR_API_TOKEN>"`,
      `  },`,
      `  body: JSON.stringify(${indented(2)})`,
      `});`,
      ``,
      `console.log(await response.json());`,
    ].join("\n");
  }
  if (language === "Python") {
    return [
      `import requests`,
      ``,
      `payload = ${json.replace(/: true/g, ": True").replace(/: false/g, ": False")}`,
      ``,
      `response = requests.post(`,
      `    "${url}",`,
      `    json=payload,`,
      `    headers={"Authorization": "Basic <YOUR_API_TOKEN>"},`,
      `)`,
      `print(response.json())`,
    ].join("\n");
  }
  return [
    `curl --request POST \\`,
    `  --url ${url} \\`,
    `  --header 'Content-Type: application/json' \\`,
    `  --header 'Authorization: Basic <YOUR_API_TOKEN>' \\`,
    `  --data '${indented(2)}'`,
  ].join("\n");
}

export type SerpResult = { pos: number; url: string; title: string; desc: string };

function capitalize(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function slug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "search";
}

/** Deterministic, made-up organic results for a query. */
export function mockResults(query: string): SerpResult[] {
  const q = query.trim() || "search";
  const s = slug(q);
  const title = capitalize(q);
  return [
    { pos: 1, url: `https://www.${s}hub.com/`, title: `${title} Hub | Delivery & Pickup Near You`, desc: `Discover classic and new ${q.toLowerCase()} picks, find deals and order for delivery or pickup in minutes.` },
    { pos: 2, url: `https://www.cityguide.example/best-${s}`, title: `The 25 Best ${title} Spots, Ranked`, desc: `Our editors tasted, tested and ranked the best ${q.toLowerCase()} in town so you don't have to.` },
    { pos: 3, url: `https://en.wikipedia.org/wiki/${encodeURIComponent(title.replace(/ /g, "_"))}`, title: `${title} - Wikipedia`, desc: `${title} is a topic with a long history. Learn about its origins, variations and cultural impact.` },
    { pos: 4, url: `https://www.recipes.example/${s}`, title: `How to Make ${title} at Home`, desc: `A step-by-step guide with tips, common mistakes and a printable checklist.` },
    { pos: 5, url: `https://www.reviews.example/${s}`, title: `${title} Reviews 2026 - Honest Ratings`, desc: `Thousands of verified reviews and ratings to help you choose the right ${q.toLowerCase()}.` },
  ];
}

export function buildResponse(params: SerpParams, taskId: string) {
  const code = LOCALE_CODES[params.locale] ?? "en";
  const host = `https://www.google${params.domain}`;
  const url = `${host}/search?q=${encodeURIComponent(params.query.toLowerCase())}&lr=lang_${code}&nfpr=${params.autocorrect ? 0 : 1}&gl=${code === "en" ? "us" : code}&hl=${code}`;
  const response = [
    {
      task_id: taskId,
      content: {
        url,
        page: params.pageFrom,
        results: params.parse ? { organic: mockResults(params.query) } : undefined,
        html: params.parse ? undefined : "<!doctype html><html>…</html>",
      },
      status_code: 200,
    },
  ];
  return JSON.stringify(response, null, 2);
}
