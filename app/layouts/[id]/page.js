"use client";
import LeftMenu from "@/app/leftMenu";
import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";

export default function Layouts() {
  const [layoutList, setLayoutList] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3001/layoutList").then((res) => {
      setLayoutList(res.data);
    });
  }, []);

  return (
    <div className="main-layout">
      <LeftMenu title="layouts" menuList={layoutList} />

      <div className="main-content">
        <div className="wrap">
          <div className="search-pnl">서치 리스트</div>

          <div className="main">
            <div className="main-content">콘텐츠</div>
          </div>

          <div className="footer">
            <div className="footer-content"></div>
            <ul className="footer-menu">
              <li>
                <button className="mainBtn">메인</button>
                <button className="subBtn">서브</button>
                <button className="ssubBtn">서브서브</button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
