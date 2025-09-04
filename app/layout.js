import Link from "next/link";

import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import DarkLightMode from "./darkLightMode";
import TopMenu from "./topMenu";
import LoginBtn from "./loginbtn";
import MenuItem from "./MenuItem";

const notoSansKR = Noto_Sans_KR({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "EUT Component Page",
  description: "EUT Component Page",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${notoSansKR.variable}`}>
        <Providers>
          <div className="navbar">
            <div className="MenuButtonBox">
              <MenuItem />

              <Link href="/" className="logo">
                LOGO
              </Link>
            </div>

            <TopMenu />

            <div className="nav-icon">
              <DarkLightMode />
              <LoginBtn />
            </div>
          </div>

          {children}
        </Providers>
      </body>
    </html>
  );
}
