"use client";
import LeftMenu from "../leftMenu";
import Link from "next/link";
import { menuComponentList } from "./data";

export default function Components() {
  return (
    <div className="main-layout">
      <LeftMenu title="components" menuList={menuComponentList} />

      <div className="main-content">
        <div className="components-list">
          {menuComponentList.map((menu, index) => (
            <div
              key={index}
              style={{
                backgroundImage: `url(${menu.image})`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            >
              <Link href={`/components/${menu.link}`}>
                <div className="components-list-title">{menu.title}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
