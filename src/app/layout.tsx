import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Trusted AI for a New Digital India | Arsenal & Cisco",
  description: "Exclusive Event Registration - 18 September 2026 | Le Meridien Delhi",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-[#f3efe6] text-slate-900 font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
