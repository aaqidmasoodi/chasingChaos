import "./globals.css";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import ToastContainer from "@/components/Toast";

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
          <main className="main-content">
            {children}
            <footer className="global-footer">
              Designed & Developed by{" "}
              <a
                href="https://aaqidmasoodi.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                Aaqid Masoodi
              </a>{" "}
              for Poolbeg Creations
            </footer>
          </main>
          <MobileNav />
        </div>
        <ToastContainer />
      </body>
    </html>
  );
}
