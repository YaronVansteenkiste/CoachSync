'use client'
import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { MobileNavi } from "@/components/home/mobile-navigation";
import { usePathname } from 'next/navigation';
import { Navigation } from "@/components/home/desktop-navigation";

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
      setIsMobile(window.innerWidth < 950);
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
            {children}
          </ThemeProvider>
            <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500 opacity-30 rounded-full blur-3xl z-[-1]"></div>
            <div className="absolute top-1/3 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500 opacity-30 rounded-full blur-3xl z-[-1]"></div>
            <div className="absolute bottom-1/4 left-1/3 w-48 h-48 sm:w-96 sm:h-96 bg-red-500 opacity-30 rounded-full blur-3xl z-[-1]"></div>
        </div>

      </body>
    </html>
  );
}