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
        url: '/brand/je-rounded-v1.ico',
        sizes: '16x16 32x32 48x48',
        type: 'image/x-icon',
      },
      {
        url: '/brand/je-rounded-v1.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
    apple: [{ url: '/brand/apple-touch-icon-je-v1.png', sizes: '180x180', type: 'image/png' }],
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
