"use client";

import { useRef, useState } from "react";
import "./legocode.css";
import { headerContents, mainContents, footerContents } from "./data";

function toHtml(code) {
  return code.trim().replace(/className=/g, "class=");
}

function hasLayout(el) {
  return ["header", "main", "footer"].every((tag) => el?.querySelector(`:scope > ${tag}`));
}

function getZone(target) {
  if (!target?.closest(".main-content")) return null;
  if (target.closest("header") || target.closest(".search-pnl")) return "header";
  if (target.closest("main") || target.closest(".main-section")) return "main";
  if (target.closest("footer") || target.closest(".footer-menu ul li")) return "footer";
  return null;
}

function getFooterLiKey(target, clientX) {
  const ul = target.closest(".footer-menu ul");
  if (!ul) return null;

  const li = target.closest(".footer-menu ul li");
  if (li) {
    const lis = ul.querySelectorAll(":scope > li");
    const index = Array.from(lis).indexOf(li);
    return index === 0 ? "footerLeft" : index === 1 ? "footerRight" : null;
  }

  const rect = ul.getBoundingClientRect();
  return clientX < rect.left + rect.width / 2 ? "footerLeft" : "footerRight";
}

export default function Legocode() {
  const mainRef = useRef(null);
  const [html, setHtml] = useState({
    header: "",
    main: "",
    footerLeft: "",
    footerRight: "",
  });

  const onDragStart = (e, item) => {
    e.dataTransfer.setData("text/plain", JSON.stringify(item));
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!hasLayout(mainRef.current)) {
      alert("main-content 안에 header, main, footer가 필요합니다.");
      return;
    }

    const zone = getZone(e.target);
    if (!zone) return;

    const item = JSON.parse(e.dataTransfer.getData("text/plain"));
    if (item.zone !== zone) {
      alert(`zone 불일치 (${item.zone} → ${zone})`);
      return;
    }

    const code = toHtml(item.code);

    if (zone === "header") {
      setHtml((prev) => ({ ...prev, header: prev.header + code }));
      return;
    }

    if (zone === "main") {
      setHtml((prev) => ({ ...prev, main: prev.main + code }));
      return;
    }

    const liKey = getFooterLiKey(e.target, e.clientX);
    if (!liKey) return;

    setHtml((prev) => ({ ...prev, [liKey]: prev[liKey] + code }));
  };

  const onDragOver = (e) => e.preventDefault();

  return (
    <>
      <div className="legocode-page">
        <div className="legocode-page-component-list">
          <div className="legocode-page-component-list-title">헤더</div>
          {headerContents.map((component, i) => (
            <div
              className="legocode-component-item"
              key={`header-${i}`}
              draggable
              onDragStart={(e) => onDragStart(e, component)}
            >
              <div>{component.title}</div>
            </div>
          ))}

          <div className="legocode-page-component-list-title">메인</div>
          {mainContents.map((component, i) => (
            <div
              className="legocode-component-item"
              key={`main-${i}`}
              draggable
              onDragStart={(e) => onDragStart(e, component)}
            >
              <div>{component.title}</div>
            </div>
          ))}

          <div className="legocode-page-component-list-title">푸터</div>
          {footerContents.map((component, i) => (
            <div
              className="legocode-component-item"
              key={`footer-${i}`}
              draggable
              onDragStart={(e) => onDragStart(e, component)}
            >
              <div>{component.title}</div>
            </div>
          ))}
        </div>

        <div className="legocode-page-legoZone">
          <div className="main-layout">
            <div className="main-content" ref={mainRef} onDrop={onDrop} onDragOver={onDragOver}>
              <header>
                <div
                  className="search-pnl"
                  dangerouslySetInnerHTML={{ __html: html.header }}
                />
              </header>

              <main>
                <div className="main-section">
                  <h1>메인 영역</h1>
                  <p>이곳은 메인 콘텐츠가 들어갑니다.</p>
                  <div dangerouslySetInnerHTML={{ __html: html.main }} />
                </div>
              </main>

              <footer>
                <div className="footer-menu">
                  <ul>
                    <li dangerouslySetInnerHTML={{ __html: html.footerLeft }}></li>
                    <li dangerouslySetInnerHTML={{ __html: html.footerRight }}></li>
                  </ul>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
