import Link from "next/link";

import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import DarkLightMode from "./darkLightMode";
import TopMenu from "./topMenu";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "EUT",
  description: "EUT Component Page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${notoSansKR.variable}`}>
        <div className="navbar">
          <Link href="/" className="logo">
            CLT
          </Link>

          <TopMenu />

          <div className="nav-icon">
            <DarkLightMode />
            <Link href="/login">Login</Link>
          </div>
        </div>

        {children}
      </body>
    </html>
  );
}
