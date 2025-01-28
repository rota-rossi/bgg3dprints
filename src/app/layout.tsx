import type { Metadata } from "next";
import { inter } from "../ui/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "3d Prints for boardgames",
  description: "3d Prints for boardgames",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter} ${inter.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
