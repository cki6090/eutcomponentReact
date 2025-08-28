"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TopMenu() {
  const pathname = usePathname();

  return (
    <div className="top-menu">
      <div className="top-menu-list">
        <Link
          href="/components"
          className={pathname.startsWith("/components") ? "on" : ""}
        >
          Components
        </Link>
        <Link
          href="/layouts"
          className={pathname.startsWith("/layouts") ? "on" : ""}
        >
          Layouts
        </Link>
        <Link href="/QnA" className={pathname.startsWith("/QnA") ? "on" : ""}>
          Contact us
        </Link>
      </div>
    </div>
  );
}
