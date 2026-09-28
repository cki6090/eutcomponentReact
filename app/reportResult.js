"use client";

import { useEffect, useRef, useState } from "react";

const REPORT_ITEMS = [
  {
    goalTitle: "목표 1",
    goalText: "AI를 활용한 디자인 시안 추출 및 화면 퍼블리싱",
    progressText:
      "AI를 통해 원하는 디자인 방향을 구체적으로 구현하는 데에는 한계가 있었으며, 일반적으로 많이 사용되는 보편적인 UI·레이아웃은 비교적 쉽게 생성 가능함을 확인",
  },
  {
    goalTitle: "목표 2",
    goalText: "메인 로고 및 디자인 아이콘 SVG 구현",
    progressText:
      "기존에 제작된 이미지 또는 SVG를 참조하여 변환·재구성하도록 요청할 경우 높은 완성도로 구현 가능했으나, 이미지에 대한 구체적인 기준 없이 프롬프트만으로 SVG 제작을 요청할 경우 디자인 정확도가 낮아지는 경향을 확인",
  },
  {
    goalTitle: "목표 3",
    goalText: "스크롤 이벤트에 최적화된 영상 콘텐츠 제작",
    progressText:
      "스크롤 인터랙션에 활용하기 위한 영상 제작을 진행하였으나, 유사한 형태와 연출의 결과물이 반복적으로 생성되는 경향을 확인. 사용 중인 AI 환경 및 생성 모델의 특성에 따른 결과 차이에 대해서는 추가 검증 필요",
  },
  {
    goalTitle: "목표 4",
    goalText: "스크롤 이벤트 스크립트 함수 및 로직의 재사용 구조화",
    progressText:
      "기존에는 공통 함수와 로직을 사전에 정리하여 재사용하는 것을 목표로 하였으나, AI를 활용하면 요구사항에 맞는 기능과 로직을 즉시 생성·수정할 수 있어 별도의 대규모 공통 함수 저장 및 관리의 필요성이 낮아짐을 확인",
  },
  {
    goalTitle: "목표 5",
    goalText: "웹표준 페이지의 React 변환 및 적용",
    progressText:
      "기존 웹표준 HTML/CSS 기반 페이지를 React 구조로 변환하는 작업은 AI 활용 효과가 높았으며, HTML·CSS·JavaScript 구조를 분석하여 React 컴포넌트 형태로 변환하는 작업이 비교적 안정적으로 수행됨을 확인",
  },
];

const SLIDE_COUNT = REPORT_ITEMS.length + 1;
const INTRO_HOLD_PERCENT = 20;

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

  // 0~20%는 표지 고정, 20~100%에서만 좌우 슬라이드 이동
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

      const currentIndex = getActiveSlideIndex(scrollPercentRef.current);
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
      }, 450);
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
              <span>소개</span>
            </h2>
            <p className="reportResultLead">
              아래로 스크롤하면 목표별 결과가 좌우로 넘어갑니다.
            </p>
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
