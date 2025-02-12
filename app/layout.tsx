import "./globals.css";
import {Navigation} from "@/app/components/Navigation";

      export default function RootLayout({
        children,
      }: {
        children: React.ReactNode;
      }) {
        return (
          <html lang="en">
            <body className="antialiased body-color">
              <Navigation />
              <div className="ml-48 p-5">
                {children}
              </div>
            </body>
          </html>
        );
      }