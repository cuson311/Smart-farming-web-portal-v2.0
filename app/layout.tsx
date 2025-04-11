import type React from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { cn } from "@/lib/utils";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/common/header";
import Footer from "@/components/common/footer";
import { Provider } from "@/context/ContextLanguage";
import { cookies } from "next/headers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Irrigation Management Portal",
  description: "Manage your irrigation scripts and models",
  generator: "v0.dev",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  async function getLocaleFromCookies(): Promise<string> {
    const lang = await cookies()?.get("lang")?.value;
    return lang ?? "vi";
  }
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          inter.className
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Provider
            value={{ locale: await getLocaleFromCookies(), languages: null }}
          >
            <Header />
            {children}
            <Footer />
            <Toaster />
          </Provider>
        </ThemeProvider>
      </body>
    </html>
  );
}
