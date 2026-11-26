import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Mono, Space_Grotesk } from "next/font/google";
import { MotionConfig } from "motion/react";
import { LangProvider } from "@/components/providers/lang-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { IntroProvider } from "@/components/providers/intro-provider";
import { content } from "@/lib/content";
import "./globals.css";

// kgunes.com ile aynı fontlar: başlıklar Bricolage Grotesque, metin Space Grotesk.
// İkisi de latin-ext ile Türkçe karakterleri (ğ ş ı İ ç ö ü) içerir.
const display = Bricolage_Grotesque({ subsets: ["latin", "latin-ext"], variable: "--font-display", display: "swap" });
const sans = Space_Grotesk({ subsets: ["latin", "latin-ext"], variable: "--font-body", display: "swap" });
const mono = DM_Mono({ subsets: ["latin", "latin-ext"], variable: "--font-dm-mono", display: "swap", weight: ["400", "500"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://atriasense.com"),
  title: content.tr.meta.title,
  description: content.tr.meta.description,
  icons: { icon: "/img/emblem-96.webp" },
  openGraph: {
    title: content.tr.meta.title,
    description: content.tr.meta.description,
    images: ["/media/atria-intro-poster.jpg"],
    locale: "tr_TR",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#062045",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body>
        <MotionConfig reducedMotion="user">
          <LangProvider>
            <SmoothScroll>
              <IntroProvider>{children}</IntroProvider>
            </SmoothScroll>
          </LangProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
