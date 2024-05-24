import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { QueryProvider } from "@/providers/query-provider";

export const metadata: Metadata = {
  title: "Anonify",
  description: "  Secure and Anonymous Messaging",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <link rel='icon' href='/logo.svg' sizes='any' />
      <body className={`dark font-raleway antialiased`}>
        <QueryProvider>{children}</QueryProvider>
        <Toaster richColors theme='dark' position='top-center' />
      </body>
    </html>
  );
}
