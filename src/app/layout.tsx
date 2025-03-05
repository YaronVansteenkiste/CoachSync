'use client'
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Navigation } from "@/app/components/Navigation";
import { MobileNavi } from "@/app/components/MobileNavigation";
import { SessionProvider } from "next-auth/react";
import { usePathname } from 'next/navigation';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  const [showNavBar, setShowNavBar] = useState(true);

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

  useEffect(() => {
    if (pathname === '/auth/login' || pathname === '/auth/register') {
      setShowNavBar(false);
    } else {
      setShowNavBar(true);
    }
  }, [pathname]);

  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-dark text-white">
        {showNavBar && (isMobile ? <MobileNavi /> : <Navigation />)}
        <div className={showNavBar ? (isMobile ? "w-full bg-dark mb-44 p-4" : "ml-48 children-container flex flex-col p-10 min-h-screen") : "w-full bg-dark p-4"}>
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