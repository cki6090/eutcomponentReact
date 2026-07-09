/**
 * legocode 페이지
 *
 * 왼쪽 컴포넌트 목록에서 드래그 → 오른쪽 레이아웃(header / main / footer)에 드롭하면
 * 화면이 조립되는 "레고식" UI 빌더입니다.
 *
 * 주요 기능:
 * - 드래그 앤 드롭으로 컴포넌트 추가
 * - 우클릭 → 삭제 메뉴
 * - 테이블 제목(th) 클릭 → 제목 수정
 * - 잘못된 위치에 드롭하면 토스트(알림) 표시
 */
"use client";

// React 훅: 상태(useState), DOM 참조(useRef), 부수효과(useEffect), 계산 캐시(useMemo)
import { useEffect, useMemo, useRef, useState } from "react";
import "./legocode.css";
// data.js에 정의된 컴포넌트 목록 (헤더/메인/푸터 등)
import { headerContents, mainSectionContents, mainContents, footerContents } from "./data";
import ToastPopup from "./toastPopup";

// ─────────────────────────────────────────────
// 1. HTML 변환 / 드롭 아이템 관련 헬퍼 함수
// ─────────────────────────────────────────────

/** React JSX 문법(className)을 실제 HTML(class)로 바꿉니다 */
function changeToHtml(code) {
  const trimmedCode = code.trim();
  return trimmedCode.replace(/className=/g, "class=");
}

/**
 * 드롭된 컴포넌트 1개를 저장할 때 쓰는 객체를 만듭니다.
 * id: 나중에 삭제할 때 "어떤 것"인지 구분하는 고유 번호
 * html: 실제로 화면에 넣을 HTML 문자열
 */
function createDroppedItem(html) {
  return {
    id: `legocode-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    html,
  };
}

/** 헤더 영역에 넣을 HTML — 삭제/우클릭을 위해 div로 한 번 감쌉니다 */
function wrapHeaderItem(item) {
  return `<div class="legocode-dropped-item" data-legocode-id="${item.id}" data-legocode-zone="header">${item.html}</div>`;
}

/** 메인 섹션(Column 1/1, 1/2 등) HTML 래핑 */
function wrapMainSectionItem(item) {
  return `<div class="legocode-dropped-item" data-legocode-id="${item.id}" data-legocode-zone="mainSection">${item.html}</div>`;
}

/** 푸터 좌/우 HTML 래핑 (zone = footerLeft 또는 footerRight) */
function wrapFooterItem(item, zone) {
  return `<div class="legocode-dropped-item" data-legocode-id="${item.id}" data-legocode-zone="${zone}">${item.html}</div>`;
}

/**
 * 테이블 행(tr) 안에 넣는 아이템은 div로 감쌀 수 없어서
 * th / td 셀에 직접 data 속성을 붙입니다.
 */
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

/** 아이템 배열 → HTML 문자열로 합치기 (wrapFn으로 각각 감싼 뒤 이어 붙임) */
function itemsToHtml(items, wrapFn) {
  return items.map(wrapFn).join("");
}

// ─────────────────────────────────────────────
// 2. 드롭 위치 판별 헬퍼 함수
// ─────────────────────────────────────────────

/** header, main, footer 3개가 모두 있는지 확인 (레이아웃 최소 조건) */
function checkLayout(mainContentElement) {
  if (!mainContentElement) return false;

  const hasHeader = mainContentElement.querySelector(":scope > header");
  const hasMain = mainContentElement.querySelector(":scope > main");
  const hasFooter = mainContentElement.querySelector(":scope > footer");

  return hasHeader && hasMain && hasFooter;
}

/**
 * 드롭 시 마우스 아래 실제 요소 찾기
 * event.target만 쓰면 가끔 엉뚱한 요소가 잡혀서, 좌표 기준으로 다시 찾습니다.
 */
function getDropTarget(event, mainContentElement) {
  const elements = document.elementsFromPoint(event.clientX, event.clientY);

  for (const element of elements) {
    if (mainContentElement?.contains(element)) {
      return element;
    }
  }

  return event.target;
}

/** 드롭한 곳이 header 영역인지 footer 영역인지 판별 */
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

/** main-section 영역(메인 섹션 Column 드롭 가능 구역)인지 확인 */
function isMainSectionArea(dropTarget) {
  return Boolean(dropTarget.closest("main") || dropTarget.closest(".main-section"));
}

/** table tbody > tr 영역(메인 아이템 드롭 가능 구역)인지 확인 */
function isTableRowArea(dropTarget) {
  return Boolean(
    dropTarget.closest(".main-section .main-section-Column-Item .table-pnl table tbody tr") ||
      dropTarget.closest(".main-section .main-section-Column-Item .table-pnl table tbody") ||
      dropTarget.closest(".main-section .main-section-Column-Item .table-pnl table") ||
      dropTarget.closest(".main-section .main-section-Column-Item .table-pnl")
  );
}

/** 드롭한 위치에서 해당 table row(tr) 요소를 찾습니다 */
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

/**
 * 몇 번째 테이블의 몇 번째 행인지 key 생성 (예: "0-0", "1-0")
 * mainRow 상태에서 "어느 행에 넣었는지" 구분할 때 사용
 */
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

/**
 * 푸터에서 좌/우 어느 쪽에 넣을지 결정
 * li 위에 드롭했으면 li 기준, 빈 공간이면 마우스 X 좌표로 좌/우 판별
 */
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

// ─────────────────────────────────────────────
// 3. 메인 섹션 HTML 조립
// ─────────────────────────────────────────────

/**
 * 메인 섹션 최종 HTML 만들기
 * 1) Column 섹션 HTML을 먼저 붙이고
 * 2) 각 tr에 mainRow 아이템(타이틀+인풋 등)을 행 key별로 삽입
 */
function buildMainSectionHtml(mainSectionItems, mainRowItems) {
  const mainSectionHtml = itemsToHtml(mainSectionItems, wrapMainSectionItem);
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
      const rowItems = mainRowItems[rowKey] || [];
      const cellHtml = rowItems.map((item) => wrapMainRowItemHtml(item, rowKey)).join("");

      if (cellHtml) {
        row.insertAdjacentHTML("beforeend", cellHtml);
      }
    });
  });

  return container.innerHTML;
}

// ─────────────────────────────────────────────
// 4. 왼쪽 컴포넌트 목록 그룹 정의
// ─────────────────────────────────────────────

/** 왼쪽 패널에 보여줄 카테고리 (드롭다운 그룹) */
const componentGroups = [
  { title: "헤더 아이템", items: headerContents, keyPrefix: "header" },
  { title: "메인 섹션", items: mainSectionContents, keyPrefix: "mainSection" },
  { title: "메인 아이템", items: mainContents, keyPrefix: "mainItem" },
  { title: "푸터 아이템", items: footerContents, keyPrefix: "footer" },
];

// ─────────────────────────────────────────────
// 5. 메인 컴포넌트
// ─────────────────────────────────────────────

export default function Legocode() {
  // 오른쪽 레이아웃 DOM을 직접 참조 (제목 수정, 우클릭 등에 사용)
  const mainContentRef = useRef(null);

  /**
   * 드롭된 컴포넌트들을 영역별로 저장하는 상태
   * - header, mainSection, footerLeft, footerRight: 배열
   * - mainRow: { "0-0": [...], "1-0": [...] } 형태의 객체
   */
  const [droppedItems, setDroppedItems] = useState({
    header: [],
    mainSection: [],
    mainRow: {},
    footerLeft: [],
    footerRight: [],
  });

  // 하단 토스트(알림) 목록
  const [toasts, setToasts] = useState([]);
  // 우클릭 메뉴 위치/대상 (null이면 메뉴 숨김)
  const [contextMenu, setContextMenu] = useState(null);
  // 왼쪽 컴포넌트 목록 패널 열림/닫힘
  const [isComponentListOpen, setIsComponentListOpen] = useState(true);

  // ── 상태 → 화면 HTML 변환 (useMemo: 데이터가 바뀔 때만 다시 계산) ──

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
    return buildMainSectionHtml(droppedItems.mainSection, droppedItems.mainRow);
  }, [droppedItems.mainSection, droppedItems.mainRow]);

  // ── useEffect: 테이블 제목(th) 클릭 시 인라인 수정 ──
  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    // 다른 제목 편집 중이면 모두 닫기
    const closeAllTitleInputs = () => {
      mainContent.querySelectorAll(".th-title.is-editing").forEach((th) => {
        th.classList.remove("is-editing");
      });
    };

    // 입력 완료 → span(라벨)에 값 반영 후 편집 모드 종료
    const finishTitleEdit = (input) => {
      const th = input.closest(".th-title");
      const label = th?.querySelector(".th-title-label");
      if (!th || !label) return;

      const value = input.value.trim();
      label.textContent = value || "제목작성";
      th.classList.remove("is-editing");
    };

    // "제목작성" span 클릭 → input 표시
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

    // 입력하는 동안 span에 실시간 반영
    const handleInput = (event) => {
      const input = event.target.closest(".th-title-input");
      if (!input) return;

      const label = input.closest(".th-title")?.querySelector(".th-title-label");
      if (label) {
        label.textContent = input.value;
      }
    };

    // Enter: 저장 / Escape: 저장 후 닫기
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

    // input에서 포커스가 빠지면 저장
    const handleBlur = (event) => {
      const input = event.target.closest(".th-title-input");
      if (!input) return;

      finishTitleEdit(input);
    };

    mainContent.addEventListener("click", handleClick);
    mainContent.addEventListener("input", handleInput);
    mainContent.addEventListener("keydown", handleKeyDown);
    mainContent.addEventListener("blur", handleBlur, true);

    // 컴포넌트 unmount 시 이벤트 리스너 제거 (메모리 누수 방지)
    return () => {
      mainContent.removeEventListener("click", handleClick);
      mainContent.removeEventListener("input", handleInput);
      mainContent.removeEventListener("keydown", handleKeyDown);
      mainContent.removeEventListener("blur", handleBlur, true);
    };
  }, [mainSectionDisplayHtml]);

  // ── useEffect: 우클릭 메뉴 열릴 때 선택된 컴포넌트 하이라이트 ──
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

  // ── useEffect: 메뉴 바깥 클릭/우클릭 시 컨텍스트 메뉴 닫기 ──
  useEffect(() => {
    if (!contextMenu) return;

    const closeMenu = () => setContextMenu(null);

    const handleDocumentClick = (event) => {
      if (event.target.closest(".legocode-context-menu")) return;
      closeMenu();
    };

    const handleDocumentContextMenu = (event) => {
      if (event.target.closest(".legocode-context-menu")) return;
      if (event.target.closest(".legocode-dropped-item")) return; // 다른 컴포넌트 우클릭은 유지
      closeMenu();
    };

    document.addEventListener("click", handleDocumentClick);
    document.addEventListener("contextmenu", handleDocumentContextMenu);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
      document.removeEventListener("contextmenu", handleDocumentContextMenu);
    };
  }, [contextMenu]);

  // ── useEffect: 드롭된 컴포넌트 우클릭 → 삭제 메뉴 표시 ──
  useEffect(() => {
    const mainContent = mainContentRef.current;
    if (!mainContent) return;

    const handleContextMenu = (event) => {
      const droppedItem = event.target.closest(".legocode-dropped-item");
      if (!droppedItem || !mainContent.contains(droppedItem)) return;

      event.preventDefault(); // 브라우저 기본 우클릭 메뉴 막기
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

  /** 상태에서 id에 해당하는 드롭 아이템 1개 제거 */
  const removeDroppedItem = (id, zone, rowKey) => {
    setDroppedItems((prev) => {
      // 테이블 행 아이템은 mainRow 객체 안에서 삭제
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

      // header, mainSection, footerLeft, footerRight 배열에서 삭제
      return {
        ...prev,
        [zone]: prev[zone].filter((item) => item.id !== id),
      };
    });
  };

  /** 컨텍스트 메뉴의 "삭제" 버튼 클릭 */
  const handleDeleteContextItem = () => {
    if (!contextMenu) return;

    removeDroppedItem(contextMenu.id, contextMenu.zone, contextMenu.rowKey);
    setContextMenu(null);
  };

  /** 토스트(하단 알림) 표시 */
  const showToast = (message) => {
    setToasts((prev) => [...prev, { id: Date.now() + Math.random(), message }]);
  };

  /** 토스트 닫기 */
  const removeToast = (id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  /** 드래그 시작 — 컴포넌트 정보를 dataTransfer에 JSON으로 저장 */
  const handleDragStart = (event, component) => {
    event.dataTransfer.setData("text/plain", JSON.stringify(component));
  };

  /** 드래그 중 drop을 허용하려면 preventDefault 필요 */
  const handleDragOver = (event) => {
    event.preventDefault();
  };

  /** 드롭 처리 — zone(헤더/메인/푸터)과 target(section/tr)에 따라 저장 위치 결정 */
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

    // ── 헤더 컴포넌트 ──
    if (component.zone === "header") {
      const dropZone = findDropZone(dropTarget);
      if (dropZone !== "header") {
        showToast("헤더 컴포넌트는 header / search-pnl 영역에 드롭해주세요.");
        return;
      }

      setDroppedItems((prev) => ({
        ...prev,
        header: [...prev.header, createDroppedItem(htmlCode)],
      }));
      return;
    }

    // ── 메인 컴포넌트 (section = Column, tr = 행 안 아이템) ──
    if (component.zone === "main") {
      if (component.target === "section") {
        if (!isMainSectionArea(dropTarget)) {
          showToast("메인 섹션은 main-section 영역에 드롭해주세요.");
          return;
        }

        setDroppedItems((prev) => ({
          ...prev,
          mainSection: [...prev.mainSection, createDroppedItem(htmlCode)],
        }));
        return;
      }

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

        setDroppedItems((prev) => ({
          ...prev,
          mainRow: {
            ...prev.mainRow,
            [rowKey]: [...(prev.mainRow[rowKey] || []), createDroppedItem(htmlCode)],
          },
        }));
        return;
      }

      showToast("알 수 없는 main 컴포넌트 target입니다.");
      return;
    }

    // ── 푸터 컴포넌트 (좌/우 슬롯) ──
    if (component.zone === "footer") {
      const dropZone = findDropZone(dropTarget);
      if (dropZone !== "footer") {
        showToast("푸터 컴포넌트는 footer 영역에 드롭해주세요.");
        return;
      }

      const footerSlot = findFooterSlot(dropTarget, event.clientX);
      if (!footerSlot) return;

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

  // ─────────────────────────────────────────────
  // 6. 화면 렌더링 (JSX)
  // ─────────────────────────────────────────────

  return (
    <>
      <div className="legocode-page">
        {/* 패널이 닫혔을 때만 보이는 "열기" 버튼 */}
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

        {/* 왼쪽: 드래그 가능한 컴포넌트 목록 (접기/펼치기 가능) */}
        <aside
          className={`legocode-sidebar ${isComponentListOpen ? "is-open" : "is-closed"}`}
          aria-hidden={!isComponentListOpen}
        >
          <div className="legocode-page-component-list">
            <div className="legocode-page-component-list-header">
              <span className="legocode-page-component-list-heading">컴포넌트</span>
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
              <details key={group.keyPrefix} className="legocode-component-group" open>
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
        <div className="legocode-page-legoZone">
          <div className="main-layout">
            <div
              className="main-content"
              ref={mainContentRef}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            >
              {/* 헤더 — droppedItems.header → HTML로 변환해 삽입 */}
              <header>
                <div
                  className="search-pnl"
                  dangerouslySetInnerHTML={{ __html: headerHtml }}
                />
              </header>

              {/* 메인 — Column 섹션 + 행 아이템 합친 HTML */}
              <main>
                <div
                  className="main-section"
                  dangerouslySetInnerHTML={{ __html: mainSectionDisplayHtml }}
                />
              </main>

              {/* 푸터 — 좌/우 li에 각각 HTML 삽입 */}
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

      {/* 에러/안내 토스트 */}
      <ToastPopup toasts={toasts} onClose={removeToast} />

      {/* 우클릭 시 나타나는 삭제 메뉴 */}
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
