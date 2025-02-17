import { ThemeProvider } from "next-themes";
import "./globals.css";
import { Navigation } from "@/app/components/Navigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-primary text-white">
        <Navigation />
        <div className="ml-48 children-container flex flex-col p-10">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
          {children}
        </ThemeProvider>
        </div>
      </body>
    </html>
  );
}
