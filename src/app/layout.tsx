import { cn } from "@/lib/utils";
import { TRPCProvider } from "@/trpc/client";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { fontGeist } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    template: "%s | Mollo",
    default: "Build portfolio websites in Minutes - Mollo",
  },
  description:
    "Mollo lets you Build and Deploy Personalized Portfolio websites in minutes.",
  icons: [
    {
      rel: "icon",
      url: "/logo.png",
    },
    {
      rel: "icon",
      type: "image/x-icon",
      url: "/favicon.ico",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SessionProvider>
      <TRPCProvider>
        <html lang="en">
          <body
            className={cn(
              `antialiased flex flex-col min-h-screen relative`,
              fontGeist.className
            )}
          >
            {children}
          </body>
        </html>
      </TRPCProvider>
    </SessionProvider>
  );
}
