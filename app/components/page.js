"use client";
import LeftMenu from "@/app/leftMenu";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Components() {
  const [menuList, setMenuList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/menuList").then((res) => {
      setMenuList(res.data);
    });
  }, []);

  return (
    <div className="main-layout">
      <LeftMenu title="components" menuList={menuList} />

      <div className="main-content">
        <div className="components-list">
          {menuList.map((menu, index) => (
            <div key={index}>
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
