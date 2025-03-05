'use client'
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Navigation } from "@/app/components/Navigation";
import { MobileNavi } from "@/app/components/MobileNavigation";
import { SessionProvider } from "next-auth/react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 920);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-dark text-white">
        {isMobile ? <MobileNavi /> : <Navigation />}
        <div className={isMobile ? "w-full bg-dark mb-44 p-4" : "ml-48 children-container flex flex-col p-10 min-h-screen"}>
            <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
            >
            <SessionProvider>
              {children}
            </SessionProvider>
            </ThemeProvider>
        </div>
      </body>
    </html>
  );
}