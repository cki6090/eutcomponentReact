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
          <div className="title-box">
            <div className="titleEng">Components</div>
            <div className="titleKor">컴포넌트</div>
          </div>
        </Link>
        <Link
          href="/layouts"
          className={pathname.startsWith("/layouts") ? "on" : ""}
        >
          <div className="title-box">
            <div className="titleEng">Layouts</div>
            <div className="titleKor">레이아웃</div>
          </div>
        </Link>

        <Link href="/QnA" className={pathname.startsWith("/QnA") ? "on" : ""}>
          <div className="title-box">
            <div className="titleEng">Contact us</div>
            <div className="titleKor">문의하기</div>
          </div>
        </Link>

        <Link
          href="/liveCode"
          className={pathname.startsWith("/QnA") ? "on" : ""}
        >
          <div className="title-box">
            <div className="titleEng">Test Live Code</div>
            <div className="titleKor">실시간 프리뷰</div>
          </div>
        </Link>
      </div>
    </div>
  );
}
