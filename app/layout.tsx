import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FanzaScroll — サンプル動画をスワイプして探す",
  description:
    "TikTokのようにスワイプするだけで、FANZAのサンプル動画を次々と楽しめるサービス。気に入った作品はそのまま購入できます。",
  keywords: ["FANZA", "動画", "アダルト", "サンプル", "スワイプ", "アフィリエイト"],
  openGraph: {
    title: "FanzaScroll — サンプル動画をスワイプして探す",
    description: "スワイプするだけで次々と動画が流れる。気に入ったらそのまま購入。",
    type: "website",
    locale: "ja_JP",
    url: "https://fanza-scroll.vercel.app",
  },
  twitter: {
    card: "summary_large_image",
    title: "FanzaScroll — サンプル動画をスワイプして探す",
    description: "スワイプするだけで次々と動画が流れる。気に入ったらそのまま購入。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
