/**
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *  legocode/page.js — 레고식 UI 빌더 메인 페이지
 * ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
 *
 * [이 페이지가 하는 일]
 *  왼쪽 컴포넌트 목록 → 드래그 → 오른쪽 레이아웃에 드롭 → 화면 조립
 *
 * [파일 구조]
 *  1. import
 *  2. 상수 (CSS 선택자, 컴포넌트 그룹)
 *  3. HTML 변환 / 드롭 아이템 관련 함수
 *  4. 메인 섹션 HTML 조립 함수
 *  5. 드롭 위치 판별 함수
 *  6. Legocode 컴포넌트 (상태 → 이벤트 → 화면)
 */
"use client";

// ─────────────────────────────────────────────
// 1. import
// ─────────────────────────────────────────────

import { useEffect, useMemo, useRef, useState } from "react";
import "./legocode.css";
import { headerContents, mainSectionContents, mainContents, footerContents } from "./data";
import ToastPopup from "./toastPopup";

// ─────────────────────────────────────────────
// 2. 상수
// ─────────────────────────────────────────────

/** 테이블 tbody를 찾을 때 쓰는 CSS 선택자 (여러 함수에서 공통 사용) */
const TABLE_TBODY_SELECTOR =
  ".main-section .main-section-Column-Item .table-pnl table tbody";
const TABLE_SELECTOR = ".main-section .main-section-Column-Item .table-pnl table";
const TABLE_PNL_SELECTOR = ".main-section .main-section-Column-Item .table-pnl";
const COLUMN_ITEM_SELECTOR = ".main-section .main-section-Column-Item";

/** 왼쪽 패널에 보여줄 컴포넌트 카테고리 (data.js 내용을 그룹으로 묶음) */
const componentGroups = [
  { title: "헤더 아이템", items: headerContents, keyPrefix: "header" },
  { title: "메인 섹션", items: mainSectionContents, keyPrefix: "mainSection" },
  { title: "메인 아이템", items: mainContents, keyPrefix: "mainItem" },
  { title: "푸터 아이템", items: footerContents, keyPrefix: "footer" },
];

// ─────────────────────────────────────────────
// 3. HTML 변환 / 드롭 아이템 관련 함수
// ─────────────────────────────────────────────

/** data.js의 className → 실제 HTML class 로 변환 */
function changeToHtml(code) {
  return code.trim().replace(/className=/g, "class=");
}

/**
 * 드롭된 컴포넌트 1개를 저장할 객체 생성
 * - id  : 삭제할 때 구분하는 고유 번호
 * - html: 화면에 넣을 HTML 문자열
 */
function createDroppedItem(html) {
  return {
    id: `legocode-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    html,
  };
}

/** 배열 → HTML 문자열 (wrapFn으로 각 아이템을 감싼 뒤 이어 붙임) */
function itemsToHtml(items, wrapFn) {
  return items.map(wrapFn).join("");
}

// --- 영역별 HTML 래핑 (우클릭 삭제를 위해 data 속성 붙임) ---

function wrapHeaderItem(item) {
  return `<div class="legocode-dropped-item" data-legocode-id="${item.id}" data-legocode-zone="header">${item.html}</div>`;
}

function wrapMainSectionItem(item) {
  return `<div class="legocode-dropped-item" data-legocode-id="${item.id}" data-legocode-zone="mainSection">${item.html}</div>`;
}

function wrapFooterItem(item, zone) {
  return `<div class="legocode-dropped-item" data-legocode-id="${item.id}" data-legocode-zone="${zone}">${item.html}</div>`;
}

/** 테이블 tr 안 아이템 — div로 감쌀 수 없어서 th/td에 직접 속성 부여 */
function wrapMainRowItemHtml(item, rowKey) {
  const container = document.createElement("tbody");
  container.innerHTML = `<tr>${item.html.trim()}</tr>`;

  container.querySelectorAll(":scope > tr > th, :scope > tr > td").forEach((cell) => {
    cell.setAttribute("data-legocode-id", item.id);
    cell.setAttribute("data-legocode-zone", "mainRow");
    cell.setAttribute("data-legocode-row-key", rowKey);
    cell.classList.add("legocode-dropped-item");
  });

  return container.querySelector("tr").innerHTML;
}

/** tr 한 줄에 mainRow 아이템들 삽입 (빈 td placeholder면 교체, 아니면 뒤에追加) */
function applyRowItems(row, rowItems, rowKey) {
  if (!rowItems.length) return;

  const cellHtml = rowItems.map((item) => wrapMainRowItemHtml(item, rowKey)).join("");
  const isEmptyPlaceholderRow =
    row.children.length === 1 &&
    row.children[0].tagName === "TD" &&
    row.children[0].children.length === 0 &&
    !row.children[0].textContent.trim();

  if (isEmptyPlaceholderRow) {
    row.innerHTML = cellHtml;
    return;
  }

  row.insertAdjacentHTML("beforeend", cellHtml);
}

// ─────────────────────────────────────────────
// 4. 메인 섹션 HTML 조립
// ─────────────────────────────────────────────

/**
 * 메인 섹션 최종 HTML 생성 순서:
 *  1) Column 섹션 HTML 붙이기
 *  2) tbody별 추가 tr 붙이기 (tr 추가 기능)
 *  3) 각 tr에 mainRow 아이템 삽입
 */
function buildMainSectionHtml(mainSectionItems, mainRowItems, mainExtraRows) {
  const mainSectionHtml = itemsToHtml(mainSectionItems, wrapMainSectionItem);
  if (!mainSectionHtml) return "";

  const container = document.createElement("div");
  container.innerHTML = mainSectionHtml;

  const tbodies = container.querySelectorAll(
    ".main-section-Column-Item .table-pnl table tbody"
  );

  tbodies.forEach((tbody, tbodyIndex) => {
    const extraRowCount = mainExtraRows[String(tbodyIndex)] || 0;

    for (let i = 0; i < extraRowCount; i += 1) {
      tbody.insertAdjacentHTML("beforeend", "<tr></tr>");
    }

    tbody.querySelectorAll(":scope > tr").forEach((row, rowIndex) => {
      const rowKey = `${tbodyIndex}-${rowIndex}`; // 예: "0-0", "0-1"
      applyRowItems(row, mainRowItems[rowKey] || [], rowKey);
    });
  });

  return container.innerHTML;
}

// ─────────────────────────────────────────────
// 5. 드롭 위치 판별 함수
// ─────────────────────────────────────────────

/** header / main / footer 3개가 있는지 확인 */
function checkLayout(mainContentElement) {
  if (!mainContentElement) return false;

  return Boolean(
    mainContentElement.querySelector(":scope > header") &&
      mainContentElement.querySelector(":scope > main") &&
      mainContentElement.querySelector(":scope > footer")
  );
}

/** 드롭 시 마우스 좌표 아래 실제 DOM 요소 찾기 */
function getDropTarget(event, mainContentElement) {
  const elements = document.elementsFromPoint(event.clientX, event.clientY);

  for (const element of elements) {
    if (mainContentElement?.contains(element)) {
      return element;
    }
  }

  return event.target;
}

/** header / footer 영역 판별 */
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

/** 메인 섹션(Column) 드롭 가능 영역인지 */
function isMainSectionArea(dropTarget) {
  return Boolean(dropTarget.closest("main") || dropTarget.closest(".main-section"));
}

// --- 테이블 tbody / tr 관련 ---

/** 요소 기준으로 tbody 찾기 (table-pnl 빈 공간도 포함) */
function getTbodyFromElement(element) {
  if (!element?.closest) return null;

  const tbodyDirect = element.closest(TABLE_TBODY_SELECTOR);
  if (tbodyDirect) return tbodyDirect;

  const table = element.closest(TABLE_SELECTOR);
  if (table) return table.querySelector("tbody");

  const tablePnl = element.closest(TABLE_PNL_SELECTOR);
  if (tablePnl) return tablePnl.querySelector("table tbody");

  const columnItem = element.closest(COLUMN_ITEM_SELECTOR);
  if (columnItem) return columnItem.querySelector(".table-pnl table tbody");

  return null;
}

/** 마우스 좌표 기준 tbody 찾기 */
function findTableTbody(event, mainContentElement, dropTarget) {
  const elements = document.elementsFromPoint(event.clientX, event.clientY);

  for (const element of elements) {
    if (!mainContentElement?.contains(element)) continue;

    const tbody = getTbodyFromElement(element);
    if (tbody && mainContentElement.contains(tbody)) return tbody;
  }

  const fallbackTbody = getTbodyFromElement(dropTarget);
  if (fallbackTbody && mainContentElement.contains(fallbackTbody)) return fallbackTbody;

  return null;
}

/** tr 추가 드롭 가능 영역인지 */
function isTableTbodyArea(event, mainContentElement, dropTarget) {
  return Boolean(findTableTbody(event, mainContentElement, dropTarget));
}

/** 메인 아이템 드롭 가능 영역(tr)인지 */
function isTableRowArea(event, mainContentElement, dropTarget) {
  const elements = document.elementsFromPoint(event.clientX, event.clientY);

  for (const element of elements) {
    if (!mainContentElement?.contains(element)) continue;
    if (element.closest?.(`${TABLE_TBODY_SELECTOR} tr`)) return true;
  }

  if (dropTarget.closest(`${TABLE_TBODY_SELECTOR} tr`)) return true;

  const tbody = findTableTbody(event, mainContentElement, dropTarget);
  return Boolean(tbody?.querySelector(":scope > tr"));
}

/** tbody index key 반환 (예: "0", "1") */
function findTbodyKey(mainContentElement, event, dropTarget) {
  const tbody = findTableTbody(event, mainContentElement, dropTarget);
  if (!tbody) return null;

  const tbodyIndex = Array.from(
    mainContentElement.querySelectorAll(TABLE_TBODY_SELECTOR)
  ).indexOf(tbody);

  return tbodyIndex >= 0 ? String(tbodyIndex) : null;
}

/** tr index key 반환 (예: "0-0") — 드롭 Y좌표로 가장 가까운 행 선택 */
function findRowKey(mainContentElement, clientY, event, dropTarget) {
  const tbody = findTableTbody(event, mainContentElement, dropTarget);
  if (!tbody) return null;

  const tbodyIndex = Array.from(
    mainContentElement.querySelectorAll(TABLE_TBODY_SELECTOR)
  ).indexOf(tbody);
  if (tbodyIndex < 0) return null;

  const rows = tbody.querySelectorAll(":scope > tr");
  if (!rows.length) return null;

  let rowIndex = -1;

  if (clientY != null) {
    for (let i = 0; i < rows.length; i += 1) {
      const rect = rows[i].getBoundingClientRect();
      if (clientY >= rect.top && clientY <= rect.bottom) {
        rowIndex = i;
        break;
      }
    }

    if (rowIndex < 0) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      rows.forEach((row, index) => {
        const rect = row.getBoundingClientRect();
        const distance = Math.abs(clientY - (rect.top + rect.height / 2));

        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      rowIndex = nearestIndex;
    }
  } else {
    rowIndex = 0;
  }

  return `${tbodyIndex}-${rowIndex}`;
}

/** 푸터 좌/우 슬롯 판별 */
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

  return mouseX < ulCenterX ? "footerLeft" : "footerRight";
}

// ─────────────────────────────────────────────
// 6. Legocode 컴포넌트
// ─────────────────────────────────────────────

export default function Legocode() {
  // ── 6-1. ref / state ──

  /** 오른쪽 레이아웃 DOM 참조 (제목 수정, 우클릭 등) */
  const mainContentRef = useRef(null);

  /**
   * 드롭된 컴포넌트 저장소
   * - header, mainSection, footerLeft, footerRight : 배열
   * - mainRow      : { "0-0": [...], "0-1": [...] }  ← tr별 아이템
   * - mainExtraRows: { "0": 2 }                     ← tbody별 추가 tr 개수
   */
  const [droppedItems, setDroppedItems] = useState({
    header: [],
    mainSection: [],
    mainRow: {},
    mainExtraRows: {},
    footerLeft: [],
    footerRight: [],
  });

  const [toasts, setToasts] = useState([]); // 하단 알림
  const [contextMenu, setContextMenu] = useState(null); // 우클릭 메뉴
  const [isComponentListOpen, setIsComponentListOpen] = useState(true); // 왼쪽 패널
  const [isSectionBorderVisible, setIsSectionBorderVisible] = useState(true); // 테두리 ON/OFF

  // ── 6-2. state → HTML 변환 (useMemo: 데이터 바뀔 때만 재계산) ──

  const headerHtml = useMemo(
    () => itemsToHtml(droppedItems.header, wrapHeaderItem),
    [droppedItems.header]
  );

  const footerLeftHtml = useMemo(
    () => itemsToHtml(droppedItems.footerLeft, (item) => wrapFooterItem(item, "footerLeft")),
    [droppedItems.footerLeft]
  );

  const footerRightHtml = useMemo(
    () => itemsToHtml(droppedItems.footerRight, (item) => wrapFooterItem(item, "footerRight")),
    [droppedItems.footerRight]
  );

  const mainSectionDisplayHtml = useMemo(() => {
    return buildMainSectionHtml(
      droppedItems.mainSection,
      droppedItems.mainRow,
      droppedItems.mainExtraRows
    );
  }, [droppedItems.mainSection, droppedItems.mainRow, droppedItems.mainExtraRows]);

  // ── 6-3. useEffect — DOM 이벤트 등록 ──

  /** 테이블 제목(th) 클릭 → 인라인 수정 */
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

      label.textContent = input.value.trim() || "제목작성";
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
      if (label) label.textContent = input.value;
    };

    const handleKeyDown = (event) => {
      const input = event.target.closest(".th-title-input");
      if (!input) return;

      if (event.key === "Enter" || event.key === "Escape") {
        event.preventDefault();
        finishTitleEdit(input);
      }
    };

    const handleBlur = (event) => {
      const input = event.target.closest(".th-title-input");
      if (input) finishTitleEdit(input);
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

  /** 우클릭 메뉴 열릴 때 선택 컴포넌트 하이라이트 */
  useEffect(() => {
    if (!contextMenu) return;

    document
      .querySelectorAll(`[data-legocode-id="${contextMenu.id}"]`)
      .forEach((element) => element.classList.add("is-context-open"));

    return () => {
      document
        .querySelectorAll(".legocode-dropped-item.is-context-open")
        .forEach((element) => element.classList.remove("is-context-open"));
    };
  }, [contextMenu]);

  /** 메뉴 바깥 클릭 시 우클릭 메뉴 닫기 */
  useEffect(() => {
    if (!contextMenu) return;

    const closeMenu = () => setContextMenu(null);

    const handleDocumentClick = (event) => {
      if (event.target.closest(".legocode-context-menu")) return;
      closeMenu();
    };

    const handleDocumentContextMenu = (event) => {
      if (event.target.closest(".legocode-context-menu")) return;
      if (event.target.closest(".legocode-dropped-item")) return;
      closeMenu();
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("contextmenu", handleDocumentContextMenu);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("contextmenu", handleDocumentContextMenu);
    };
  }, [contextMenu]);

  /** 드롭된 컴포넌트 우클릭 → 삭제 메뉴 표시 */
  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    const handleContextMenu = (event) => {
      const droppedItem = event.target.closest(".legocode-dropped-item");
      if (!droppedItem || !mainContent.contains(droppedItem)) return;

      event.preventDefault();
      event.stopPropagation();

      const { legocodeId, legocodeZone, legocodeRowKey } = droppedItem.dataset;
      if (!legocodeId || !legocodeZone) return;

      setContextMenu({
        x: event.clientX,
        y: event.clientY,
        id: legocodeId,
        zone: legocodeZone,
        rowKey: legocodeRowKey,
      });
    };

    mainContent.addEventListener("contextmenu", handleContextMenu);

    return () => {
      mainContent.removeEventListener("contextmenu", handleContextMenu);
    };
  }, [mainSectionDisplayHtml, headerHtml, footerLeftHtml, footerRightHtml]);

  // ── 6-4. 삭제 / 토스트 ──

  /** droppedItems에서 id에 해당하는 아이템 1개 제거 */
  const removeDroppedItem = (id, zone, rowKey) => {
    setDroppedItems((prev) => {
      if (zone === "mainRow" && rowKey) {
        const nextRowItems = (prev.mainRow[rowKey] || []).filter((item) => item.id !== id);
        const nextMainRow = { ...prev.mainRow };

        if (nextRowItems.length > 0) {
          nextMainRow[rowKey] = nextRowItems;
        } else {
          delete nextMainRow[rowKey];
        }

        return { ...prev, mainRow: nextMainRow };
      }

      return {
        ...prev,
        [zone]: prev[zone].filter((item) => item.id !== id),
      };
    });
  };

  const handleDeleteContextItem = () => {
    if (!contextMenu) return;

    removeDroppedItem(contextMenu.id, contextMenu.zone, contextMenu.rowKey);
    setContextMenu(null);
  };

  const showToast = (message) => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  // ── 6-5. 드래그 앤 드롭 ──

  const handleDragStart = (event, component) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(component));
  };

  const handleDragOver = (event) => {
    event.preventDefault(); // drop 허용에 필수
  };

  /**
   * 드롭 처리
   * component.zone  → header / main / footer
   * component.target → section / tbody / tr (main만 해당)
   */
  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!checkLayout(mainContentRef.current)) {
      showToast("main-content 안에 header, main, footer가 필요합니다.");
      return;
    }

    const dropTarget = getDropTarget(event, mainContentRef.current);
    const component = JSON.parse(event.dataTransfer.getData("text/plain"));

    // ── 헤더 ──
    if (component.zone === "header") {
      const dropZone = findDropZone(dropTarget);
      if (dropZone !== "header") {
        showToast("헤더 컴포넌트는 header / search-pnl 영역에 드롭해주세요.");
        return;
      }

      setDroppedItems((prev) => ({
        ...prev,
        header: [...prev.header, createDroppedItem(changeToHtml(component.code))],
      }));
      return;
    }

    // ── 메인 ──
    if (component.zone === "main") {
      // Column 섹션 추가
      if (component.target === "section") {
        if (!isMainSectionArea(dropTarget)) {
          showToast("메인 섹션은 main-section 영역에 드롭해주세요.");
          return;
        }

        setDroppedItems((prev) => ({
          ...prev,
          mainSection: [...prev.mainSection, createDroppedItem(changeToHtml(component.code))],
        }));
        return;
      }

      // tr 추가 (tbody에 빈 행 1개)
      if (component.target === "tbody") {
        if (!isTableTbodyArea(event, mainContentRef.current, dropTarget)) {
          showToast("tr 추가는 table tbody 영역에 드롭해주세요. Column 섹션을 먼저 추가하세요.");
          return;
        }

        const tbodyKey = findTbodyKey(mainContentRef.current, event, dropTarget);
        if (tbodyKey === null) {
          showToast("tbody를 찾을 수 없습니다. Column 섹션을 먼저 추가해주세요.");
          return;
        }

        setDroppedItems((prev) => ({
          ...prev,
          mainExtraRows: {
            ...prev.mainExtraRows,
            [tbodyKey]: (prev.mainExtraRows[tbodyKey] || 0) + 1,
          },
        }));
        return;
      }

      // tr 안에 아이템 추가 (타이틀+인풋, 인풋 등)
      if (component.target === "tr") {
        if (!isTableRowArea(event, mainContentRef.current, dropTarget)) {
          showToast("메인 아이템은 table tbody > tr 영역에 드롭해주세요. Column을 먼저 추가하세요.");
          return;
        }

        const rowKey = findRowKey(
          mainContentRef.current,
          event.clientY,
          event,
          dropTarget
        );
        if (!rowKey) {
          showToast("table tbody > tr을 찾을 수 없습니다. Column 섹션을 먼저 추가해주세요.");
          return;
        }

        setDroppedItems((prev) => ({
          ...prev,
          mainRow: {
            ...prev.mainRow,
            [rowKey]: [...(prev.mainRow[rowKey] || []), createDroppedItem(changeToHtml(component.code))],
          },
        }));
        return;
      }

      showToast("알 수 없는 main 컴포넌트 target입니다.");
      return;
    }

    // ── 푸터 ──
    if (component.zone === "footer") {
      const dropZone = findDropZone(dropTarget);
      if (dropZone !== "footer") {
        showToast("푸터 컴포넌트는 footer 영역에 드롭해주세요.");
        return;
      }

      const footerSlot = findFooterSlot(dropTarget, event.clientX);
      if (!footerSlot) return;

      const htmlCode = changeToHtml(component.code);

      if (footerSlot === "footerLeft") {
        setDroppedItems((prev) => ({
          ...prev,
          footerLeft: [...prev.footerLeft, createDroppedItem(htmlCode)],
        }));
        return;
      }

      setDroppedItems((prev) => ({
        ...prev,
        footerRight: [...prev.footerRight, createDroppedItem(htmlCode)],
      }));
      return;
    }

    showToast("지원하지 않는 컴포넌트 zone입니다.");
  };

  // ── 6-6. 화면(JSX) ──

  return (
    <>
      <div className="legocode-page">
        {/* 왼쪽 패널 닫혔을 때 열기 버튼 */}
        {!isComponentListOpen && (
          <button
            type="button"
            className="legocode-sidebar-open-btn"
            aria-label="컴포넌트 목록 열기"
            onClick={() => setIsComponentListOpen(true)}
          >
            <span className="legocode-sidebar-open-icon" aria-hidden="true" />
          </button>
        )}

        {/* 왼쪽: 드래그 가능한 컴포넌트 목록 */}
        <aside
          className={`legocode-sidebar ${isComponentListOpen ? "is-open" : "is-closed"}`}
          aria-hidden={!isComponentListOpen}
        >
          <div className="legocode-page-component-list">
            <div className="legocode-page-component-list-header">
              <span className="legocode-page-component-list-heading">
                컴포넌트 (삭제는 마우스 오른쪽 버튼)
              </span>
              <button
                type="button"
                className="legocode-sidebar-close-btn"
                aria-label="컴포넌트 목록 닫기"
                onClick={() => setIsComponentListOpen(false)}
              >
                <span className="legocode-sidebar-close-icon" aria-hidden="true" />
              </button>
            </div>

            {componentGroups.map((group) => (
              <details key={group.keyPrefix} className="legocode-component-group">
                <summary className="legocode-page-component-list-title">{group.title}</summary>

                <div className="legocode-component-group-items">
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
              </details>
            ))}
          </div>
        </aside>

        {/* 오른쪽: 레고 조립 영역 */}
        <div
          className={`legocode-page-legoZone ${isSectionBorderVisible ? "is-section-border-on" : "is-section-border-off"}`}
        >
          <div className="main-layout">
            <div
              className="main-content"
              ref={mainContentRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              <header>
                <div className="search-pnl" dangerouslySetInnerHTML={{ __html: headerHtml }} />
              </header>

              <main>
                {/* 테두리 ON/OFF 토글 */}
                <div className="legocode-section-border-toolbar">
                  <button
                    type="button"
                    className={`legocode-section-border-toggle ${isSectionBorderVisible ? "is-on" : "is-off"}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      setIsSectionBorderVisible((prev) => !prev);
                    }}
                    aria-pressed={isSectionBorderVisible}
                  >
                    {isSectionBorderVisible ? "ON" : "OFF"}
                  </button>
                </div>

                <div
                  className="main-section"
                  dangerouslySetInnerHTML={{ __html: mainSectionDisplayHtml }}
                />
              </main>

              <footer>
                <div className="footer-menu">
                  <ul>
                    <li dangerouslySetInnerHTML={{ __html: footerLeftHtml }}></li>
                    <li dangerouslySetInnerHTML={{ __html: footerRightHtml }}></li>
                  </ul>
                </div>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <ToastPopup toasts={toasts} onClose={removeToast} />

      {/* 우클릭 삭제 메뉴 */}
      {contextMenu && (
        <div
          className="legocode-context-menu"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(event) => event.stopPropagation()}
        >
          <button
            type="button"
            className="legocode-context-menu-delete"
            onClick={handleDeleteContextItem}
          >
            삭제
          </button>
        </div>
      )}
    </>
  );
}
