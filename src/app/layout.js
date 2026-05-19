import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";
import SideBar from "../../components/SideBar";
import TopBar from "../../components/TopBar";
import { AuthProvider } from "@/context/AuthContext";

const syne = Syne({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const dmSans = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

export const metadata = {
  title: "Innerwave — Music for Every Wave",
  description: "Stream your favorite tracks, discover new artists and explore curated playlists.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable}`} data-scroll-behavior="smooth">
      <body>
        <AuthProvider>
          <div className="app-layout">
            <SideBar />
            <div className="main-content">
              <TopBar />
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}