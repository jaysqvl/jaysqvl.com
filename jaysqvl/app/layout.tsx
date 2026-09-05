import type { Metadata } from "next";
import "@xyflow/react/dist/style.css";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/next"

export const metadata: Metadata = {
  title: "Jay Esquivel Jr. | Online Engineer",
  description: "Jay Esquivel Jr. is an Online Engineer at 2K working on backend and client, and builds open-source software and tools in his spare time.",
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: '32x32',
        type: 'image/x-icon',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          {children}
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
