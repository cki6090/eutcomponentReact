"use client";
import LeftMenu from "@/app/leftMenu";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Components() {
  const [layoutList, setLayoutList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/menuLayoutList").then((res) => {
      setLayoutList(res.data);
    });
  }, []);

  return (
    <div className="main-layout">
      <LeftMenu title="layouts" menuList={layoutList} />

      <div className="main-content">
        <div className="components-list">
          {layoutList.map((layout, index) => (
            <div key={index}>
              <Link href={`/layouts/${layout.link}`}>
                <div className="components-list-title">{layout.title}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
