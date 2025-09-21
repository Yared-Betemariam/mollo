import { cn } from "@/lib/utils";
import { TRPCProvider } from "@/trpc/client";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import { fontGeist } from "@/lib/fonts";

export const metadata: Metadata = {
  title: {
    template: "%s | Mollo",
    default: "Build portfolio websites in minutes - Mollo",
  },
  description: "",
  icons: [
    {
      rel: "icon",
      url: "/logo.png",
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
