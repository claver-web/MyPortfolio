import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/Toaster";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Portfolio — Engineer & AI Specialist",
    template: "%s | Portfolio",
  },
  description:
    "Production-grade portfolio showcasing full-stack engineering, autonomous agentic AI systems, and modern software architecture.",
  keywords: ["Software Engineer", "Full Stack", "Agentic AI", "Next.js", "TypeScript", "Prisma"],
  authors: [{ name: "Portfolio Author" }],
  creator: "Portfolio Author",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio.local",
    title: "Portfolio — Engineer & AI Specialist",
    description: "Production-grade portfolio showcasing full-stack engineering and autonomous AI systems.",
    siteName: "Engineering Portfolio",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Portfolio — Engineer & AI Specialist",
    description: "Production-grade portfolio showcasing full-stack engineering and autonomous AI systems.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-sans antialiased bg-background text-foreground bg-noise min-h-screen">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
