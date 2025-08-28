"use client";
import LeftMenu from "../leftMenu";
import Link from "next/link";
import { menuLayoutList } from "./data";

export default function Layouts() {
  return (
    <div className="main-layout">
      <LeftMenu title="layouts" menuList={menuLayoutList} />

      <div className="main-content">
        <div className="components-list">
          {menuLayoutList.map((menu, index) => (
            <div
              key={index}
              style={{
                backgroundImage: `url(${menu.image})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                "--time": index,
              }}
            >
              <Link href={`/layouts/${menu.link}`}>
                <div className="components-list-title">{menu.title}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
