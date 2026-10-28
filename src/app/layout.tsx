import type { Metadata } from "next";
import { Poppins, Roboto, Roboto_Mono } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins-family",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const roboto = Roboto({
  variable: "--font-roboto-family",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono-family",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "fetchwise",
    template: "%s · fetchwise",
  },
  description:
    "fetchwise dashboard: scraping APIs, collections, statistics and Site Unblocker in one place.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} ${roboto.variable} ${robotoMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
