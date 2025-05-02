import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Today's Mission",
  description: "今日のミッションを上手に管理して、素敵な1日にしよう!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
