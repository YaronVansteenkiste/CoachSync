import "./globals.css";
      import {Navigation} from "@/app/components/Navigation";

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode;
      }) {
        return (
          <html lang="en">
            <body className="antialiased bg-primary text-white">
              <Navigation />
              <div className="ml-48 children-container flex flex-col h-screen p-10">
                {children}
              </div>
            </body>
          </html>
        );
      }