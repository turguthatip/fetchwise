import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION } from "@/lib/site";

export const alt = "fetchwise — web scraping dashboard";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#0d0f10",
          color: "#fff",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "28px" }}>
          <svg width="120" height="120" viewBox="0 0 32 32">
            <defs>
              <linearGradient id="g" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop stopColor="#2997FF" />
                <stop offset="1" stopColor="#00F0D3" />
              </linearGradient>
            </defs>
            <rect width="32" height="32" rx="8" fill="url(#g)" />
            <path d="M21 9.5h-2.4c-2.3 0-3.6 1.4-3.6 3.7V24" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <path d="M11 16h7.5" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <path d="M19.6 6.6 22.5 9.5l-2.9 2.9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            <circle cx="22.5" cy="22.5" r="2" fill="#fff" fillOpacity="0.75" />
          </svg>
          <div style={{ display: "flex", fontSize: "96px" }}>
            <span>fetch</span>
            <span style={{ color: "#00F0D3", marginLeft: "-14px" }}>wise</span>
          </div>
        </div>
        <div style={{ marginTop: "48px", fontSize: "36px", lineHeight: 1.35, color: "#b0c1d1", maxWidth: "980px" }}>
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    size,
  );
}
