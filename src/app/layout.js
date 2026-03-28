import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export const metadata = {
  title: "Chasing Chaos, Series Bible",
  description:
    "A group of friends who met in recovery attempt to conquer the brutal Baja 1000, risking their money, relationships, and lives in the world's most unforgiving desert race.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <div className="app-layout">
          <Sidebar />
          <main className="main-content">{children}</main>
          <MobileNav />
        </div>
      </body>
    </html>
  );
}
