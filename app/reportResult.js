"use client";

import { useEffect, useRef, useState } from "react";

const REPORT_ITEMS = [
  {
    goalTitle: "목표 1",
    goalText: "디자인 시안 제작 후 퍼블리싱 화면 비교",
    goalAi: "gpt, gemini",
    progressText: (
      <>
        디자인을 요청할 경우 일반적으로 사용되는 UI·레이아웃을 중심으로 생성되어
        <br></br>
        <strong>
          원하는 디자인 방향과 세부적인 의도를 정확하게 반영하는 데 한계가
          있었음.
        </strong>
      </>
    ),
  },
  {
    goalTitle: "목표 2",
    goalText: "메인 로고, 아이콘 SVG 구현",
    goalAi: "claude, cursor",
    progressText: (
      <>
        기존에 제작된 이미지 또는 SVG를{" "}
        <strong>참조하여 변환·재구성하도록 요청할 경우 구현 가능</strong>
        했으나, 이미지에 대한 구체적인 기준 없이{" "}
        <strong>
          프롬프트만으로 SVG 제작을 요청할 경우 원하는 디자인 방향과 다른 결과
        </strong>
        을 만들어냄
      </>
    ),
  },
  {
    goalTitle: "목표 3",
    goalText: "스크롤 이벤트에 적합한 영상 콘텐츠 제작",
    goalAi: "gemini",
    progressText: (
      <>
        스크롤 인터랙션에 활용하기 위한 영상 제작을 진행하였으나,{" "}
        <strong>유사한 형태와 연출의 결과물이 반복적으로 생성</strong>되는
        경향을 확인. 사용 중인 AI 환경 및 생성 모델의 특성에 따른 결과 차이에
        대해서는 추가 검증 필요
        <br></br>
        <br></br>
        영상이 위에서 아래로 이동하거나, 페이드인 아웃, 선이 그어지는 등 연출을
        하면 스크롤 이벤트와 어울리는 효과를 줄 수 있음
      </>
    ),
  },
  {
    goalTitle: "목표 4",
    goalText: "스크롤 이벤트 스크립트 함수 및 로직의 재사용 구조화",
    goalAi: "cursor",
    progressText: (
      <>
        기존에는 공통 함수와 로직을 사전에 정리하여 재사용하는 것을 목표로
        하였으나, AI를 활용하면 요구사항에 맞는 기능과 로직을 즉시 생성·수정할
        수 있어 <strong>별도의 공통 함수 저장 및 관리의 필요성이 낮아짐</strong>
        을 확인
      </>
    ),
  },
  {
    goalTitle: "목표 5",
    goalText: "웹표준 페이지를 React 구조로 변환 및 적용",
    goalAi: "cursor",
    progressText: (
      <>
        기존 웹표준 HTML/CSS 기반 페이지를 React 구조로 변환하는 작업은{" "}
        <strong>AI 활용 효과가 높았으며</strong>, HTML·CSS·JavaScript 구조를
        분석하여 React 컴포넌트 형태로 변환하는 작업이 비교적 안정적으로
        수행됨을 확인
      </>
    ),
  },
];

const SLIDE_COUNT = REPORT_ITEMS.length + 1;
const INTRO_HOLD_PERCENT = 10;

function getMoveProgress(scrollPercent) {
  return Math.max(
    0,
    Math.min(
      1,
      (scrollPercent - INTRO_HOLD_PERCENT) / (100 - INTRO_HOLD_PERCENT),
    ),
  );
}

function getActiveSlideIndex(scrollPercent) {
  const moveProgress = getMoveProgress(scrollPercent);
  return Math.min(
    SLIDE_COUNT - 1,
    Math.round(moveProgress * (SLIDE_COUNT - 1)),
  );
}

// 방향키용: 슬라이드 사이에서는 "아직 이전/다음으로 안 간 상태"로 본다
function getSlideIndexForDirection(scrollPercent, direction) {
  const position = getMoveProgress(scrollPercent) * (SLIDE_COUNT - 1);

  if (direction === "next") {
    return Math.min(SLIDE_COUNT - 1, Math.floor(position + 0.001));
  }

  return Math.max(0, Math.ceil(position - 0.001));
}

function getScrollPercentForSlide(slideIndex) {
  if (slideIndex <= 0) return 0;
  return (
    INTRO_HOLD_PERCENT +
    (slideIndex / (SLIDE_COUNT - 1)) * (100 - INTRO_HOLD_PERCENT)
  );
}

function getScrollYForSlide(sectionEl, slideIndex) {
  const realHeight = sectionEl.offsetHeight - window.innerHeight;
  if (realHeight <= 0) return sectionEl.offsetTop;
  const percent = getScrollPercentForSlide(slideIndex);
  return sectionEl.offsetTop + (percent / 100) * realHeight;
}

function useSectionScroll() {
  const sectionRef = useRef(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    let ticking = false;
    const update = () => {
      ticking = false;
      const el = sectionRef.current;
      if (!el) return;
      const realHeight = el.offsetHeight - window.innerHeight;
      if (realHeight <= 0) return setScrollPercent(0);
      const percent = ((window.scrollY - el.offsetTop) / realHeight) * 100;
      setScrollPercent(Math.max(0, Math.min(100, percent)));
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return { sectionRef, scrollPercent };
}

export default function ReportResult() {
  const { sectionRef, scrollPercent } = useSectionScroll();
  const scrollPercentRef = useRef(scrollPercent);
  const isJumpingRef = useRef(false);

  // 0~INTRO_HOLD%는 표지 고정, 이후 구간에서만 좌우 슬라이드 이동
  const moveProgress = getMoveProgress(scrollPercent);
  const translateX = moveProgress * (SLIDE_COUNT - 1) * 100;
  const activeIndex = getActiveSlideIndex(scrollPercent);

  useEffect(() => {
    scrollPercentRef.current = scrollPercent;
  }, [scrollPercent]);

  useEffect(() => {
    const isSectionInView = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top <= window.innerHeight * 0.35 &&
        rect.bottom >= window.innerHeight * 0.55
      );
    };

    const handleKeyDown = (event) => {
      const isNext = event.key === "ArrowRight" || event.key === "ArrowDown";
      const isPrev = event.key === "ArrowLeft" || event.key === "ArrowUp";
      if (!isNext && !isPrev) return;

      const tagName = event.target?.tagName;
      if (
        tagName === "INPUT" ||
        tagName === "TEXTAREA" ||
        event.target?.isContentEditable
      ) {
        return;
      }

      const sectionEl = sectionRef.current;
      if (!sectionEl || !isSectionInView(sectionEl) || isJumpingRef.current) {
        return;
      }

      const direction = isNext ? "next" : "prev";
      const currentIndex = getSlideIndexForDirection(
        scrollPercentRef.current,
        direction,
      );
      const nextIndex = isNext ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex < 0 || nextIndex >= SLIDE_COUNT) return;

      event.preventDefault();
      isJumpingRef.current = true;
      window.scrollTo({
        top: getScrollYForSlide(sectionEl, nextIndex),
        behavior: "smooth",
      });

      window.setTimeout(() => {
        isJumpingRef.current = false;
      }, 600);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [sectionRef]);

  return (
    <section
      className="reportResult"
      ref={sectionRef}
      style={{ height: `${SLIDE_COUNT * 100}vh` }}
    >
      <div className="reportResultSticky">
        <div
          className="reportResultTrack"
          style={{ transform: `translate3d(-${translateX}vw, 0, 0)` }}
        >
          <article className="reportResultSlide reportResultIntro">
            <p className="reportResultEyebrow">Report</p>
            <h2 className="reportResultTitle">
              AI 개인과제 공유(3분기 개인과제)
            </h2>
          </article>

          {REPORT_ITEMS.map((item, index) => (
            <article
              key={item.goalTitle}
              className={`reportResultSlide${activeIndex === index + 1 ? " is-active" : ""}`}
            >
              <p className="reportResultSlideIndex">
                {String(index + 1).padStart(2, "0")} /{" "}
                {String(REPORT_ITEMS.length).padStart(2, "0")}
              </p>

              <div className="reportResultGoal">
                <strong>{item.goalTitle})</strong>
                <p>{item.goalText}</p>
              </div>

              <div className="reportResultProgress">
                <strong>진행 결과 및 검증 :</strong>
                <p>{item.progressText}</p>
              </div>

              <div className="reportResultAi">
                <strong>AI 모델 :</strong>
                <p>{item.goalAi}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="reportResultDots" aria-hidden="true">
          {Array.from({ length: SLIDE_COUNT }).map((_, index) => (
            <span
              key={index}
              className={`reportResultDot${activeIndex === index ? " is-active" : ""}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
