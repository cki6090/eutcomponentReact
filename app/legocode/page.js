"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import "./legocode.css";
import { headerContents, mainSectionContents, mainContents, footerContents } from "./data";
import ToastPopup from "./toastPopup";

function changeToHtml(code) {
  const trimmedCode = code.trim();
  return trimmedCode.replace(/className=/g, "class=");
}

function checkLayout(mainContentElement) {
  if (!mainContentElement) return false;

  const hasHeader = mainContentElement.querySelector(":scope > header");
  const hasMain = mainContentElement.querySelector(":scope > main");
  const hasFooter = mainContentElement.querySelector(":scope > footer");

  return hasHeader && hasMain && hasFooter;
}

// 드롭 시 실제 마우스 아래 요소 찾기 (event.target이 부정확할 때 대비)
function getDropTarget(event, mainContentElement) {
  const elements = document.elementsFromPoint(event.clientX, event.clientY);

  for (const element of elements) {
    if (mainContentElement?.contains(element)) {
      return element;
    }
  }

  return event.target;
}

// header / footer zone 찾기
function findDropZone(dropTarget) {
  if (!dropTarget.closest(".main-content")) return null;

  if (dropTarget.closest("header") || dropTarget.closest(".search-pnl")) {
    return "header";
  }

  if (dropTarget.closest("footer") || dropTarget.closest(".footer-menu")) {
    return "footer";
  }

  return null;
}

// main-section 영역인지 확인
function isMainSectionArea(dropTarget) {
  return Boolean(dropTarget.closest("main") || dropTarget.closest(".main-section"));
}

// table tbody > tr 영역인지 확인
function isTableRowArea(dropTarget) {
  return Boolean(
    dropTarget.closest(".main-section .main-section-Column-Item .table-pnl table tbody tr") ||
      dropTarget.closest(".main-section .main-section-Column-Item .table-pnl table tbody") ||
      dropTarget.closest(".main-section .main-section-Column-Item .table-pnl table") ||
      dropTarget.closest(".main-section .main-section-Column-Item .table-pnl")
  );
}

// 드롭한 tr 찾기 (tr, td, th, tbody, table 위 모두 대응)
function findTableRow(mainContentElement, dropTarget) {
  const row = dropTarget.closest(
    ".main-section .main-section-Column-Item .table-pnl table tbody tr"
  );
  if (row) return row;

  const tbody = dropTarget.closest(
    ".main-section .main-section-Column-Item .table-pnl table tbody"
  );
  if (tbody) return tbody.querySelector("tr");

  const table = dropTarget.closest(
    ".main-section .main-section-Column-Item .table-pnl table"
  );
  if (table) return table.querySelector("tbody tr");

  return null;
}

// 몇 번째 tbody의 몇 번째 tr인지 key 생성 (예: "0-0")
function findRowKey(mainContentElement, dropTarget) {
  const row = findTableRow(mainContentElement, dropTarget);
  if (!row) return null;

  const tbody = row.closest("tbody");
  if (!tbody) return null;

  const allTbodies = mainContentElement.querySelectorAll(
    ".main-section .main-section-Column-Item .table-pnl table tbody"
  );
  const tbodyIndex = Array.from(allTbodies).indexOf(tbody);
  if (tbodyIndex < 0) return null;

  const allRows = tbody.querySelectorAll(":scope > tr");
  const rowIndex = Array.from(allRows).indexOf(row);
  if (rowIndex < 0) return null;

  return `${tbodyIndex}-${rowIndex}`;
}

function findFooterSlot(dropTarget, mouseX) {
  const ul = dropTarget.closest(".footer-menu ul");
  if (!ul) return null;

  const droppedLi = dropTarget.closest(".footer-menu ul li");

  if (droppedLi) {
    const firstLi = ul.querySelector("li:first-child");
    const lastLi = ul.querySelector("li:last-child");

    if (droppedLi === firstLi) return "footerLeft";
    if (droppedLi === lastLi) return "footerRight";
    return null;
  }

  const ulBox = ul.getBoundingClientRect();
  const ulCenterX = ulBox.left + ulBox.width / 2;

  if (mouseX < ulCenterX) return "footerLeft";
  return "footerRight";
}

// main-section 구조 + tr 안에 넣은 내용 합치기
function buildMainSectionHtml(mainSectionHtml, mainRowHtml) {
  if (!mainSectionHtml) return "";

  const container = document.createElement("div");
  container.innerHTML = mainSectionHtml;

  const tbodies = container.querySelectorAll(
    ".main-section-Column-Item .table-pnl table tbody"
  );

  tbodies.forEach((tbody, tbodyIndex) => {
    const rows = tbody.querySelectorAll(":scope > tr");

    rows.forEach((row, rowIndex) => {
      const rowKey = `${tbodyIndex}-${rowIndex}`;
      const cellHtml = mainRowHtml[rowKey];

      if (cellHtml) {
        row.insertAdjacentHTML("beforeend", cellHtml);
      }
    });
  });

  return container.innerHTML;
}

const componentGroups = [
  { title: "헤더 아이템", items: headerContents, keyPrefix: "header" },
  { title: "메인 섹션", items: mainSectionContents, keyPrefix: "mainSection" },
  { title: "메인 아이템", items: mainContents, keyPrefix: "mainItem" },
  { title: "푸터 아이템", items: footerContents, keyPrefix: "footer" },
];

export default function Legocode() {
  const mainContentRef = useRef(null);

  const [droppedHtml, setDroppedHtml] = useState({
    header: "",
    mainSection: "",
    mainRow: {},
    footerLeft: "",
    footerRight: "",
  });

  const [toasts, setToasts] = useState([]);

  const mainSectionDisplayHtml = useMemo(() => {
    return buildMainSectionHtml(droppedHtml.mainSection, droppedHtml.mainRow);
  }, [droppedHtml.mainSection, droppedHtml.mainRow]);

  // span 클릭 → input 표시, input 입력 → span에 반영
  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    const closeAllTitleInputs = () => {
      mainContent.querySelectorAll(".th-title.is-editing").forEach((th) => {
        th.classList.remove("is-editing");
      });
    };

    const finishTitleEdit = (input) => {
      const th = input.closest(".th-title");
      const label = th?.querySelector(".th-title-label");
      if (!th || !label) return;

      const value = input.value.trim();
      label.textContent = value || "제목작성";
      th.classList.remove("is-editing");
    };

    const handleClick = (event) => {
      const label = event.target.closest(".th-title-label");
      if (!label) return;

      const th = label.closest(".th-title");
      const input = th?.querySelector(".th-title-input");
      if (!th || !input || th.classList.contains("is-editing")) return;

      event.stopPropagation();
      closeAllTitleInputs();

      th.classList.add("is-editing");
      input.value = label.textContent.trim() === "제목작성" ? "" : label.textContent.trim();
      input.focus();
      input.select();
    };

    const handleInput = (event) => {
      const input = event.target.closest(".th-title-input");
      if (!input) return;

      const label = input.closest(".th-title")?.querySelector(".th-title-label");
      if (label) {
        label.textContent = input.value;
      }
    };

    const handleKeyDown = (event) => {
      const input = event.target.closest(".th-title-input");
      if (!input) return;

      if (event.key === "Enter") {
        event.preventDefault();
        finishTitleEdit(input);
        return;
      }

      if (event.key === "Escape") {
        event.preventDefault();
        finishTitleEdit(input);
      }
    };

    const handleBlur = (event) => {
      const input = event.target.closest(".th-title-input");
      if (!input) return;

      finishTitleEdit(input);
    };

    mainContent.addEventListener("click", handleClick);
    mainContent.addEventListener("input", handleInput);
    mainContent.addEventListener("keydown", handleKeyDown);
    mainContent.addEventListener("blur", handleBlur, true);

    return () => {
      mainContent.removeEventListener("click", handleClick);
      mainContent.removeEventListener("input", handleInput);
      mainContent.removeEventListener("keydown", handleKeyDown);
      mainContent.removeEventListener("blur", handleBlur, true);
    };
  }, [mainSectionDisplayHtml]);

  const showToast = (message) => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const handleDragStart = (event, component) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(component));
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!checkLayout(mainContentRef.current)) {
      showToast("main-content 안에 header, main, footer가 필요합니다.");
      return;
    }

    const dropTarget = getDropTarget(event, mainContentRef.current);
    const component = JSON.parse(event.dataTransfer.getData("text/plain"));
    const htmlCode = changeToHtml(component.code);

    // header
    if (component.zone === "header") {
      const dropZone = findDropZone(dropTarget);
      if (dropZone !== "header") {
        showToast("헤더 컴포넌트는 header / search-pnl 영역에 드롭해주세요.");
        return;
      }

      setDroppedHtml((prev) => ({ ...prev, header: prev.header + htmlCode }));
      return;
    }

    // main - target으로 구분 (zone만으로는 section/tr 구분 불가)
    if (component.zone === "main") {
      // mainSectionContents → .main-section
      if (component.target === "section") {
        if (!isMainSectionArea(dropTarget)) {
          showToast("메인 섹션은 main-section 영역에 드롭해주세요.");
          return;
        }

        setDroppedHtml((prev) => ({
          ...prev,
          mainSection: prev.mainSection + htmlCode,
        }));
        return;
      }

      // mainContents → tbody > tr
      if (component.target === "tr") {
        if (!isTableRowArea(dropTarget)) {
          showToast("메인 아이템은 table tbody > tr 영역에 드롭해주세요. Column1을 먼저 추가하세요.");
          return;
        }

        const rowKey = findRowKey(mainContentRef.current, dropTarget);
        if (!rowKey) {
          showToast("table tbody > tr을 찾을 수 없습니다. Column1 섹션을 먼저 추가해주세요.");
          return;
        }

        setDroppedHtml((prev) => ({
          ...prev,
          mainRow: {
            ...prev.mainRow,
            [rowKey]: (prev.mainRow[rowKey] || "") + htmlCode,
          },
        }));
        return;
      }

      showToast("알 수 없는 main 컴포넌트 target입니다.");
      return;
    }

    // footer
    if (component.zone === "footer") {
      const dropZone = findDropZone(dropTarget);
      if (dropZone !== "footer") {
        showToast("푸터 컴포넌트는 footer 영역에 드롭해주세요.");
        return;
      }

      const footerSlot = findFooterSlot(dropTarget, event.clientX);
      if (!footerSlot) return;

      if (footerSlot === "footerLeft") {
        setDroppedHtml((prev) => ({ ...prev, footerLeft: prev.footerLeft + htmlCode }));
        return;
      }

      setDroppedHtml((prev) => ({ ...prev, footerRight: prev.footerRight + htmlCode }));
      return;
    }

    showToast("지원하지 않는 컴포넌트 zone입니다.");
  };

  return (
    <>
      <div className="legocode-page">
        <div className="legocode-page-component-list">
          {componentGroups.map((group) => (
            <div key={group.keyPrefix}>
              <div className="legocode-page-component-list-title">{group.title}</div>

              {group.items.map((component, index) => (
                <div
                  className="legocode-component-item"
                  key={`${group.keyPrefix}-${index}`}
                  draggable
                  onDragStart={(event) => handleDragStart(event, component)}
                >
                  <div>{component.title}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="legocode-page-legoZone">
          <div className="main-layout">
            <div
              className="main-content"
              ref={mainContentRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <header>
                <div
                  className="search-pnl"
                  dangerouslySetInnerHTML={{ __html: droppedHtml.header }}
                />
              </header>

              <main>
                <div
                  className="main-section"
                  dangerouslySetInnerHTML={{ __html: mainSectionDisplayHtml }}
                />
              </main>

              <footer>
                <div className="footer-menu">
                  <ul>
                    <li dangerouslySetInnerHTML={{ __html: droppedHtml.footerLeft }}></li>
                    <li dangerouslySetInnerHTML={{ __html: droppedHtml.footerRight }}></li>
                  </ul>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <ToastPopup toasts={toasts} onClose={removeToast} />
    </>
  );
}
