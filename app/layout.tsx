import type { Metadata } from "next";
import "./styles/globals.css";

export const metadata: Metadata = {
  title: "GENEROUS Entertainments",
  description: "Film distribution, acquisition, localization and production infrastructure deck.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
