import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "tattoo artist | inkpauline",
  description: "Vienna/Amsterdam based tattoo artist",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
